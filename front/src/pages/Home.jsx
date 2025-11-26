import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// --- Arreglo para los iconos por defecto de Leaflet en React ---
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import ModalInfo from "../ui/ModalInfo";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function SetViewOnClick({ coords }) {
  const map = useMap();
  map.flyTo(coords, 14, {
    duration: 2,
  });
  return null;
}

function Home() {
  return (
    <div className="relative h-[calc(100vh-4rem)] w-full overflow-hidden bg-slate-100">
      {/* --- MAPA --- */}
      <MapContainer
        center={[28.3852, -81.5639]}
        zoom={12}
        scrollWheelZoom={true}
        className="h-full w-full outline-none z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ModalInfo />
      </MapContainer>
    </div>
  );
}

export default Home;
