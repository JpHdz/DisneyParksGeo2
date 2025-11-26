import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents, Polygon, Polyline } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toast from "react-hot-toast";

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

function FlyToLocation({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.lat, target.lng], 16, {
        duration: 2,
      });
    }
  }, [target, map]);
  return null;
}

function MapClickHandler({ addMode, onMapClick }) {
  useMapEvents({
    click(e) {
      if (addMode) {
        onMapClick(e.latlng);
      }
    },
  });
  
  // Change cursor style when in add mode
  const map = useMap();
  useEffect(() => {
    if (addMode) {
      map.getContainer().style.cursor = "crosshair";
    } else {
      map.getContainer().style.cursor = "";
    }
  }, [addMode, map]);

  return null;
}

function Home() {
  const navigate = useNavigate();
  const [parks, setParks] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const [details, setDetails] = useState({ restaurants: [], attractions: [] });
  const [loading, setLoading] = useState(false);
  const [mapTarget, setMapTarget] = useState(null);
  
  // Add Data State
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [addMode, setAddMode] = useState(null); // 'restaurant' | 'attraction' | null

  useEffect(() => {
    fetch("http://localhost:3000/api/v1/parks")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setParks(data.data.data);
        }
      })
      .catch((err) => console.error("Error fetching parks:", err));
  }, []);

  const handleParkSelect = async (park) => {
    setSelectedPark(park);
    setLoading(true);
    try {
      const [resRestaurants, resAttractions] = await Promise.all([
        fetch(`http://localhost:3000/api/v1/restaurants?park=${park._id}`),
        fetch(`http://localhost:3000/api/v1/attractions?park=${park._id}`),
      ]);

      const dataRestaurants = await resRestaurants.json();
      const dataAttractions = await resAttractions.json();

      setDetails({
        restaurants: dataRestaurants.data.data,
        attractions: dataAttractions.data.data,
      });
    } catch (error) {
      console.error("Error fetching details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setSelectedPark(null);
    setDetails({ restaurants: [], attractions: [] });
    setMapTarget(null);
  };

  const handleItemClick = (coordinates) => {
    setMapTarget(coordinates);
  };

  const handleAddClick = (type) => {
    setIsFabOpen(false);
    if (type === "dish") {
      navigate("/dish/new");
    } else if (type === "park") {
      navigate("/park/create-map");
    } else {
      setAddMode(type);
      toast("Selecciona la ubicación en el mapa", {
        icon: "📍",
        duration: 4000,
      });
    }
  };

  const onMapClick = (latlng) => {
    if (addMode === "restaurant") {
      navigate(`/restaurant/new?lat=${latlng.lat}&lng=${latlng.lng}`);
      setAddMode(null);
    } else if (addMode === "attraction") {
      navigate(`/attraction/new?lat=${latlng.lat}&lng=${latlng.lng}`);
      setAddMode(null);
    }
  };

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
        
        <FlyToLocation target={mapTarget} />
        <MapClickHandler addMode={addMode} onMapClick={onMapClick} />

        {/* Render Park Polygons */}
        {parks.map((park) => {
          if (park.polygon && park.polygon.coordinates && park.polygon.coordinates.length > 0) {
            // GeoJSON is [lng, lat], Leaflet needs [lat, lng]
            const positions = park.polygon.coordinates[0].map((coord) => [coord[1], coord[0]]);
            return (
              <Polygon
                key={park._id}
                positions={positions}
                pathOptions={{ color: "green", fillOpacity: 0.2 }}
              >
                <Popup>
                  <div className="text-center">
                    <h3 className="font-bold text-lg">{park.name}</h3>
                    <p className="text-sm">{park.description}</p>
                    <button 
                      onClick={() => handleParkSelect(park)}
                      className="mt-2 text-blue-600 hover:underline text-xs"
                    >
                      Ver detalles
                    </button>
                  </div>
                </Popup>
              </Polygon>
            );
          }
          return null;
        })}

        {/* Render Markers for Restaurants */}
        {details.restaurants.map((restaurant) => (
          <Marker
            key={restaurant._id}
            position={[restaurant.coordinates.lat, restaurant.coordinates.lng]}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{restaurant.name}</h3>
                <p className="text-sm">{restaurant.category}</p>
                <p className="text-xs text-gray-500">
                  {"★".repeat(restaurant.stars)}
                </p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Markers for Attractions */}
        {details.attractions.map((attraction) => (
          <Marker
            key={attraction._id}
            position={[attraction.coordinates.lat, attraction.coordinates.lng]}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{attraction.name}</h3>
                <p className="text-sm">Rating: {attraction.rating}/10</p>
                <p className="text-xs text-red-500 font-semibold">
                  Espera: {attraction.waitTime} min
                </p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <ModalInfo
        parks={parks}
        selectedPark={selectedPark}
        details={details}
        loading={loading}
        onParkSelect={handleParkSelect}
        onBack={handleBack}
        onItemClick={handleItemClick}
      />

      {/* FAB Button */}
      <div className="absolute bottom-8 right-8 z-[1000] flex flex-col items-end gap-2">
        {isFabOpen && (
          <div className="flex flex-col gap-2 mb-2 animate-fade-in-up">
            <button
              onClick={() => handleAddClick("park")}
              className="bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700 transition-all flex items-center gap-2"
            >
               Parque
            </button>
            <button
              onClick={() => handleAddClick("attraction")}
              className="bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-all flex items-center gap-2"
            >
               Atracción
            </button>
            <button
              onClick={() => handleAddClick("restaurant")}
              className="bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center gap-2"
            >
               Restaurante
            </button>
            <button
              onClick={() => handleAddClick("dish")}
              className="bg-yellow-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-yellow-600 transition-all flex items-center gap-2"
            >
              Platillo
            </button>
          </div>
        )}
        <button
          onClick={() => {
            if (addMode) {
              setAddMode(null); // Cancel add mode
            } else {
              setIsFabOpen(!isFabOpen);
            }
          }}
          className={`${
            addMode ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
          } text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-3xl transition-all transform hover:scale-105`}
        >
          {addMode ? "×" : "+"}
        </button>
      </div>
      
      {/* Add Mode Indicator */}
      {addMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white px-6 py-3 rounded-full shadow-xl z-[1000] font-bold animate-bounce">
          📍 Haz click en el mapa para agregar {addMode === "restaurant" ? "restaurante" : "atracción"}
        </div>
      )}
    </div>
  );
}

export default Home;
