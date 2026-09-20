import { Logo } from "../shared/Logo";

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
