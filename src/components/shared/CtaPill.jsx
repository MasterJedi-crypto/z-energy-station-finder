import ctaArrow from "../../assets/figma/home-cta-arrow.svg";
import ctaArrowNavy from "../../assets/figma/home-cta-arrow-navy.svg";


export function CtaPill({
  children,
  href,
  onClick,
  variant = "orange",
  size = "default",
  className = "",
}) {
  const compact = size === "compact";
  const classes = `inline-flex items-center justify-between whitespace-nowrap rounded-[40px] font-bold leading-none text-white ${compact ? "h-[45px] w-[186px] py-[10px] pl-[33px] pr-[10px] text-[16px]" : "h-[53px] gap-1.5 px-[14px] py-[5px] text-[20px]"} ${variant === "orange" ? "bg-[#F26522]" : "bg-[#1E196A]"} ${className}`;
  const content = (
    <>
      <span className="shrink-0">{children}</span>
      <span className={`flex shrink-0 items-center justify-center rounded-full bg-white ${compact ? "size-[25px]" : "size-10"}`}>
        <img
          src={variant === "orange" ? ctaArrow : ctaArrowNavy}
          alt=""
          width={24}
          height={24}
          className={compact ? "size-5" : "size-6"}
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
