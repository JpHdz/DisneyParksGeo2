import { useState, useCallback } from "react";
import Map, { Source, Layer, Marker } from "react-map-gl";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import "mapbox-gl/dist/mapbox-gl.css";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN; 

function ParkMapboxCreator() {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState({
    longitude: -81.379236, // Disney World area
    latitude: 28.385233,
    zoom: 12,
  });
  const [points, setPoints] = useState([]);

  const onMapClick = useCallback((event) => {
    const { lng, lat } = event.lngLat;
    setPoints((prev) => [...prev, { lng, lat }]);
  }, []);

  const finishDrawing = () => {
    if (points.length < 3) {
      toast.error("Necesitas al menos 3 puntos para formar un polígono");
      return;
    }
    navigate("/park/new", { state: { polygonPoints: points } });
  };

  const cancelDrawing = () => {
    navigate("/home");
  };

  // GeoJSON data for the polygon
  const geojson = {
    type: "Feature",
    geometry: {
      type: "Polygon",
      coordinates: [
        [...points.map((p) => [p.lng, p.lat]), points.length > 0 ? [points[0].lng, points[0].lat] : []].filter(c => c.length > 0)
      ],
    },
  };

  const layerStyle = {
    id: "park-polygon",
    type: "fill",
    paint: {
      "fill-color": "#008000",
      "fill-opacity": 0.5,
    },
  };

  const outlineStyle = {
    id: "park-outline",
    type: "line",
    paint: {
      "line-color": "#006400",
      "line-width": 2,
    },
  };

  return (
    <div className="h-screen w-full relative">
      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={MAPBOX_TOKEN}
        onClick={onMapClick}
        cursor="crosshair"
      >
        {points.map((p, i) => (
          <Marker key={i} longitude={p.lng} latitude={p.lat} color="red" />
        ))}

        {points.length >= 3 && (
          <Source id="my-data" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
            <Layer {...outlineStyle} />
          </Source>
        )}
      </Map>

      <div className="absolute top-24 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-xl shadow-2xl z-10 flex flex-col items-center gap-2">
        <p className="font-bold text-gray-800">Dibujando Parque (Mapbox)</p>
        <p className="text-sm text-gray-600">Puntos: {points.length}</p>
        <div className="flex gap-2">
          <button
            onClick={cancelDrawing}
            className="bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200"
          >
            Cancelar
          </button>
          <button
            onClick={finishDrawing}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-bold"
          >
            Terminar Dibujo
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-4 bg-white/80 p-2 rounded text-xs text-gray-500">
        Click en el mapa para agregar puntos
      </div>
    </div>
  );
}

export default ParkMapboxCreator;
