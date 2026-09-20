import { useState } from "react";
import { loginAccount } from "../../auth";
import { AuthMessage, ChargingAuthHeader, PasswordField } from "./shared";

export function EvFleetLogin({ onHome, onForgot, onRegister, onSignedIn, accountType = "personal" }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-[#f7f7f7]">
      <ChargingAuthHeader />
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
