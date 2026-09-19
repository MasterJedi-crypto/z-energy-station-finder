import { useState } from "react";
import { Logo } from "../shared/Logo";
import { EyeIcon, EyeOffIcon } from "../shared/Icons";

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  className = "",
  inputClassName = "",
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={className}>
      {label ? (
        <label className="block text-[14px] text-[#333]" htmlFor={id}>
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onChange={(event) => onChange(event.target.value)}
          className={`w-full pr-10 outline-none ${inputClassName}`}
        />
        <button
          type="button"
          onClick={() => setVisible((open) => !open)}
          className="absolute inset-y-0 right-1 flex w-8 items-center justify-center text-[#888] hover:text-[#F26522]"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export function AuthMessage({ error, success }) {
  if (!error && !success) return null;
  return (
    <p
      className={`mt-3 text-[13px] ${error ? "text-[#c0392b]" : "text-[#1e7a3a]"}`}
      role="status"
    >
      {error || success}
    </p>
  );
}

export function ChargingAuthHeader() {
  return (
    <header className="flex shrink-0 items-start bg-[linear-gradient(90deg,#EB4F10_22.6%,#F57825_50%,#FFA53B_84.13%)] p-[0_0_84px_233px]">
      <img
        src="/images/z-header-mark.png"
        alt="Z Energy"
        width={95}
        height={96}
        className="h-[96px] w-[95px] shrink-0 [aspect-ratio:95/96] object-cover"
      />
    </header>
  );
}

export function ZBusinessChrome({ title, children, onHome }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1 flex-col items-center px-6 pt-16">
        <Logo className="h-[72px] w-[72px]" />
        <h1 className="mt-8 text-center text-[32px] font-extrabold text-[#1B1464] lg:text-[40px]">
          {title}
        </h1>
        {children}
      </main>
      <footer className="mt-auto border-t border-[#cfcfcf] px-6 py-4 text-[12px] text-[#666]">
        <div className="mx-auto flex max-w-[1100px] flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex gap-3">
            <button type="button" onClick={onHome} className="hover:underline">
              Home
            </button>
            <span>|</span>
            <button type="button" onClick={onHome} className="hover:underline">
              Contact Us
            </button>
          </p>
          <a href="#privacy" className="hover:underline">
            Privacy Policy
          </a>
          <p>© 2019 WEX Card Australia Pty Ltd.</p>
        </div>
      </footer>
    </div>
  );
}
