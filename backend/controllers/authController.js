const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../config/email");
const generateSecureToken = require("../utils/generateToken");

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// @route  POST /api/auth/register
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, companyName } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password, and role are required" });
    }

    if (role === "recruiter" && !companyName) {
      return res.status(400).json({ message: "Company name is required for recruiter accounts" });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const { rawToken, hashedToken } = generateSecureToken();

    const user = await User.create({
      name,
      email,
      password,
      role,
      companyName,
      isEmailVerified: role === "admin", // admins are created by trusted insiders, not self-registered
      emailVerificationToken: hashedToken,
      emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    });

    const verifyLink = `${FRONTEND_URL}/verify-email/${rawToken}`;
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify your UniHirex account",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
            <h2 style="color: #2340B8;">Welcome to UniHirex, ${user.name}!</h2>
            <p>Please verify your email address to activate your account.</p>
            <a href="${verifyLink}" style="display: inline-block; background: #7A1245; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 12px;">
              Verify Email
            </a>
            <p style="color: #64748B; font-size: 13px; margin-top: 20px;">This link expires in 24 hours.</p>
          </div>
        `,
      });
    } catch (emailErr) {
      console.error("Registration succeeded but verification email failed to send:", emailErr.message);
      // Registration still succeeds even if the email fails to send —
      // the user can request a resend later. Not worth blocking account creation over.
    }

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

// @route  POST /api/auth/login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Please verify your email before logging in. Check your inbox for the verification link." });
    }

    if (user.status === "Pending") {
      return res.status(403).json({ message: "Your recruiter account is still pending admin approval" });
    }

    if (user.status === "Suspended") {
      return res.status(403).json({ message: "This account has been suspended. Contact support." });
    }

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// @route  POST /api/auth/verify-email/:token
const verifyEmail = async (req, res) => {
  try {
    const hashedToken = require("crypto").createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: Date.now() },
    }).select("+emailVerificationToken +emailVerificationExpires");

    if (!user) {
      return res.status(400).json({ message: "This verification link is invalid or has expired" });
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Verification failed", error: err.message });
  }
};

// @route  POST /api/auth/resend-verification
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      // Deliberately vague — don't reveal whether an email exists in the system
      return res.json({ message: "If an account exists, a verification email has been sent" });
    }

    if (user.isEmailVerified) {
      return res.json({ message: "This account is already verified" });
    }

    const { rawToken, hashedToken } = generateSecureToken();
    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const verifyLink = `${FRONTEND_URL}/verify-email/${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your UniHirex account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #2340B8;">Verify your email</h2>
          <a href="${verifyLink}" style="display: inline-block; background: #7A1245; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 12px;">
            Verify Email
          </a>
          <p style="color: #64748B; font-size: 13px; margin-top: 20px;">This link expires in 24 hours.</p>
        </div>
      `,
    });

    res.json({ message: "If an account exists, a verification email has been sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to resend verification email", error: err.message });
  }
};

// @route  POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });

    if (!user) {
      // Same principle as resend-verification — don't reveal account existence
      return res.json({ message: "If an account exists, a reset link has been sent" });
    }

    const { rawToken, hashedToken } = generateSecureToken();
    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetLink = `${FRONTEND_URL}/reset-password/${rawToken}`;
    await sendEmail({
      to: user.email,
      subject: "Reset your UniHirex password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <h2 style="color: #2340B8;">Reset your password</h2>
          <p>We received a request to reset your password. This link expires in 1 hour.</p>
          <a href="${resetLink}" style="display: inline-block; background: #7A1245; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin-top: 12px;">
            Reset Password
          </a>
          <p style="color: #64748B; font-size: 13px; margin-top: 20px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    });

    res.json({ message: "If an account exists, a reset link has been sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to process request", error: err.message });
  }
};

// @route  POST /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const hashedToken = require("crypto").createHash("sha256").update(req.params.token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({ message: "This reset link is invalid or has expired" });
    }

    user.password = password; // will be hashed automatically by the pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reset password", error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};