import React, { useState } from "react";
import { COLORS, fontHead, fontBody } from "../../theme";
import StaticPageLayout from "../../components/home/StaticPageLayout";

const inputClass =
"w-full rounded-xl border border-[#E4E8F0] bg-white px-4 py-3 text-sm text-[#0A0E27] outline-none transition-all duration-200 placeholder:text-[#9AA3B5] focus:border-[#5B72D8] focus:ring-4 focus:ring-[#2340B8]/10 disabled:cursor-not-allowed disabled:opacity-60";

export default function Contact() {
const [form, setForm] = useState({
name: "",
email: "",
subject: "",
message: "",
});

const [submitted, setSubmitted] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [submitError, setSubmitError] = useState("");

const handleChange = (e) => {
setForm({
...form,
[e.target.name]: e.target.value,
});


setSubmitted(false);
setSubmitError("");


};

const handleSubmit = async (e) => {
e.preventDefault();


setSubmitted(false);
setSubmitError("");
setSubmitting(true);

try {
  const apiBaseUrl = import.meta.env.VITE_API_URL;

  if (!apiBaseUrl) {
    throw new Error(
      "Contact form is temporarily unavailable. Please try again later."
    );
  }

  const response = await fetch(
    `${apiBaseUrl.replace(/\/$/, "")}/contact`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Unable to send your message. Please try again."
    );
  }

  setSubmitted(true);

  setForm({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
} catch (error) {
  console.error("Contact form submission failed:", error);

  setSubmitError(
    error.message ||
      "Something went wrong. Please try again in a moment."
  );
} finally {
  setSubmitting(false);
}


};

const socialLinks = [
{
label: "LinkedIn",
description: "Connect professionally",
href: "https://www.linkedin.com/in/sehartahir/",
icon: "in",
},
{
label: "GitHub",
description: "Explore the project",
href: "https://github.com/Sehar-Tahir",
icon: "</>",
},
{
label: "Portfolio",
description: "Explore more work",
href: "https://sehar-portfolio-site.vercel.app/",
icon: "↗",
},
];

return ( <StaticPageLayout
   title="Let's start a conversation."
   subtitle="Have a question, feedback, or an idea for collaboration? We'd love to hear from you."
 > <div className="grid grid-cols-1 gap-8 md:grid-cols-[0.85fr_1.15fr] md:gap-10">
{/* Contact information */}
<section
className="relative overflow-hidden rounded-2xl p-6 text-white sm:p-7"
style={{
background:
"radial-gradient(circle at 100% 0%, rgba(91,114,216,0.28), transparent 40%), #0A0E27",
}}
> <div
         className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full border border-white/10"
         aria-hidden="true"
       />


      <div className="relative z-10">
        <span className="mb-4 inline-flex rounded-full border border-white/15 bg-white/[0.07] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#B9C5FF]">
          Get in touch
        </span>

        <h2
          className="mb-3 text-2xl font-bold leading-tight"
          style={fontHead}
        >
          We'd love to hear from you.
        </h2>

        <p className="mb-8 text-sm leading-6 text-white/60">
          Whether you're a student, recruiter, or simply exploring
          UniHireX, feel free to reach out.
        </p>

        <div className="mb-4 flex items-start gap-3 rounded-xl border border-white/10 bg-white/4 p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#2340B8]/30 text-lg text-[#B9C5FF]">
            ✦
          </div>

          <div>
            <p className="text-sm font-semibold">
              Questions or feedback?
            </p>

            <p className="mt-1 text-xs leading-5 text-white/55">
              Share your thoughts and help us improve the experience.
            </p>
          </div>
        </div>

        <p className="mb-3 mt-8 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/40">
          Find us online
        </p>

        <div className="flex flex-col gap-2">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-3 transition-all duration-200 hover:border-white/10 hover:bg-white/6"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/6 text-xs font-bold text-[#B9C5FF]">
                {link.icon}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-white">
                  {link.label}
                </span>

                <span className="mt-0.5 block text-xs text-white/45">
                  {link.description}
                </span>
              </span>

              <span className="text-sm text-white/40 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white">
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>

    {/* Contact form */}
    <section className="rounded-2xl border border-[#E9ECF3] bg-white p-5 shadow-[0_8px_35px_rgba(10,14,39,0.04)] sm:p-7">
      <div className="mb-6">
        <h2
          className="text-xl font-bold"
          style={{ ...fontHead, color: COLORS.textDark }}
        >
          Send us a message
        </h2>

        <p
          className="mt-2 text-sm leading-6"
          style={{ color: COLORS.textMuted }}
        >
          Fill out the form below to get in touch.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-5"
      >
        <div>
          <label
            htmlFor="contact-name"
            className="mb-2 block text-sm font-medium"
          >
            Full name
          </label>

          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
            className={inputClass}
            maxLength={100}
            disabled={submitting}
            required
          />
        </div>

        <div>
          <label
            htmlFor="contact-email"
            className="mb-2 block text-sm font-medium"
          >
            Email address
          </label>

          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
            maxLength={254}
            disabled={submitting}
            required
          />
        </div>

        <div>
          <label
            htmlFor="contact-subject"
            className="mb-2 block text-sm font-medium"
          >
            Subject
          </label>

          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="What is this about?"
            value={form.subject}
            onChange={handleChange}
            className={inputClass}
            maxLength={200}
            disabled={submitting}
            required
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="mb-2 block text-sm font-medium"
          >
            Message
          </label>

          <textarea
            id="contact-message"
            name="message"
            rows={5}
            placeholder="Tell us how we can help..."
            value={form.message}
            onChange={handleChange}
            className={`${inputClass} resize-y`}
            maxLength={5000}
            disabled={submitting}
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-none"
          style={{
            ...fontBody,
            background: COLORS.accent,
            boxShadow: "0 6px 18px rgba(122,18,69,0.18)",
          }}
        >
          {submitting ? "Sending..." : "Send message"}

          {!submitting && (
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          )}
        </button>

        {submitted && (
          <p
            className="text-sm leading-5 text-green-700"
            role="status"
            aria-live="polite"
          >
            Your message has been sent successfully! Thank you for
            contacting UniHireX.
          </p>
        )}

        {submitError && (
          <p
            className="text-sm leading-5 text-red-600"
            role="alert"
            aria-live="assertive"
          >
            {submitError}
          </p>
        )}
      </form>
    </section>
  </div>
</StaticPageLayout>


);
}
