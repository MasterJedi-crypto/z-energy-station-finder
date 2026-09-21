import tripHero from "../../assets/figma/trip-hero.png";

export function TripHero({ onBack }) {
  const title = (
    <span className="text-[26px] font-extrabold leading-normal text-z-navy lg:text-[#353535] lg:text-[50px]">
      <span className="hidden lg:inline">← </span>
      Plan my trip
    </span>
  );

  return (
    <section className="relative h-[160px] w-full overflow-hidden lg:h-[345px]">
      <img
        src={tripHero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-y-0 left-0 hidden w-full max-w-[854px] bg-gradient-to-r from-[#fffefe] from-[43%] to-transparent lg:block" />
      <div className="relative mx-auto flex h-full max-w-[1440px] items-center px-5 lg:block lg:px-[80px] lg:pb-0 lg:pt-[42px]">
        <div>
          {onBack ? (
            <button type="button" onClick={onBack}>
              {title}
            </button>
          ) : (
            <h1>{title}</h1>
          )}
          <p className="mt-[23px] hidden text-[30px] leading-normal text-[#58595B] lg:block">
            Find the best stops for fuel, food and more.
          </p>
        </div>
      </div>
    </section>
  );
}