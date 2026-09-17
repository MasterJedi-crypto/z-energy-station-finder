import { useEffect, useId, useState } from "react";
import { Logo } from "./Logo";
import { ChevronDownIcon, CloseIcon, MenuIcon, SearchIcon } from "./Icons";
import headerPerson from "../../assets/figma/header-person.svg";
import headerSearch from "../../assets/figma/header-search.svg";


const desktopMenus = [
  {
    label: "At the station",
    href: "#at-the-station",
    links: [
      "Food and drink",
      "Payment options",
      "Station services",
      "EV charging",
      "Fuel types, safety and pricing",
    ],
  },
  {
    label: "Rewards and promotions",
    href: "#rewards-and-promotions",
    links: [
      "Z Rewards",
      "Z Rewards Promotions",
      "Fuelup",
      "Club+",
      "Help with Club+",
      "Airpoints",
      "Customer survey",
    ],
  },
  {
    label: "Z App",
    href: "#z-app-links",
    links: [
      "Pay with Z App",
      "Sharetank",
      "Pre-order food and drinks",
      "Helping using Z App",
      "Z App terms and conditions",
    ],
  },
];
const hoverLink = "transition-colors hover:text-[#F26522]";
function DropdownPanel({ items, onClose }) {
  return (
    <div className="absolute left-0 top-full z-40 min-w-[240px] rounded-xl bg-white py-3 shadow-[0_12px_32px_rgba(30,25,106,0.12)]">
      {items.map((item) =>
        item.onSelect ? (
          <button
            key={item.label}
            type="button"
            className={`block w-full px-4 py-2 text-left text-[14px] font-medium text-neutral-700 ${hoverLink}`}
            onClick={() => {
              item.onSelect?.();
              onClose();
            }}
          >
            {item.label}
          </button>
        ) : (
          <a
            key={item.label}
            href={item.href}
            className={`block px-4 py-2 text-[14px] font-medium text-neutral-700 ${hoverLink}`}
            onClick={onClose}
          >
            {item.label}
          </a>
        ),
      )}
    </div>
  );
}
const loginOptions = [
  {
    id: "charging",
    title: "Business Charging Online",
    subtitle: "Manage your EV cards",
  },
  {
    id: "business",
    title: "Z Business Online",
    subtitle: "Manage your fuel cards",
  },
];

