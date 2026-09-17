import ctaArrow from "../../assets/figma/home-cta-arrow.svg";
import ctaArrowNavy from "../../assets/figma/home-cta-arrow-navy.svg";


export function CtaPill({
  children,
  href,
  onClick,
  variant = "orange",
  className = "",
}) {
  const classes = `inline-flex h-[53px] items-center justify-between gap-1.5 whitespace-nowrap rounded-[40px] px-[14px] py-[5px] text-[20px] font-bold leading-none text-white ${variant === "orange" ? "bg-[#F26522]" : "bg-[#1E196A]"} ${className}`;
  const content = (
    <>
      <span className="shrink-0">{children}</span>
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white">
        <img
          src={variant === "orange" ? ctaArrow : ctaArrowNavy}
          alt=""
          width={24}
          height={24}
          className="size-6"
        />
      </span>
    </>
  );
  if (href) {
    return (
      <a href={href} onClick={onClick} className={classes}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={classes}>
      {content}
    </button>
  );
}
