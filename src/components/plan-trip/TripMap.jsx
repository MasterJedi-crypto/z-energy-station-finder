import { useEffect } from "react";
import { divIcon } from "leaflet";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function FitToRoute({ path }) {
  const map = useMap();
  useEffect(() => {
    if (path.length > 1) {
      map.fitBounds(path.map((p) => [p.lat, p.lng]), { padding: [40, 40] });
    }
  }, [map, path]);
  return null;
}

function endIcon(colour) {
  return divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;border:2px solid #fff;background:${colour};box-shadow:0 1px 6px rgba(0,0,0,.35)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function stopIcon(number, station, selected) {
  const price = station.price != null ? `$${station.price.toFixed(2)}` : "—";
  return divIcon({
    className: "",
    html: `
      <div style="display:flex;align-items:center;gap:6px;white-space:nowrap">
        <span style="display:flex;width:24px;height:24px;align-items:center;justify-content:center;border-radius:9999px;background:${selected ? "#F26522" : "#1E196A"};color:#fff;font-size:11px;font-weight:700">${number}</span>
        <span style="border-radius:6px;background:#fff;padding:3px 8px;font-size:11px;font-weight:700;color:#1E196A;box-shadow:0 2px 6px rgba(0,0,0,.25);line-height:1.2">${station.name}<br/>${price}</span>
      </div>`,
    iconSize: null,
    iconAnchor: [12, 12],
  });
}

export function TripMap({ route, stations, selectedIds, onToggle }) {
  const line = route.path.map((p) => [p.lat, p.lng]);

  return (
    <div>
      <div className="relative z-0 h-[300px] overflow-hidden rounded-[10px] lg:h-[420px]">
        <MapContainer center={line[0]} zoom={7} scrollWheelZoom={false} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Polyline positions={line} pathOptions={{ color: "#2F80ED", weight: 5 }} />
          <Marker position={[route.origin.lat, route.origin.lng]} icon={endIcon("#1E196A")} />
          <Marker
            position={[route.destination.lat, route.destination.lng]}
            icon={endIcon("#F26522")}
          />
          {stations.map((station, index) => (
            <Marker
              key={station.id}
              position={[station.lat, station.lng]}
              icon={stopIcon(index + 1, station, selectedIds.includes(station.id))}
              eventHandlers={{ click: () => onToggle(station.id) }}
            />
          ))}
          <FitToRoute path={route.path} />
        </MapContainer>
      </div>
      <p className="mt-2 text-[12px] text-[#58595B]">
        Tap any station on the map to add it to your stops.
      </p>
    </div>
  );
}