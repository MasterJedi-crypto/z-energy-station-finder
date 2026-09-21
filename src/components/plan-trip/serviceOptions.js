import svcToilet from "../../assets/figma/svc-toilet.svg";
import svcCoffee from "../../assets/figma/svc-coffee.svg";
import svc247 from "../../assets/figma/svc-247.svg";
import svcEv from "../../assets/figma/svc-ev.svg";
import svcGroceries from "../../assets/figma/svc-groceries.svg";
import svcWater from "../../assets/figma/svc-water.svg";
import svcTruck from "../../assets/figma/svc-truck.svg";
import svcTyre from "../../assets/figma/svc-tyre.svg";
import svcWifi from "../../assets/figma/svc-wifi.svg";
import svcCarwash from "../../assets/figma/svc-carwash.svg";
import svcAtm from "../../assets/figma/svc-atm.svg";

export const FUEL_TYPES = ["Z-91 Regular 91", "ZX Premium 95", "Z Diesel"];

export const PREFERENCE_SERVICES = [
  { id: "toilets", label: "Toilets", icon: svcToilet },
  { id: "coffee", label: "Coffee", icon: svcCoffee },
  { id: "24-7", label: "24/7", icon: svc247 },
];

export const OTHER_SERVICES = [
  { id: "ev", label: "EV Charging", icon: svcEv },
  { id: "groceries", label: "Groceries", icon: svcGroceries },
  { id: "water", label: "Water", icon: svcWater },
  { id: "truck-parking", label: "Truck Parking", icon: svcTruck },
  { id: "tyre-air", label: "Tyre Air", icon: svcTyre },
  { id: "wifi", label: "Wifi", icon: svcWifi },
  { id: "car-wash", label: "Car Wash", icon: svcCarwash },
  { id: "atm", label: "ATM", icon: svcAtm },
];