import { useEffect, useId, useRef, useState } from "react";
import { Logo } from "./Logo";
import { CameraIcon, ChevronDownIcon, ChevronRightIcon, MenuIcon, SearchIcon } from "./Icons";
import { loginMenuOptions } from "../../auth";
import { CtaPill } from "./CtaPill";
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
function AccountAvatar({ src, onUpload, fileRef }) {
  const innerRef = useRef(null);
  const inputRef = fileRef || innerRef;
  return (
    <span className="relative inline-flex size-10 shrink-0">
      <img
        src={src || headerPerson}
        alt=""
        width={40}
        height={40}
        className="size-10 rounded-full border border-[#d9d9d9] object-cover"
      />
      <button
        type="button"
        aria-label="Upload profile photo"
        title="Upload photo"
        className="absolute -bottom-0.5 -right-0.5 flex size-[18px] items-center justify-center rounded-full border border-white bg-[#F26522] text-white shadow-[0_1px_4px_rgba(0,0,0,0.25)] hover:bg-[#d4551b]"
        onClick={(event) => {
          event.stopPropagation();
          inputRef.current?.click();
        }}
      >
        <CameraIcon className="size-2.5" />
      </button>
      {fileRef ? null : (
        <input
          ref={innerRef}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) onUpload?.(file);
          }}
        />
      )}
    </span>
  );
}
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

export function Header({
  onHome,
  onOpenMenu,
  onOpenSearch,
  onFindStation,
  onPlanTrip,
  onOpenChargingLogin,
  onOpenBusinessLogin,
  onLogout,
  onUploadAvatar,
  accountName,
  accountAvatar,
  audience = "personal",
  onAudienceChange,
  searchOpen = false,
}) {
  const loginOptions = loginMenuOptions(audience);
  const avatarInputRef = useRef(null);
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
                  onClick={() => {
                    onAudienceChange?.("personal");
                    toggleMenu("Personal");
                  }}
                  className={`inline-flex h-[50px] w-[140px] items-center justify-center rounded-[4px] text-[20px] font-bold text-[#353535] transition-colors hover:text-white ${
                    audience === "personal" ? "bg-[#F26522]" : hoverLink
                  } ${openMenu === "Personal" ? "text-white" : ""}`}
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
                  onClick={() => {
                    onAudienceChange?.("business");
                    toggleMenu("Business");
                  }}
                  className={`inline-flex h-[50px] w-[140px] items-center justify-center rounded-[5px] text-[20px] font-bold text-[#353535] ${
                    audience === "business"
                      ? "bg-[#F26522] text-white"
                      : hoverLink
                  } ${openMenu === "Business" && audience !== "business" ? "text-[#F26522]" : ""}`}
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
              <div className="relative flex items-center gap-2">
                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) onUploadAvatar?.(file);
                  }}
                />
                <AccountAvatar src={accountAvatar} fileRef={avatarInputRef} />
                <button
                  type="button"
                  onClick={() => toggleMenu("account")}
                  className={`text-left ${hoverLink} ${openMenu === "account" ? "text-[#F26522]" : ""}`}
                >
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
                      {
                        label: "Upload photo",
                        onSelect: () => avatarInputRef.current?.click(),
                      },
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
const burgerGroups = [
  [
    { label: "At the stations", href: "#at-the-station", chevron: true },
    { label: "Rewards and promotions", href: "#rewards-and-promotions", chevron: true },
    { label: "Z App", href: "#z-app", chevron: true },
    { label: "Locations", action: "find", chevron: false },
  ],
  [
    { label: "My trips", action: "trip", chevron: true },
    { label: "My Favorites", href: "#news", chevron: true },
    { label: "Recents Searches", href: "#news", chevron: true },
  ],
  [
    { label: "Download Z App", href: "#footer", chevron: true },
    { label: "About Z", href: "#about-z", chevron: true },
  ],
];

