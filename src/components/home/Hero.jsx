import { ArrowDownIcon } from "../shared/Icons";
import { CtaPill } from "../shared/CtaPill";
import svcTrailer from "../../assets/figma/home-svc-trailer.svg";
import svcCarwash from "../../assets/figma/home-svc-carwash.svg";
import svcLpg from "../../assets/figma/home-svc-lpg.svg";
import svcFood from "../../assets/figma/home-svc-food.svg";
import svcArrow from "../../assets/figma/home-svc-arrow.svg";


export function Hero({ onFindStation }) {
  return (
    <section className="bg-white">
      <div className="relative h-[260px] overflow-hidden lg:h-[457px]">
        <img
          src="/images/station.png"
          alt="Z service station at dusk"
          className="h-full w-full object-cover object-[center_70%] lg:object-[center_65%]"
        />
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="relative mx-auto h-full max-w-[1440px]">
            <div className="hero-gradient pointer-events-auto absolute left-[142px] top-0 flex h-[412px] w-[515px] flex-col rounded-[20px] px-[55px] pb-[49px] pt-[79px] text-white">
              <h1 className="text-[50px] font-bold leading-[61px] tracking-tight">
                Z is for
                <br />
                New Zealand
              </h1>
              <p className="mt-[18px] max-w-[434px] text-[20px] font-medium leading-6">
                Powering better journeys, today and tomorrow
              </p>
              <button
                type="button"
                onClick={onFindStation}
                className="mt-auto inline-flex h-[67px] w-[173px] shrink-0 items-center justify-center self-end rounded-[40px] bg-[#1E196A] text-[20px] font-bold text-white"
              >
                Find a Z
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-gradient px-6 pb-8 pt-8 text-white lg:hidden">
        <h1 className="text-[42px] font-extrabold leading-[1.05] tracking-tight">
          Z is for
          <br />
          New Zealand
        </h1>
        <p className="mt-4 max-w-[16rem] text-[22px] font-medium leading-snug">
          Powering better journeys, today and tomorrow
        </p>
        <div className="mt-8 flex items-center justify-between">
          <a
            href="#news"
            aria-label="Scroll to latest update"
            className="flex size-11 items-center justify-center rounded-full bg-[#1E196A] text-white"
          >
            <ArrowDownIcon className="size-5" />
          </a>
          <button
            type="button"
            onClick={onFindStation}
            className="inline-flex h-[53px] items-center rounded-[40px] bg-[#1E196A] px-8 text-[20px] font-bold text-white"
          >
            Find a Z
          </button>
        </div>
      </div>
    </section>
  );
}
export function NewsCard() {
  return (
    <article
      id="news"
      className="bg-white px-5 pb-2 pt-6 lg:mx-auto lg:grid lg:max-w-[1440px] lg:grid-cols-2 lg:items-center lg:gap-16 lg:px-16 lg:pb-6 lg:pt-16"
    >
      <img
        src="/images/news.png"
        alt="Z canopy sign against a blue sky"
        className="h-[220px] w-full rounded-2xl object-cover object-center lg:h-[340px] lg:rounded-[20px]"
      />
      <div className="lg:flex lg:flex-col lg:justify-center">
        <h2 className="mt-4 text-[18px] font-bold text-[#F26522] lg:mt-0 lg:max-w-[28rem] lg:text-[40px] lg:font-extrabold lg:leading-[1.15]">
          Z Energy update on fuel supply
        </h2>
        <CtaPill href="#news-more" className="mt-4 w-[179px] lg:mt-8">
          Read more
        </CtaPill>
      </div>
    </article>
  );
}
const services = [
  {
    name: "Trailer hire",
    label: "Trailer hire",
    icon: svcTrailer,
    width: 56,
    height: 41,
  },
  {
    name: "Car wash",
    label: "Car wash",
    icon: svcCarwash,
    width: 45,
    height: 44,
  },
  {
    name: "LPG bottle swap",
    label: "LPG bottle swap",
    icon: svcLpg,
    width: 37,
    height: 45,
  },
  {
    name: "Food and drink",
    label: "Food and drink",
    icon: svcFood,
    width: 32,
    height: 41,
  },
];
export function Services() {
  return (
    <section
      id="services"
      className="bg-white px-[25px] pb-6 pt-10 lg:mx-auto lg:grid lg:max-w-[1440px] lg:grid-cols-2 lg:items-start lg:gap-16 lg:px-16 lg:pb-16 lg:pt-10"
    >
      <div>
        <h2 className="max-w-[16rem] text-[34px] font-extrabold leading-[1.1] text-[#F26522] lg:max-w-[22rem] lg:text-[40px] lg:leading-[1.15]">
          What you need, made easy
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[#353535] lg:max-w-[26rem]">
          Moving furniture? Hangry for a pie and barista made coffee? Have a
          dirty car that needs some love? Come on in – we&apos;ve got you
          covered.
        </p>
        <CtaPill href="#at-the-station" className="mt-5 w-[210px]">
          At the station
        </CtaPill>
      </div>
      <ul className="mt-5 flex flex-col gap-[18px] lg:mt-0">
        {services.map((service) => (
          <li key={service.name}>
            <a
              href="#at-the-station"
              className="flex h-[122px] w-full items-center rounded-[10px] bg-white px-[27px] text-[#1E196A] shadow-[0_4px_4px_0_rgba(242,101,34,0.15)] lg:max-w-[439px]"
            >
              <img
                src={service.icon}
                alt=""
                width={service.width}
                height={service.height}
                className="shrink-0"
                style={{ width: service.width, height: service.height }}
              />
              <span className="min-w-0 flex-1 pl-5 text-[26px] font-extrabold leading-[30px] tracking-[0.6px] lg:text-[30px]">
                {service.label}
              </span>
              <span className="flex size-[45px] shrink-0 items-center justify-center rounded-full bg-[#1E196A]">
                <span className="flex h-[13px] w-[21px] items-center justify-center">
                  <img
                    src={svcArrow}
                    alt=""
                    width={13}
                    height={21}
                    className="h-[21px] w-[13px] -rotate-90"
                  />
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
