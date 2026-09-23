import { useEffect, useMemo } from "react";
import { icon } from "leaflet";
import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

const locationIcon = icon({
  iconUrl: "/images/z-pin.png",
  iconSize: [40, 48],
  iconAnchor: [22, 41],
  popupAnchor: [0, -39],
});

function FitResults({ places }) {
  const map = useMap();

  useEffect(() => {
    if (places.length === 0) return;

    map.fitBounds(
      places.map((place) => [place.lat, place.lng]),
      {
        padding: [30, 30],
        maxZoom: 12,
        animate: false,
      }
    );
  }, [map, places]);

  return null;
}
export function LocationMap({ places, routePath = [] }) {
  const validPlaces = useMemo(
    () =>
      places.filter(
        (place) =>
          Number.isFinite(place?.lat) &&
          Number.isFinite(place?.lng) &&
          Math.abs(place.lat) <= 90 &&
          Math.abs(place.lng) <= 180
      ),
    [places]
  );

  const validRoutePath = useMemo(
    () =>
      routePath.filter(
        (point) =>
          Number.isFinite(point?.lat) &&
          Number.isFinite(point?.lng) &&
          Math.abs(point.lat) <= 90 &&
          Math.abs(point.lng) <= 180
      ),
    [routePath]
  );

  const mapPoints = useMemo(
    () => [...validPlaces, ...validRoutePath],
    [validPlaces, validRoutePath]
  );

  if (mapPoints.length === 0) {
    return <p>No valid coordinates are available to display.</p>;
  }
    return (
    <section
      aria-label="Map of search locations"
      className="relative z-0 h-[360px] min-w-0 overflow-hidden rounded-md border border-gray-300 lg:h-[440px]"
    >
      <MapContainer
        center={[-41, 173]}
        zoom={5}
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        <FitResults places={mapPoints} />
        {validRoutePath.length > 1 && (
          <Polyline
            positions={validRoutePath.map((point) => [
              point.lat,
              point.lng,
            ])}
            pathOptions={{
              color: "#28146f",
              weight: 5,
              opacity: 0.9,
            }}
          />
        )}
        {validPlaces.map((place) => (
          <Marker
            key={`${place.label}-${place.lat}-${place.lng}`}
            position={[place.lat, place.lng]}
            icon={locationIcon}
            title={place.label}
            alt={place.label}
          >
            <Popup>
              <strong>{place.label}</strong>
              <br />
              Latitude: {place.lat}
              <br />
              Longitude: {place.lng}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </section>
  );
}