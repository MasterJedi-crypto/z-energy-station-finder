import { ServiceTile } from "./ServiceTile";
import { OTHER_SERVICES } from "./serviceOptions";

export function OtherServices({ services, onToggleService }) {
  return (
    <div>
      <p className="text-[18px] font-bold text-[#353535]">Other services I need</p>
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-x-[34px] lg:gap-y-[40px]">
        {OTHER_SERVICES.map((service) => (
          <ServiceTile
            key={service.id}
            label={service.label}
            icon={service.icon}
            selected={services.includes(service.id)}
            onToggle={() => onToggleService(service.id)}
          />
        ))}
      </div>
    </div>
  );
}