import { useState } from "react";
import { resetPassword } from "../../auth";
import { AuthMessage, ChargingAuthHeader, PasswordField, ZBusinessChrome } from "./shared";

export function ForgotPassword({ variant = "business", onHome, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);
  const ev = variant === "ev";

  const form = (
    <form
      className={ev ? "mt-8 w-full" : "mt-8 w-full max-w-[360px]"}
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        setSuccess("");
        const login = email.trim();
        const result = await resetPassword(
          ev
            ? { userId: login, email: login, password, confirmPassword }
            : { email: login, password, confirmPassword },
        );
        setBusy(false);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        setSuccess("Password updated. You can log in with your new password.");
        setPassword("");
        setConfirmPassword("");
      }}
    >
      {ev ? null : (
        <p className="mb-5 text-[14px] leading-relaxed text-[#555]">
          Enter your email and choose a new password.
        </p>
      )}
      <label className="block text-[14px] text-[#333]" htmlFor={`${variant}-forgot-email`}>
        {ev ? "User ID" : "Email:"}
      </label>
      <input
        id={`${variant}-forgot-email`}
        type={ev ? "text" : "email"}
        value={email}
        autoComplete="username"
        onChange={(event) => setEmail(event.target.value)}
        autoFocus
        className={
          ev
            ? "mt-1 h-[40px] w-full rounded-[6px] border-[2px] border-[#F26522] px-3 text-[15px] outline-none"
            : "mt-1 h-[36px] w-full border-[3px] border-[#F26522] px-2 text-[15px] outline-none"
        }
      />
      <PasswordField
        id={`${variant}-forgot-password`}
        label={ev ? "New password" : "New password:"}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        className="mt-4"
        inputClassName={
          ev
            ? "mt-1 h-[40px] rounded-[6px] border border-[#cfcfcf] px-3 text-[15px] focus:border-[#F26522]"
            : "mt-1 h-[36px] border border-[#cfcfcf] px-2 text-[15px] focus:border-[#F26522]"
        }
      />
      <PasswordField
        id={`${variant}-forgot-confirm`}
        label={ev ? "Confirm new password" : "Confirm new password:"}
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        className="mt-4"
        inputClassName={
          ev
            ? "mt-1 h-[40px] rounded-[6px] border border-[#cfcfcf] px-3 text-[15px] focus:border-[#F26522]"
            : "mt-1 h-[36px] border border-[#cfcfcf] px-2 text-[15px] focus:border-[#F26522]"
        }
      />
      <AuthMessage error={error} success={success} />
      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="text-[13px] text-[#888] hover:text-[#F26522]"
        >
          ▸ Back to Login
        </button>
        <button
          type="submit"
          disabled={busy}
          className="inline-flex h-[36px] items-center justify-center rounded-[6px] bg-[#F26522] px-5 text-[13px] font-bold uppercase tracking-wide text-white disabled:opacity-70"
        >
          {busy ? "Saving…" : "Reset password"}
        </button>
      </div>
    </form>
  );

  if (ev) {
    return (
      <div className="flex min-h-screen flex-col bg-white">
        <ChargingAuthHeader />
        <main className="flex flex-1 flex-col items-center px-6 pt-16 pb-10">
          <div className="w-full max-w-[560px]">
            <h1 className="text-center text-[32px] font-extrabold text-[#1B1464]">
              Forgotten your password?
            </h1>
            <p className="mt-4 text-center text-[14px] text-[#555]">
              Enter your User ID and choose a new password
            </p>
            <div className="mx-auto w-full max-w-[360px]">{form}</div>
          </div>
          <button
            type="button"
            onClick={onHome}
            className="mt-6 text-[14px] font-semibold text-[#1E196A] underline"
          >
            Return to homepage
          </button>
        </main>
      </div>
    );
  }

  return (
    <ZBusinessChrome title="Forgotten your Password?" onHome={onHome}>
      {form}
    </ZBusinessChrome>
  );
}
