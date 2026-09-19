import { useState } from "react";
import { Logo } from "../shared/Logo";
import { EyeIcon, EyeOffIcon } from "../shared/Icons";
import { loginAccount, registerAccount, resetPassword } from "../../auth";

function PasswordField({
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

function AuthMessage({ error, success }) {
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

function ZBusinessChrome({ title, children, onHome }) {
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

export function EvFleetLanding({ onLogin, onHome }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#f4f4f4] px-6">
      <Logo className="h-16 w-16" />
      <h1 className="mt-10 max-w-[920px] text-center text-[28px] font-extrabold leading-tight text-[#2b2b2b] lg:text-[36px]">
        Managing your EV fleet is just a click away
      </h1>
      <button
        type="button"
        onClick={onLogin}
        className="mt-10 inline-flex h-[52px] w-[280px] items-center justify-center rounded-[40px] bg-[#F26522] text-[16px] font-bold text-white lg:w-[340px]"
      >
        Login
      </button>
      <button
        type="button"
        onClick={onHome}
        className="mt-5 text-[14px] font-semibold text-[#1E196A] underline"
      >
        Return to homepage
      </button>
    </main>
  );
}

export function EvFleetLogin({ onHome, onForgot, onRegister, onSignedIn, accountType = "personal" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f7]">
      <header className="flex h-[88px] items-center bg-[linear-gradient(90deg,#eb4f10_0%,#f06f12_52%,#ffa53b_100%)] px-6 lg:px-10">
        <Logo className="h-14 w-14" />
      </header>
      <main className="flex flex-1 flex-col items-center px-6 pt-16 pb-10">
        <form
          className="w-full max-w-[420px] rounded-[18px] bg-white px-8 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            const result = await loginAccount({ email, password, accountType });
            setBusy(false);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            onSignedIn(result.session);
          }}
        >
          <h1 className="text-[32px] font-extrabold text-[#F26522]">Login</h1>
          <label className="mt-6 block text-[14px] font-bold text-[#2b2b2b]" htmlFor="ev-email">
            Email Address
          </label>
          <input
            id="ev-email"
            type="email"
            value={email}
            autoComplete="username"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email Address"
            className="mt-2 h-[46px] w-full rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] outline-none placeholder:text-neutral-400 focus:border-[#F26522]"
          />
          <div className="mt-5 flex items-end justify-between gap-3">
            <label className="text-[14px] font-bold text-[#2b2b2b]" htmlFor="ev-password">
              Password
            </label>
            <button
              type="button"
              onClick={onForgot}
              className="text-[13px] font-semibold text-[#1E196A] underline"
            >
              Forgot your password?
            </button>
          </div>
          <PasswordField
            id="ev-password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            placeholder="Password"
            className="mt-2"
            inputClassName="h-[46px] rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] placeholder:text-neutral-400 focus:border-[#F26522]"
          />
          <AuthMessage error={error} />
          <button
            type="submit"
            disabled={busy}
            className="mt-7 flex h-[48px] w-full items-center justify-center rounded-[40px] bg-[linear-gradient(90deg,#eb4f10_0%,#f06f12_52%,#ffa53b_100%)] text-[16px] font-bold text-white disabled:opacity-70"
          >
            {busy ? "Signing in…" : "Sign In"}
          </button>
          {onRegister ? (
            <button
              type="button"
              onClick={onRegister}
              className="mt-4 w-full text-center text-[13px] font-semibold text-[#1E196A] underline"
            >
              Request a Logon
            </button>
          ) : null}
        </form>
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

export function EvFleetRegister({ onHome, onBack, onSignedIn, accountType = "personal" }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isBusiness = accountType === "business";

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f7]">
      <header className="flex h-[88px] items-center bg-[linear-gradient(90deg,#eb4f10_0%,#f06f12_52%,#ffa53b_100%)] px-6 lg:px-10">
        <Logo className="h-14 w-14" />
      </header>
      <main className="flex flex-1 flex-col items-center px-6 pt-16 pb-10">
        <form
          className="w-full max-w-[420px] rounded-[18px] bg-white px-8 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)]"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError("");
            const result = await registerAccount({
              name,
              email,
              password,
              confirmPassword,
              accountType,
              businessName: isBusiness ? businessName : undefined,
            });
            setBusy(false);
            if (!result.ok) {
              setError(result.error);
              return;
            }
            onSignedIn(result.session);
          }}
        >
          <h1 className="text-[32px] font-extrabold text-[#F26522]">Request a Logon</h1>
          <label className="mt-6 block text-[14px] font-bold text-[#2b2b2b]" htmlFor="ev-register-name">
            Full name
          </label>
          <input
            id="ev-register-name"
            value={name}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
            className="mt-2 h-[46px] w-full rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] outline-none focus:border-[#F26522]"
          />
          {isBusiness ? (
            <>
              <label className="mt-5 block text-[14px] font-bold text-[#2b2b2b]" htmlFor="ev-register-biz">
                Business name
              </label>
              <input
                id="ev-register-biz"
                value={businessName}
                onChange={(event) => setBusinessName(event.target.value)}
                className="mt-2 h-[46px] w-full rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] outline-none focus:border-[#F26522]"
              />
            </>
          ) : null}
          <label className="mt-5 block text-[14px] font-bold text-[#2b2b2b]" htmlFor="ev-register-email">
            Email Address
          </label>
          <input
            id="ev-register-email"
            type="email"
            value={email}
            autoComplete="username"
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 h-[46px] w-full rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] outline-none focus:border-[#F26522]"
          />
          <PasswordField
            id="ev-register-password"
            label="Password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            className="mt-5"
            inputClassName="mt-2 h-[46px] rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] focus:border-[#F26522]"
          />
          <PasswordField
            id="ev-register-confirm"
            label="Confirm password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            className="mt-5"
            inputClassName="mt-2 h-[46px] rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] focus:border-[#F26522]"
          />
          <AuthMessage error={error} />
          <button
            type="submit"
            disabled={busy}
            className="mt-7 flex h-[48px] w-full items-center justify-center rounded-[40px] bg-[linear-gradient(90deg,#eb4f10_0%,#f06f12_52%,#ffa53b_100%)] text-[16px] font-bold text-white disabled:opacity-70"
          >
            {busy ? "Creating…" : "Create account"}
          </button>
          <button
            type="button"
            onClick={onBack}
            className="mt-4 w-full text-center text-[13px] font-semibold text-[#1E196A] underline"
          >
            Back to Sign In
          </button>
        </form>
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

export function ZBusinessLogin({
  onHome,
  onRegister,
  onForgot,
  onSignedIn,
  accountType = "business",
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const title =
    accountType === "personal"
      ? "Welcome to Z Personal Online"
      : "Welcome to Z Business Online";

  return (
    <ZBusinessChrome title={title} onHome={onHome}>
      <form
        className="mt-8 w-full max-w-[360px]"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError("");
          const result = await loginAccount({ email, password, accountType });
          setBusy(false);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          onSignedIn(result.session);
        }}
      >
        <label className="block text-[14px] text-[#333]" htmlFor="zbo-email">
          Email:
        </label>
        <input
          id="zbo-email"
          type="email"
          value={email}
          autoComplete="username"
          onChange={(event) => setEmail(event.target.value)}
          autoFocus
          className="mt-1 h-[36px] w-full border-[3px] border-[#F26522] px-2 text-[15px] outline-none"
        />
        <PasswordField
          id="zbo-password"
          label="Password:"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          className="mt-4"
          inputClassName="mt-1 h-[36px] border border-[#cfcfcf] bg-[#f4f7fb] px-2 text-[15px] focus:border-[#F26522]"
        />
        <AuthMessage error={error} />
        <div className="mt-4 flex items-start justify-between gap-4">
          <ul className="flex flex-col gap-1 text-[13px] text-[#888]">
            <li>
              <button
                type="button"
                onClick={onForgot}
                className="inline-flex items-start gap-1 text-left hover:text-[#F26522]"
              >
                <span className="text-[#F26522]">▸</span>
                <span>
                  Forgotten your
                  <br />
                  Password?
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onHome}
                className="inline-flex items-center gap-1 hover:text-[#F26522]"
              >
                <span className="text-[#F26522]">▸</span> Contact Us
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={onRegister}
                className="inline-flex items-center gap-1 font-medium text-[#F26522] hover:underline"
              >
                <span>▸</span> Request a Logon
              </button>
            </li>
          </ul>
          <button
            type="submit"
            disabled={busy}
            className="inline-flex h-[36px] min-w-[92px] items-center justify-center rounded-[6px] bg-[#F26522] px-5 text-[13px] font-bold uppercase tracking-wide text-white disabled:opacity-70"
          >
            {busy ? "…" : "Login"}
          </button>
        </div>
      </form>
    </ZBusinessChrome>
  );
}

