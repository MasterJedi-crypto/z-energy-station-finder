import { CopyrightMarkIcon } from "./Icons";
import { Logo } from "./Logo";
import contactPin from "../../assets/figma/contact-arrow.svg";
import footerDivider from "../../assets/figma/footer-divider.svg";
import socialFacebook from "../../assets/figma/social-facebook.svg";
import socialInstagram from "../../assets/figma/social-tiktok.svg";
import socialLinkedin from "../../assets/figma/social-linkedin.svg";
import socialTiktok from "../../assets/figma/social-instagram.svg";
import footerGooglePlay from "../../assets/figma/footer-google-play.png";
import footerAppStore from "../../assets/figma/footer-app-store.png";


const groups = [
  {
    id: "at-the-station",
    title: "At the station",
    titleClass: "text-[24px] font-extrabold lg:text-[18px]",
    links: [
      "Food and drink",
      "Payment options",
      "Station services",
      "EV charging",
      "Fuel types, safety and pricing",
    ],
  },
  {
    id: "z-app-links",
    title: "Z App",
    titleClass: "text-[24px] font-extrabold lg:text-[18px]",
    links: [
      "Pay with Z App",
      "Sharetank",
      "Pre-order food and drinks",
      "Helping using Z App",
      "Z App terms and conditions",
    ],
  },
  {
    id: "for-businesses",
    title: "For businesses",
    titleClass: "text-[20px] font-bold lg:text-[18px] lg:font-extrabold",
    links: [
      "Z Business fuel card",
      "Business charging solutions",
      "Fuels and services",
      "Business tips and stories",
    ],
  },
  {
    id: "about-z",
    title: "About Z",
    titleClass: "text-[20px] font-bold lg:text-[18px] lg:font-extrabold",
    links: [
      "Our story",
      "Our people",
      "What we stand for",
      "Sustainability",
      "Our commitment to Te Ao Māori",
      "News",
      "Careers at Z",
      "Corporate centre",
    ],
  },
  {
    id: "rewards-and-promotions",
    title: "Rewards and promotions",
    titleClass: "text-[20px] font-bold lg:text-[18px] lg:font-extrabold",
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
];
function ContactButton({ compact = false }) {
  return (
    <a
      href="#contact"
      className={
        compact
          ? "inline-flex h-[48px] shrink-0 items-center gap-2 whitespace-nowrap rounded-[40px] bg-[#F26522] pl-5 pr-1.5 text-[16px] font-medium tracking-[0.4px] text-white"
          : "inline-flex h-[65px] w-[236px] shrink-0 items-center justify-center gap-[23px] whitespace-nowrap rounded-[40px] bg-[#F26522] pl-[33px] pr-[10px] text-[20px] font-medium tracking-[0.4px] text-white"
      }
    >
      Contact us
      <img
        src={contactPin}
        alt=""
        className={
          compact ? "h-[36px] w-[37px] shrink-0" : "h-[57px] w-[58px] shrink-0"
        }
      />
    </a>
  );
}
function SocialLinks() {
  return (
    <div className="flex items-center">
      <a
        href="#facebook"
        aria-label="Facebook"
        className="flex size-[22px] items-center justify-center"
      >
        <img src={socialFacebook} alt="" className="h-[22px] w-[22px]" />
      </a>
      <a
        href="#instagram"
        aria-label="Instagram"
        className="ml-[10px] flex size-[23px] items-center justify-center"
      >
        <img src={socialInstagram} alt="" className="h-[23px] w-[23px]" />
      </a>
      <a
        href="#linkedin"
        aria-label="LinkedIn"
        className="ml-[10px] flex size-[22px] items-center justify-center rounded-[11px] bg-[#F26522] p-[3px]"
      >
        <img src={socialLinkedin} alt="" className="h-[16px] w-[16px]" />
      </a>
      <a
        href="#tiktok"
        aria-label="TikTok"
        className="relative ml-[10px] h-[22px] w-[21px] overflow-visible"
      >
        <img
          src={socialTiktok}
          alt=""
          className="absolute left-0 top-0 h-[23px] w-[27px] max-w-none"
        />
      </a>
    </div>
  );
}
function StoreBadges({ stacked = false }) {
  return (
    <div
      className={`flex items-center gap-[7px] ${stacked ? "flex-col items-start gap-2" : ""}`}
    >
      <a
        href="#google-play"
        aria-label="Get it on Google Play"
        className="block h-[28px] w-[90px] overflow-hidden"
      >
        <img
          src={footerGooglePlay}
          alt="Get it on Google Play"
          className="h-[28px] w-[90px] object-contain"
        />
      </a>
      <a
        href="#app-store"
        aria-label="Download on the App Store"
        className="block h-[28px] w-[83px] overflow-hidden"
      >
        <img
          src={footerAppStore}
          alt="Download on the App Store"
          className="h-[28px] w-[83px] object-contain"
        />
      </a>
    </div>
  );
}
function linkHref(label) {
  return `#${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
export function Footer() {
  return (
    <footer
      id="footer"
      className="bg-white px-[30px] pb-10 pt-3 lg:px-16 lg:pb-8 lg:pt-6"
    >
      <div className="mx-auto max-w-[1440px]">
        <div className="lg:flex lg:items-start lg:gap-10">
          <Logo className="h-[71px] w-[69px] lg:mt-1 lg:h-14 lg:w-14" />
          <div className="mt-6 lg:hidden">
            <ContactButton />
          </div>

          <div className="mt-[59px] flex flex-col gap-10 lg:mt-0 lg:grid lg:flex-1 lg:grid-cols-5 lg:gap-6">
            {groups.map((group) => (
              <section key={group.id} id={group.id}>
                <h2
                  className={`${group.titleClass} leading-normal text-[#1E196A]`}
                >
                  {group.title}
                </h2>
                <ul className="mt-[18px] flex flex-col gap-[23px] lg:mt-4 lg:gap-2">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href={linkHref(link)}
                        className="text-[18px] font-medium leading-[23px] text-[#3C3D3F] lg:text-[14px] lg:leading-snug"
                      >
                        {link === "Our commitment to Te Ao Māori" ? (
                          <>
                            Our commitment to
                            <br className="lg:hidden" /> Te Ao Māori
                          </>
                        ) : (
                          link
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <div className="mt-8 hidden lg:mt-0 lg:flex lg:w-[236px] lg:shrink-0 lg:flex-col lg:items-start">
            <ContactButton compact />
            <div className="mt-5">
              <SocialLinks />
            </div>
            <div className="mt-5">
              <StoreBadges stacked />
            </div>
          </div>
        </div>

        <div className="mt-12 lg:hidden">
          <img src={footerDivider} alt="" className="h-px w-full" />
          <div className="mt-6">
            <SocialLinks />
          </div>
          <div className="mt-6">
            <StoreBadges />
          </div>
        </div>

        <div className="mt-8 lg:mt-10 lg:flex lg:items-center lg:justify-between lg:border-t lg:border-neutral-200 lg:pt-5">
          <div className="flex gap-[66px] text-[14px] leading-normal text-[#3C3D3F] lg:hidden">
            <div className="flex w-[214px] flex-col gap-[14px]">
              <a href="#privacy">Privacy</a>
              <a href="#fuel-and-store-products">
                Fuel and Store Products Safety
                <br />
                Data Sheets
              </a>
            </div>
            <div className="flex w-[133px] flex-col gap-[14px]">
              <a href="#terms-of-use">Terms of use</a>
              <a href="#investor-relations">Investor relations</a>
            </div>
          </div>
          <div className="hidden gap-8 text-[12px] text-neutral-500 lg:flex">
            <a href="#privacy">Privacy</a>
            <a href="#terms-of-use">Terms of use</a>
            <a href="#fuel-and-store-products">
              Fuel and Store Products Safety Data Sheets
            </a>
            <a href="#investor-relations">Investor Relations</a>
          </div>

          <p className="mt-8 flex items-center gap-3 text-[12px] leading-snug text-[#3C3D3F] lg:mt-0 lg:flex-row-reverse lg:text-neutral-500">
            <CopyrightMarkIcon className="size-10 shrink-0 lg:size-8" />
            <span>
              © Z Energy Limited. All trademarks are used under license.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
