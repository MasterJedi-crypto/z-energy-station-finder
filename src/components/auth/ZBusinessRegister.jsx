import { useState } from "react";
import { registerAccount } from "../../auth";
import { AuthMessage, PasswordField, ZBusinessChrome } from "./shared";

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
