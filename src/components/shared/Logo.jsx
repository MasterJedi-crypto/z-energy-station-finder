export function Logo({ className = "h-10 w-10", title = "Z Energy" }) {
    return (
      <img
        src="/images/z-logo.png"
        alt={title}
        className={`object-contain ${className}`}
      />
    );
  }
  export function LogoPin({ className = "h-[84px] w-[72px]" }) {
    return (
      <img
        src="/images/z-pin.png"
        alt=""
        className={`object-contain ${className}`}
      />
    );
  }
  