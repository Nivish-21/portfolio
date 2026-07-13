"use client";

import React, { useState } from "react";
import { contact } from "@/lib/content";

/**
 * Filing a statement.
 *
 * Contacting a detective is not sending a message, it is bringing him a case.
 * The form takes a name, somewhere to write back, and the case itself; on
 * success it hands back a reference number, the way a real intake desk would.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState("");

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const validate = () => {
    const errors: typeof fieldErrors = {};
    if (!name.trim()) errors.name = "I need to know who is asking.";
    if (!email.trim()) {
      errors.email = "I need somewhere to write back to.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "That address will not reach you.";
    }
    if (!message.trim()) errors.message = "Tell me what happened.";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setReference(data.reference);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(data.error || "The statement did not go through.");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "The statement did not go through. Try again, or email me directly.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (invalid: boolean) =>
    `w-full border bg-panel px-3.5 py-2.5 font-mono text-sm text-file transition-colors focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lamp ${
      invalid
        ? "border-thread-text focus:border-thread-text"
        : "border-line-strong focus:border-lamp"
    }`;

  const labelClass =
    "font-mono text-[10px] uppercase tracking-[0.14em] text-ash";

  if (success) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="border border-lamp/50 bg-panel p-6 text-left"
      >
        <p className="mb-3 font-mono text-sm uppercase tracking-[0.14em] text-lamp">
          Statement taken.
        </p>
        <p className="mb-5 text-[15px] leading-relaxed text-file/80">
          I have it, and I will read it properly. If it is a case I can help
          with, you will hear back from me at the address you gave.
        </p>
        <div className="mb-5 flex justify-between border border-line-strong bg-void p-4 font-mono text-xs text-ash">
          <span>Your reference</span>
          <span className="font-bold text-lamp">{reference}</span>
        </div>
        <button
          type="button"
          onClick={() => setSuccess(false)}
          className="w-full cursor-pointer border border-line-strong py-2.5 font-mono text-xs uppercase tracking-[0.1em] transition-colors hover:border-lamp hover:text-lamp"
        >
          File another
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 border border-line-strong bg-panel p-5 text-left md:p-6"
    >
      <div className="mb-1 flex items-center justify-between border-b border-line-strong pb-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-ash">
          Intake desk
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-ash-2">
          {submitting ? "Taking it down…" : "Open"}
        </span>
      </div>

      {error ? (
        <div
          role="alert"
          aria-live="assertive"
          className="border border-thread-text bg-thread-text/10 p-3 font-mono text-xs text-thread-text"
        >
          <p>{error}</p>
          {/* Never strand someone who took the trouble to write. If the desk is
              down, hand them the door out, with what they typed still intact. */}
          <a
            href={`mailto:${contact.email}?subject=${encodeURIComponent("A case for you")}&body=${encodeURIComponent(message)}`}
            className="mt-2 inline-block underline decoration-dotted underline-offset-4 hover:text-lamp focus-visible:text-lamp"
          >
            {contact.email} →
          </a>
        </div>
      ) : null}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className={labelClass}>
          Who is asking
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (fieldErrors.name) {
              setFieldErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          disabled={submitting}
          placeholder="Your name"
          className={fieldClass(Boolean(fieldErrors.name))}
        />
        {fieldErrors.name ? (
          <span className="font-mono text-[10px] text-thread-text">
            {fieldErrors.name}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className={labelClass}>
          Where to write back
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (fieldErrors.email) {
              setFieldErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          disabled={submitting}
          placeholder="you@wherever.com"
          className={fieldClass(Boolean(fieldErrors.email))}
        />
        {fieldErrors.email ? (
          <span className="font-mono text-[10px] text-thread-text">
            {fieldErrors.email}
          </span>
        ) : null}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className={labelClass}>
          The case
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (fieldErrors.message) {
              setFieldErrors((prev) => ({ ...prev, message: undefined }));
            }
          }}
          disabled={submitting}
          placeholder="What is broken, and what have you already ruled out?"
          className={`resize-none ${fieldClass(Boolean(fieldErrors.message))}`}
        />
        {fieldErrors.message ? (
          <span className="font-mono text-[10px] text-thread-text">
            {fieldErrors.message}
          </span>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 w-full cursor-pointer border border-lamp/45 py-2.5 font-mono text-xs uppercase tracking-[0.12em] text-lamp transition-colors hover:bg-lamp hover:text-on-lamp disabled:cursor-wait disabled:opacity-70"
      >
        {submitting ? "Taking it down…" : "File the report"}
      </button>
    </form>
  );
}
