import { CtaPill } from "../shared/CtaPill";
import { LogoPin } from "../shared/Logo";
import { CardArrowIcon } from "../shared/Icons";


export function MapSection({ onFindStation }) {
  return (
    <section
      id="map"
      className="relative mt-2 min-h-[380px] overflow-hidden lg:mt-0 lg:min-h-[340px]"
    >
      <img
        src="/images/map.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-[82%_42%] lg:object-[70%_40%]"
      />
      <div className="absolute inset-0 hidden bg-gradient-to-r from-[#ff6a00] via-[#ff8c1a]/88 to-[#ffb347]/35 lg:block" />
      <div className="relative mx-auto flex min-h-[380px] max-w-[1440px] flex-col justify-between px-6 pb-8 pt-10 lg:min-h-[340px] lg:px-16 lg:pb-12 lg:pt-14">
        <h2 className="text-[40px] font-extrabold leading-[1.05] text-white lg:max-w-[28rem] lg:text-[56px] lg:leading-[1.05]">
          <span className="lg:hidden">
            There where
            <br />
            you need us
          </span>
          <span className="hidden lg:block">
            There where you
            <br />
            need us
          </span>
        </h2>
        <div className="flex items-end justify-between gap-3">
          <CtaPill variant="navy" onClick={onFindStation} className="w-[261px]">
            Find your closest Z
          </CtaPill>
          <LogoPin className="h-[88px] w-[76px] shrink-0 lg:absolute lg:right-16 lg:top-12 lg:h-[110px] lg:w-[94px]" />
        </div>
      </div>
    </section>
  );
}
const features = [
  {
    id: "z-rewards",
    name: "Z Rewards",
    eyebrow: "Rewards and promotions",
    title: "Z Rewards",
    body: "Save 6 c per litre every time you fill up to 100 litres, plus get points on almost everything you buy and use them for treats",
  },
  {
    id: "for-business",
    name: "Your business is our business",
    eyebrow: "For businesses",
    title: (
      <>
        Your business is
        <br />
        our business
      </>
    ),
    body: "With our fuel, size, distribution network and Kiwi can-do attitude, we'll help get your business to where you want it to be.",
  },
  {
    id: "z-app",
    name: "Z in the palm of your hand",
    eyebrow: "Z App",
    title: (
      <>
        Z in the palm of
        <br />
        your hand
      </>
    ),
    body: "Z App lets you experience Z your way. Pay for fuel, pre-order drinks and more.",
  },
];
export function Features() {
  return (
    <section
      id="make-the-most"
      className="bg-white px-6 pb-8 pt-12 lg:px-16 lg:pb-20 lg:pt-16"
    >
      <div className="mx-auto max-w-[1440px]">
        <h2 className="text-[36px] font-extrabold leading-[1.08] text-z-orange lg:text-center lg:text-[48px]">
          <span className="lg:hidden">
            Make the most
            <br />
            of Z
          </span>
          <span className="hidden lg:inline">Make the most of Z</span>
        </h2>
        <div className="mt-8 flex flex-col gap-5 lg:mt-14 lg:grid lg:grid-cols-3 lg:items-stretch lg:gap-16">
          {features.map((feature) => (
            <article
              key={feature.id}
              id={feature.id}
              className="flex flex-col rounded-[22px] bg-white px-6 py-7 shadow-[0_4px_4px_0_rgba(242,101,34,0.15)] lg:rounded-none lg:px-0 lg:py-0 lg:shadow-none"
            >
              <p className="text-[16px] font-medium text-neutral-700 lg:text-[20px] lg:font-bold lg:text-z-ink">
                {feature.eyebrow}
              </p>
              <h3 className="mt-1 text-[28px] font-extrabold leading-[1.15] text-z-navy lg:mt-3 lg:min-h-[84px] lg:text-[36px] lg:leading-[1.15]">
                {feature.title}
              </h3>
              <p className="mt-3 text-[15px] leading-relaxed text-neutral-600 lg:mt-5 lg:max-w-[20rem] lg:text-[16px] lg:leading-[1.55] lg:text-z-ink">
                {feature.body}
              </p>
              <div className="mt-6 lg:mt-auto lg:pt-8">
                <a
                  href={`#${feature.id}-more`}
                  aria-label={`Learn more about ${feature.name}`}
                  className="flex size-10 items-center justify-center rounded-full bg-z-navy text-white"
                >
                  <CardArrowIcon className="h-[13px] w-[21px]" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