export function ZBusinessRegister({
  onHome,
  onBack,
  onSignedIn,
  accountType = "business",
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const isBusiness = accountType === "business";
  const title = isBusiness ? "Request a Business Logon" : "Request a Personal Logon";

  return (
    <ZBusinessChrome title={title} onHome={onHome}>
      <form
        className="mt-8 w-full max-w-[360px]"
        onSubmit={async (event) => {
          event.preventDefault();
          setBusy(true);
          setError("");
          const result = await registerAccount({
            name,
            email,
            userId,
            password,
            confirmPassword,
            accountType,
            businessName: isBusiness ? businessName : undefined,
          });
          setBusy(false);
          if (!result.ok) {
            setError(result.error);
            return;
          }
          onSignedIn(result.session);
        }}
      >
        <p className="mb-5 text-[14px] leading-relaxed text-[#555]">
          {isBusiness
            ? "Create a Z Business Online account with your email, contact name, and business name. User ID is optional — we keep both."
            : "Create a Z Personal Online account with your email and name. User ID is optional — we keep both."}
        </p>
        <label className="block text-[14px] text-[#333]" htmlFor="zbo-register-name">
          Contact name:
        </label>
        <input
          id="zbo-register-name"
          value={name}
          autoComplete="name"
          onChange={(event) => setName(event.target.value)}
          autoFocus
          className="mt-1 h-[36px] w-full border-[3px] border-[#F26522] px-2 text-[15px] outline-none"
        />
        {isBusiness ? (
          <>
            <label className="mt-4 block text-[14px] text-[#333]" htmlFor="zbo-register-biz">
              Business name:
            </label>
            <input
              id="zbo-register-biz"
              value={businessName}
              onChange={(event) => setBusinessName(event.target.value)}
              className="mt-1 h-[36px] w-full border border-[#cfcfcf] px-2 text-[15px] outline-none focus:border-[#F26522]"
            />
          </>
        ) : null}
        <label className="mt-4 block text-[14px] text-[#333]" htmlFor="zbo-register-email">
          Email:
        </label>
        <input
          id="zbo-register-email"
          type="email"
          value={email}
          autoComplete="username"
          onChange={(event) => setEmail(event.target.value)}
          className="mt-1 h-[36px] w-full border border-[#cfcfcf] px-2 text-[15px] outline-none focus:border-[#F26522]"
        />
        <label className="mt-4 block text-[14px] text-[#333]" htmlFor="zbo-register-user">
          User ID (optional):
        </label>
        <input
          id="zbo-register-user"
          value={userId}
          autoComplete="username"
          onChange={(event) => setUserId(event.target.value)}
          className="mt-1 h-[36px] w-full border border-[#cfcfcf] px-2 text-[15px] outline-none focus:border-[#F26522]"
        />
        <PasswordField
          id="zbo-register-password"
          label="Password:"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          className="mt-4"
          inputClassName="mt-1 h-[36px] border border-[#cfcfcf] px-2 text-[15px] focus:border-[#F26522]"
        />
        <PasswordField
          id="zbo-register-confirm"
          label="Confirm password:"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          className="mt-4"
          inputClassName="mt-1 h-[36px] border border-[#cfcfcf] px-2 text-[15px] focus:border-[#F26522]"
        />
        <AuthMessage error={error} />
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
            {busy ? "Creating…" : "Create account"}
          </button>
        </div>
      </form>
    </ZBusinessChrome>
  );
}

export function ForgotPassword({ variant = "business", onHome, onBack }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busy, setBusy] = useState(false);

  const form = (
    <form
      className={variant === "business" ? "mt-8 w-full max-w-[360px]" : "w-full"}
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        setSuccess("");
        const result = await resetPassword({
          email,
          password,
          confirmPassword,
        });
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
      {variant === "business" ? (
        <p className="mb-5 text-[14px] leading-relaxed text-[#555]">
          Enter your email and choose a new password.
        </p>
      ) : null}
      <label
        className={`block text-[14px] ${variant === "ev" ? "font-bold text-[#2b2b2b]" : "text-[#333]"}`}
        htmlFor={`${variant}-forgot-email`}
      >
        {variant === "ev" ? "Email Address" : "Email:"}
      </label>
      <input
        id={`${variant}-forgot-email`}
        type="email"
        value={email}
        autoComplete="username"
        onChange={(event) => setEmail(event.target.value)}
        autoFocus
        className={
          variant === "ev"
            ? "mt-2 h-[46px] w-full rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] outline-none focus:border-[#F26522]"
            : "mt-1 h-[36px] w-full border-[3px] border-[#F26522] px-2 text-[15px] outline-none"
        }
      />
      <PasswordField
        id={`${variant}-forgot-password`}
        label={variant === "ev" ? "New password" : "New password:"}
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        className="mt-4"
        inputClassName={
          variant === "ev"
            ? "mt-2 h-[46px] rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] focus:border-[#F26522]"
            : "mt-1 h-[36px] border border-[#cfcfcf] px-2 text-[15px] focus:border-[#F26522]"
        }
      />
      <PasswordField
        id={`${variant}-forgot-confirm`}
        label={variant === "ev" ? "Confirm new password" : "Confirm new password:"}
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        className="mt-4"
        inputClassName={
          variant === "ev"
            ? "mt-2 h-[46px] rounded-[8px] border border-[#d9d9d9] px-3 text-[15px] focus:border-[#F26522]"
            : "mt-1 h-[36px] border border-[#cfcfcf] px-2 text-[15px] focus:border-[#F26522]"
        }
      />
      <AuthMessage error={error} success={success} />
      <div className="mt-5 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className={
            variant === "ev"
              ? "text-[13px] font-semibold text-[#1E196A] underline"
              : "text-[13px] text-[#888] hover:text-[#F26522]"
          }
        >
          {variant === "ev" ? "Back to Sign In" : "▸ Back to Login"}
        </button>
        <button
          type="submit"
          disabled={busy}
          className={
            variant === "ev"
              ? "inline-flex h-[48px] min-w-[160px] items-center justify-center rounded-[40px] bg-[linear-gradient(90deg,#eb4f10_0%,#f06f12_52%,#ffa53b_100%)] px-6 text-[16px] font-bold text-white disabled:opacity-70"
              : "inline-flex h-[36px] items-center justify-center rounded-[6px] bg-[#F26522] px-5 text-[13px] font-bold uppercase tracking-wide text-white disabled:opacity-70"
          }
        >
          {busy ? "Saving…" : "Reset password"}
        </button>
      </div>
    </form>
  );

  if (variant === "ev") {
    return (
      <div className="flex min-h-screen flex-col bg-[#f7f7f7]">
        <header className="flex h-[88px] items-center bg-[linear-gradient(90deg,#eb4f10_0%,#f06f12_52%,#ffa53b_100%)] px-6 lg:px-10">
          <Logo className="h-14 w-14" />
        </header>
        <main className="flex flex-1 flex-col items-center px-6 pt-16 pb-10">
          <div className="w-full max-w-[420px] rounded-[18px] bg-white px-8 py-8 shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <h1 className="text-[32px] font-extrabold text-[#F26522]">Forgot password?</h1>
            <p className="mt-3 text-[14px] text-[#555]">
              Enter your email and a new password for your account.
            </p>
            <div className="mt-6">{form}</div>
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