export function Header({
  onHome,
  onOpenMenu,
  onOpenSearch,
  onFindStation,
  onPlanTrip,
  onOpenChargingLogin,
  onOpenBusinessLogin,
  onLogout,
  accountName,
  searchOpen = false,
}) {
  const [openMenu, setOpenMenu] = useState(null);
  useEffect(() => {
    const close = () => setOpenMenu(null);
    window.addEventListener("scroll", close, { passive: true });
    return () => window.removeEventListener("scroll", close);
  }, []);
  const toggleMenu = (id) =>
    setOpenMenu((current) => (current === id ? null : id));
  return (
    <header className="sticky top-0 z-30 bg-white">
      <div className="flex items-center justify-between px-5 py-3 lg:hidden">
        <button type="button" onClick={onHome} aria-label="Z Energy home">
          <Logo className="h-12 w-12" />
        </button>
        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label={searchOpen ? "Close search" : "Search"}
            aria-expanded={searchOpen}
            onClick={onOpenSearch}
            className={`relative text-z-orange ${searchOpen ? "after:absolute after:-bottom-1 after:left-1/2 after:h-[3px] after:w-7 after:-translate-x-1/2 after:rounded-full after:bg-[#F26522]" : ""}`}
          >
            <SearchIcon className="size-[26px]" />
          </button>
          <span className="h-6 w-px bg-neutral-300" aria-hidden="true" />
          <button
            type="button"
            aria-label="Open menu"
            onClick={onOpenMenu}
            className="text-z-orange"
          >
            <MenuIcon className="size-[26px]" />
          </button>
        </div>
      </div>

      <div className="hidden lg:block" onMouseLeave={() => setOpenMenu(null)}>
        <div className="mx-auto flex h-[100px] max-w-[1440px] items-center justify-between border border-[#d9d9d9] px-[82px]">
          <div className="flex items-center gap-6">
            <button type="button" onClick={onHome} aria-label="Z Energy home">
              <Logo className="h-16 w-[78px]" />
            </button>
            <div className="flex items-center gap-1">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu("Personal")}
                  className={`inline-flex h-[50px] w-[140px] items-center justify-center rounded-[4px] bg-[#F26522] text-[20px] font-bold text-[#353535] transition-colors hover:text-white ${openMenu === "Personal" ? "text-white" : ""}`}
                >
                  Personal
                </button>
                {openMenu === "Personal" ? (
                  <DropdownPanel
                    onClose={() => setOpenMenu(null)}
                    items={[
                      { label: "Personal", href: "#top" },
                      { label: "Z Rewards", href: "#rewards-and-promotions" },
                      { label: "Z App", href: "#z-app" },
                    ]}
                  />
                ) : null}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu("Business")}
                  className={`inline-flex h-[50px] w-[140px] items-center justify-center rounded-[5px] text-[20px] font-bold text-[#353535] ${hoverLink} ${openMenu === "Business" ? "text-[#F26522]" : ""}`}
                >
                  Business
                </button>
                {openMenu === "Business" ? (
                  <DropdownPanel
                    onClose={() => setOpenMenu(null)}
                    items={[
                      {
                        label: "Z Business fuel card",
                        href: "#for-businesses",
                      },
                      {
                        label: "Business charging solutions",
                        href: "#for-businesses",
                      },
                      { label: "Fuels and services", href: "#for-businesses" },
                    ]}
                  />
                ) : null}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("Download Z App")}
                className={`text-[20px] font-bold text-[#353535] ${hoverLink} ${openMenu === "Download Z App" ? "text-[#F26522]" : ""}`}
              >
                Download Z App
              </button>
              {openMenu === "Download Z App" ? (
                <DropdownPanel
                  onClose={() => setOpenMenu(null)}
                  items={[
                    { label: "Download on the App Store", href: "#footer" },
                    { label: "Get it on Google Play", href: "#footer" },
                    { label: "Pay with Z App", href: "#z-app" },
                  ]}
                />
              ) : null}
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleMenu("About Z")}
                className={`inline-flex h-[56px] w-[140px] items-center justify-center text-[20px] font-bold text-[#353535] ${hoverLink} ${openMenu === "About Z" ? "text-[#F26522]" : ""}`}
              >
                About Z
              </button>
              {openMenu === "About Z" ? (
                <DropdownPanel
                  onClose={() => setOpenMenu(null)}
                  items={[
                    { label: "Our story", href: "#about-z" },
                    { label: "Our people", href: "#about-z" },
                    { label: "What we stand for", href: "#about-z" },
                    { label: "Sustainability", href: "#about-z" },
                    { label: "News", href: "#news" },
                  ]}
                />
              ) : null}
            </div>
            <button
              type="button"
              aria-label={searchOpen ? "Close search" : "Search"}
              aria-expanded={searchOpen}
              onClick={onOpenSearch}
              className={`relative flex size-[35px] items-center justify-center ${searchOpen ? "after:absolute after:-bottom-2 after:left-1/2 after:h-[3px] after:w-8 after:-translate-x-1/2 after:bg-[#F26522]" : ""}`}
            >
              <img
                src={headerSearch}
                alt=""
                width={35}
                height={35}
                className="size-[35px]"
              />
            </button>
            {accountName ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => toggleMenu("account")}
                  className={`flex items-center gap-2 text-left ${hoverLink} ${openMenu === "account" ? "text-[#F26522]" : ""}`}
                >
                  <div className="flex size-10 items-center justify-center overflow-hidden">
                    <img
                      src={headerPerson}
                      alt=""
                      width={36}
                      height={36}
                      className="h-9 w-9"
                    />
                  </div>
                  <p className="w-[89px] text-[20px] font-bold leading-normal">
                    Hi
                    <br />
                    {accountName}
                  </p>
                </button>
                {openMenu === "account" ? (
                  <DropdownPanel
                    onClose={() => setOpenMenu(null)}
                    items={[
                      { label: "Z Rewards", href: "#rewards-and-promotions" },
                      { label: "Contact us", href: "#footer" },
                      { label: "Log out", onSelect: onLogout },
                    ]}
                  />
                ) : null}
              </div>
            ) : (
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={openMenu === "Login"}
                  aria-haspopup="menu"
                  onClick={() => toggleMenu("Login")}
                  className="inline-flex h-[50px] min-w-[168px] shrink-0 items-center justify-between gap-3 rounded-[40px] bg-[#F26522] py-1.5 pl-6 pr-1.5 text-[20px] font-bold leading-normal text-white"
                >
                  Login
                  <span className="flex size-9 items-center justify-center rounded-full bg-white text-[#F26522]">
                    <ChevronDownIcon
                      className={`size-4 transition-transform ${openMenu === "Login" ? "rotate-180" : ""}`}
                    />
                  </span>
                </button>
                {openMenu === "Login" ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+10px)] z-50 w-[268px] rounded-[16px] bg-white px-5 py-4 shadow-[0_16px_40px_rgba(30,25,106,0.16)]"
                  >
                    {loginOptions.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        role="menuitem"
                        className="group block w-full py-2.5 text-left first:pt-0 last:pb-0"
                        onClick={() => {
                          setOpenMenu(null);
                          if (option.id === "charging") onOpenChargingLogin?.();
                          else onOpenBusinessLogin?.();
                        }}
                      >
                        <span className="block text-[16px] font-bold leading-snug text-[#7C6F8E] group-hover:text-[#1A1A1A]">
                          {option.title}
                        </span>
                        <span className="mt-0.5 block text-[14px] font-medium leading-snug text-[#A396B3] group-hover:text-[#585858]">
                          {option.subtitle}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            )}
          </div>
        </div>

        <nav className="mx-auto flex h-[64px] max-w-[1440px] items-center gap-2 border-x border-b border-[#d9d9d9] px-[82px] text-[20px] font-bold text-[#353535]">
          {desktopMenus.map((menu) => {
            const open = openMenu === menu.label;
            return (
              <div
                key={menu.label}
                className="relative flex h-full items-center"
              >
                <button
                  type="button"
                  className={`inline-flex h-full items-center gap-1.5 px-2 ${hoverLink} ${open ? "text-[#F26522]" : ""}`}
                  onClick={() => toggleMenu(menu.label)}
                >
                  {menu.label}
                  <ChevronDownIcon className="size-3.5" />
                </button>
                {open ? (
                  <DropdownPanel
                    onClose={() => setOpenMenu(null)}
                    items={menu.links.map((link) => ({
                      label: link,
                      href: `#${link.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
                    }))}
                  />
                ) : null}
              </div>
            );
          })}
          <div className="relative flex h-full items-center">
            <button
              type="button"
              className={`inline-flex h-full items-center px-2 ${hoverLink} ${openMenu === "Locations" ? "text-[#F26522]" : ""}`}
              onClick={() => toggleMenu("Locations")}
            >
              Locations
            </button>
            {openMenu === "Locations" ? (
              <DropdownPanel
                onClose={() => setOpenMenu(null)}
                items={[
                  { label: "Find a station", onSelect: onFindStation },
                  { label: "My trips", onSelect: onPlanTrip },
                  { label: "My Favorites", href: "#news" },
                  { label: "Recent Searches", href: "#news" },
                ]}
              />
            ) : null}
          </div>
        </nav>
      </div>
    </header>
  );
}
export function SearchOverlay({ open, onClose, onSearchStations }) {
  const searchId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-x-0 bottom-0 top-[72px] z-40 mx-auto flex max-w-[430px] flex-col lg:top-[164px] lg:max-w-none"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="relative z-10 flex h-[88px] shrink-0 items-center px-5 lg:h-[120px]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(13, 5, 117, 0.2) 4.33%, rgba(48, 39, 172, 0.2) 100%), linear-gradient(90deg, #28208e 0%, #28208e 100%)",
        }}
      >
        <form
          className="mx-auto w-full max-w-[1201px]"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const value = new FormData(form).get("site-search");
            onSearchStations(typeof value === "string" ? value : "");
            onClose();
          }}
        >
          <label className="sr-only" htmlFor={searchId}>
            Type to search
          </label>
          <div className="flex h-[54px] w-full items-center gap-3 rounded-[10px] bg-white p-[10px]">
            <img
              src={headerSearch}
              alt=""
              width={24}
              height={24}
              className="size-6 shrink-0"
            />
            <input
              id={searchId}
              name="site-search"
              autoFocus
              placeholder="Type to search..."
              className="h-full w-full bg-transparent text-[16px] font-semibold leading-none text-[#58595B] outline-none placeholder:text-[#58595B] lg:text-[20px]"
            />
          </div>
        </form>
      </div>
      <button
        type="button"
        aria-label="Close search"
        onClick={onClose}
        className="min-h-0 flex-1 bg-white/80 backdrop-blur-md"
      />
    </div>
  );
}
const menuLinks = [
  "Plan a trip",
  "At the station",
  "Z App",
  "For business",
  "Sustainability",
  "About Z",
  "Z Rewards",
];
export function BurgerMenu({
  open,
  onClose,
  onFindStation,
  onPlanTrip,
  onHome,
  onOpenChargingLogin,
  onOpenBusinessLogin,
  onLogout,
  accountName,
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center ${open ? "pointer-events-auto" : "pointer-events-none"} lg:hidden`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div className="relative h-full w-full max-w-[430px] overflow-hidden">
        <aside
          className={`h-full overflow-y-auto bg-white px-6 py-5 shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="mb-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => {
                onHome();
                onClose();
              }}
              aria-label="Z Energy home"
            >
              <Logo className="h-10 w-10" />
            </button>
            <button
              type="button"
              aria-label="Close menu"
              onClick={onClose}
              className="text-z-navy"
            >
              <CloseIcon />
            </button>
          </div>
          {accountName ? (
            <p className="mb-4 text-[17px] font-bold text-z-navy">Hi {accountName}</p>
          ) : (
            <div className="mb-6 flex flex-col gap-2">
              <p className="text-[13px] font-bold uppercase tracking-wide text-neutral-500">
                Login
              </p>
              {loginOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className="rounded-xl border border-[#eee] px-4 py-3 text-left"
                  onClick={() => {
                    if (option.id === "charging") onOpenChargingLogin?.();
                    else onOpenBusinessLogin?.();
                    onClose();
                  }}
                >
                  <span className="block text-[15px] font-bold text-z-navy">
                    {option.title}
                  </span>
                  <span className="text-[13px] text-neutral-500">{option.subtitle}</span>
                </button>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={() => {
              onFindStation();
              onClose();
            }}
            className="mb-6 flex h-12 w-full items-center justify-center rounded-full bg-z-orange text-base font-bold text-white"
          >
            Find a station
          </button>
          <nav className="flex flex-col gap-5 text-[17px] font-semibold text-z-navy">
            {menuLinks.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => {
                  if (item === "Plan a trip") onPlanTrip();
                  else onHome();
                  onClose();
                }}
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            href="#footer"
            onClick={() => {
              onHome();
              onClose();
            }}
            className="mt-8 flex h-12 items-center justify-center rounded-full bg-z-orange text-base font-bold text-white"
          >
            Contact us
          </a>
          {accountName ? (
            <button
              type="button"
              onClick={() => {
                onLogout?.();
                onClose();
              }}
              className="mt-3 flex h-12 w-full items-center justify-center rounded-full border border-[#F26522] text-base font-bold text-[#F26522]"
            >
              Log out
            </button>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
