import { useState } from "react";
import { Logo } from "../shared/Logo";
import { registerAccount } from "../../auth";
import { AuthMessage, PasswordField } from "./shared";

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
