import { useState } from "react";
import { loginAccount } from "../../auth";
import { AuthMessage, PasswordField, ZBusinessChrome } from "./shared";

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
