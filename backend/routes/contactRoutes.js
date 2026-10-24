const express = require("express");
const router = express.Router();
const sendEmail = require("../config/email");
router.post("/", async (req, res) => {
try {
const { name, email, subject, message } = req.body;


// Validate required fields
if (
  !name?.trim() ||
  !email?.trim() ||
  !subject?.trim() ||
  !message?.trim()
) {
  return res.status(400).json({
    success: false,
    message: "Please fill in all fields.",
  });
}

// Prevent excessively large submissions
if (
  name.length > 100 ||
  email.length > 254 ||
  subject.length > 200 ||
  message.length > 5000
) {
  return res.status(400).json({
    success: false,
    message: "One or more fields are too long.",
  });
}

// Validate email format
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email.trim())) {
  return res.status(400).json({
    success: false,
    message: "Please enter a valid email address.",
  });
}

const safeName = name.trim();
const safeEmail = email.trim();
const safeSubject = subject.trim();
const safeMessage = message.trim();

const escapeHtml = (value) =>
  value.replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });

await sendEmail({
  to: "unihirex.app@gmail.com",
  replyTo: safeEmail,
  subject: `UniHirex: ${safeSubject}`,
  html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #0A0E27;">
      <div style="background: #0A0E27; padding: 24px; border-radius: 12px 12px 0 0;">
        <h2 style="color: #ffffff; margin: 0;">New Message From UniHirex Contact Form</h2>
        <p style="color: #B9C5FF; margin-bottom: 0;">UniHirex Website</p>
      </div>

      <div style="padding: 24px; border: 1px solid #E9ECF3; border-radius: 0 0 12px 12px;">
        <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>

        <hr style="border: none; border-top: 1px solid #E9ECF3; margin: 20px 0;" />

        <h3>Message</h3>
        <p style="line-height: 1.7; white-space: pre-wrap;">${escapeHtml(safeMessage)}</p>

        <p style="margin-top: 24px; color: #667085; font-size: 13px;">
          Reply directly to this email to respond to the sender.
        </p>
      </div>
    </div>
  `,
});

return res.status(200).json({
  success: true,
  message: "Your message has been sent successfully!",
});


} catch (error) {
console.error("Contact form email error:", error.message);


return res.status(500).json({
  success: false,
  message: "We could not send your message right now. Please try again later.",
});


}
});

module.exports = router;