function BurgerLink({ item, onClose, onHome, onFindStation, onPlanTrip }) {
  const className =
    "flex min-h-[52px] w-full items-center justify-between text-left text-[20px] font-semibold leading-none text-[#1A1A1A]";
  const content = (
    <>
      <span>{item.label}</span>
      {item.chevron ? (
        <ChevronRightIcon className="size-4 text-[#1A1A1A]" />
      ) : null}
    </>
  );
  const go = () => {
    if (item.action === "find") onFindStation?.();
    else if (item.action === "trip") onPlanTrip?.();
    else onHome?.();
    onClose();
  };
  if (item.href) {
    return (
      <a href={item.href} onClick={go} className={className}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={go} className={className}>
      {content}
    </button>
  );
}

export function BurgerMenu({
  open,
  onClose,
  onFindStation,
  onPlanTrip,
  onHome,
  onOpenChargingLogin,
  onOpenBusinessLogin,
  onLogout,
  onUploadAvatar,
  accountName,
  accountAvatar,
  audience = "personal",
  onAudienceChange,
}) {
  const personal = audience !== "business";
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
  const openLogin = () => {
    if (personal) onOpenChargingLogin?.();
    else onOpenBusinessLogin?.();
    onClose();
  };
  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center ${open ? "pointer-events-auto" : "pointer-events-none"} lg:hidden`}
      aria-hidden={!open}
      {...(!open ? { inert: "" } : {})}
    >
      <div
        className={`absolute inset-0 bg-[#ececec]/90 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />
      <div
        className={`relative flex h-full w-full items-start justify-center overflow-y-auto px-3 py-6 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      >
        <aside
          className="flex h-[714px] w-[444px] shrink-0 flex-col rounded-[16px] bg-white px-[27px] pb-6 pt-5 shadow-[0_8px_24px_rgba(30,25,106,0.08)]"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          onClick={(event) => event.stopPropagation()}
        >
          <div
            className="flex"
            role="tablist"
            aria-label="Audience"
          >
            <button
              type="button"
              role="tab"
              aria-selected={personal}
              onClick={() => onAudienceChange?.("personal")}
              className={`flex h-[60px] w-[195px] shrink-0 items-center justify-center gap-[10px] rounded-[10px] p-[10px] text-[16px] font-bold leading-none ${
                personal
                  ? "bg-[#F26522] text-white"
                  : "border border-[#1E196A] bg-white text-[#1E196A]"
              }`}
            >
              For personal
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!personal}
              onClick={() => onAudienceChange?.("business")}
              className={`flex h-[60px] w-[195px] shrink-0 items-center justify-center gap-[10px] rounded-[10px] p-[10px] text-[16px] font-bold leading-none ${
                personal
                  ? "border border-[#1E196A] bg-white text-[#1E196A]"
                  : "bg-[#F26522] text-white"
              }`}
            >
              For business
            </button>
          </div>
          <nav className="mt-6 flex flex-1 flex-col justify-between">
            {burgerGroups.map((group, index) => (
              <div
                key={group[0].label}
                className={index > 0 ? "border-t border-[#E6E6E6] pt-3" : ""}
              >
                {group.map((item) => (
                  <BurgerLink
                    key={item.label}
                    item={item}
                    onClose={onClose}
                    onHome={onHome}
                    onFindStation={onFindStation}
                    onPlanTrip={onPlanTrip}
                  />
                ))}
              </div>
            ))}
          </nav>
          {accountName ? (
            <div className="mt-auto flex items-center justify-between gap-3 pt-4">
              <div className="flex items-center gap-3">
                <AccountAvatar src={accountAvatar} onUpload={onUploadAvatar} />
                <p className="text-[16px] font-bold text-[#1A1A1A]">Hi {accountName}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onLogout?.();
                  onClose();
                }}
                className="text-[14px] font-bold text-[#F26522]"
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="mt-auto pt-4">
              <CtaPill size="compact" onClick={openLogin}>Login</CtaPill>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
