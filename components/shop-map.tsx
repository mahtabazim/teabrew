"use client";

import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useEffect } from "react";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { directionsUrl, type Shop } from "@/lib/shops";
import "leaflet/dist/leaflet.css";

// Image imports resolve to a bare URL string under Turbopack but to a
// StaticImageData object under Webpack; accept either.
function assetUrl(image: unknown): string {
  return typeof image === "string" ? image : (image as { src: string }).src;
}

// Leaflet derives its default marker URLs from the CSS file's location, which
// bundlers rewrite; point it at the emitted assets instead.
L.Icon.Default.mergeOptions({
  iconRetinaUrl: assetUrl(markerIcon2x),
  iconUrl: assetUrl(markerIcon),
  shadowUrl: assetUrl(markerShadow),
});

function Recenter({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center, map.getZoom() < 13 ? 14 : map.getZoom());
  }, [map, center]);

  return null;
}

export default function ShopMap({
  center,
  shops,
}: {
  center: [number, number];
  shops: Shop[];
}) {
  return (
    <MapContainer
      center={center}
      zoom={14}
      scrollWheelZoom={false}
      className="h-[380px] w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Recenter center={center} />
      {shops.map((shop) => (
        <Marker key={shop.id} position={[shop.lat, shop.lon]}>
          <Popup>
            <strong>{shop.name}</strong>
            <br />
            {shop.category} · {shop.distance} km
            <br />
            <a href={directionsUrl(shop)} target="_blank" rel="noopener noreferrer">
              Directions
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
