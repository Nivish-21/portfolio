"use client";

import React, { useState } from "react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txId, setTxId] = useState("");

  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const validate = () => {
    const errors: typeof validationErrors = {};
    if (!name.trim()) errors.name = "Call Sign required.";
    if (!email.trim()) {
      errors.email = "Return Channel required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = "Invalid return channel path.";
    }
    if (!message.trim()) errors.message = "Transmission content empty.";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    setError(null);

    // Simulated F1 telemetry sync delays
    try {
      setProgressMsg("ESTABLISHING LINK...");
      await new Promise((r) => setTimeout(r, 600));

      setProgressMsg("TRANSMITTING PACKETS...");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      setProgressMsg("SYNCING ACKNOWLEDGEMENT...");
      await new Promise((r) => setTimeout(r, 500));

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTxId(data.transmissionId);
        setName("");
        setEmail("");
        setMessage("");
      } else {
        throw new Error(data.error || "Telemetry transmission failed.");
      }
    } catch (err: unknown) {
      const errMsg =
        err instanceof Error
          ? err.message
          : "Uplink failure. Please check connection.";
      setError(errMsg);
    } finally {
      setSubmitting(false);
      setProgressMsg("");
    }
  };

  if (success) {
    return (
      <div
        className="bg-bg border border-green p-6 rounded-sm text-left"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2 text-green font-mono text-sm uppercase tracking-[0.14em] mb-3">
          <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
          Transmission Synced
          <span className="ml-auto flex items-center gap-1.5 text-[9px] tracking-[0.12em] text-muted normal-case">
            <span
              className="h-2.5 w-2.5 rounded-[1px]"
              style={{
                background:
                  "repeating-conic-gradient(#fff 0 25%, #0a0f0e 0 50%) 0 0 / 5px 5px",
              }}
            />
            Chequered · delivered
          </span>
        </div>
        <p className="text-sm text-ink mb-4 font-mono">
          Uplink completed successfully. The telemetry log has been stored at
          the pit wall.
        </p>
        <div className="bg-panel border border-line-strong p-4 font-mono text-xs text-muted mb-5">
          <div className="flex justify-between border-b border-line-strong/40 pb-2 mb-2">
            <span>TX_ID:</span>
            <span className="text-green font-bold">{txId}</span>
          </div>
          <div className="flex justify-between">
            <span>STATUS:</span>
            <span className="text-green">ACK RECEIVED</span>
          </div>
        </div>
        <button
          onClick={() => setSuccess(false)}
          className="w-full py-2 border border-line-strong hover:border-accent hover:text-accent font-mono text-xs uppercase tracking-[0.1em] transition-colors cursor-pointer"
        >
          Send Another Signal
        </button>
      </div>
    );
  }

  // Race-flag reflecting the transmission state — reuses the existing state
  // machine, no new logic. Only fires on real feedback (fault / in-progress).
  const flagState = error
    ? {
        dot: "bg-red",
        text: "text-red",
        glow: "var(--color-red)",
        label: "Red · fault",
      }
    : submitting
      ? {
          dot: "bg-yellow",
          text: "text-yellow",
          glow: "var(--color-yellow)",
          label: "Yellow · tx",
        }
      : {
          dot: "bg-green",
          text: "text-green",
          glow: "var(--color-green)",
          label: "Green · ready",
        };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4.5 text-left bg-bg border border-line-strong p-5 md:p-6"
    >
      <div className="border-b border-line-strong pb-3 mb-2 flex justify-between items-center">
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-muted">
          Radio Panel // COMMS CONTROL
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.12em] uppercase">
          <span
            className={`h-1.5 w-1.5 rounded-full ${flagState.dot}`}
            style={{ boxShadow: `0 0 6px ${flagState.glow}` }}
          />
          <span className={flagState.text}>{flagState.label}</span>
        </span>
      </div>

      {error && (
        <div
          role="alert"
          aria-live="assertive"
          className="bg-red/10 border border-red text-red p-3 text-xs font-mono uppercase tracking-[0.06em]"
        >
          Error: {error}
        </div>
      )}

      {/* Name / Call Sign */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted"
        >
          Call Sign (Name)
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (validationErrors.name) {
              setValidationErrors((prev) => ({ ...prev, name: undefined }));
            }
          }}
          disabled={submitting}
          className={`w-full bg-panel border px-3.5 py-2 font-mono text-sm text-ink rounded-sm focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 transition-colors ${
            validationErrors.name
              ? "border-red focus:border-red"
              : "border-line-strong focus:border-accent"
          }`}
          placeholder="e.g. PILOT_01"
        />
        {validationErrors.name && (
          <span className="font-mono text-[9px] tracking-[0.06em] text-red uppercase">
            {validationErrors.name}
          </span>
        )}
      </div>

      {/* Email / Return Channel */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted"
        >
          Return Channel (Email)
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (validationErrors.email) {
              setValidationErrors((prev) => ({ ...prev, email: undefined }));
            }
          }}
          disabled={submitting}
          className={`w-full bg-panel border px-3.5 py-2 font-mono text-sm text-ink rounded-sm focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 transition-colors ${
            validationErrors.email
              ? "border-red focus:border-red"
              : "border-line-strong focus:border-accent"
          }`}
          placeholder="e.g. pilot@domain.com"
        />
        {validationErrors.email && (
          <span className="font-mono text-[9px] tracking-[0.06em] text-red uppercase">
            {validationErrors.email}
          </span>
        )}
      </div>

      {/* Message / Transmission */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="font-mono text-[10px] tracking-[0.14em] uppercase text-muted"
        >
          Transmission Content (Message)
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            if (validationErrors.message) {
              setValidationErrors((prev) => ({ ...prev, message: undefined }));
            }
          }}
          disabled={submitting}
          className={`w-full bg-panel border px-3.5 py-2.5 font-mono text-sm text-ink rounded-sm focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 transition-colors resize-none ${
            validationErrors.message
              ? "border-red focus:border-red"
              : "border-line-strong focus:border-accent"
          }`}
          placeholder="Type message telemetry log..."
        />
        {validationErrors.message && (
          <span className="font-mono text-[9px] tracking-[0.06em] text-red uppercase">
            {validationErrors.message}
          </span>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className={`w-full mt-3 py-2.5 text-xs font-mono tracking-[0.12em] uppercase rounded-sm transition-colors cursor-pointer flex items-center justify-center gap-2 ${
          submitting
            ? "bg-yellow/15 text-yellow border border-yellow/50"
            : "bg-line-strong hover:bg-accent hover:text-on-accent"
        }`}
      >
        {submitting ? (
          <>
            <span className="h-1.5 w-1.5 rounded-full bg-yellow animate-ping" />
            {progressMsg}
          </>
        ) : (
          "Transmit Signal"
        )}
      </button>
    </form>
  );
}
