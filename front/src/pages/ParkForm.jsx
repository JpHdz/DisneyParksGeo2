import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

function ParkForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  // Polygon points passed from Home.jsx
  const polygonPoints = location.state?.polygonPoints || [];

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    if (!polygonPoints || polygonPoints.length < 3) {
      toast.error("Debes dibujar un polígono válido en el mapa primero");
      navigate("/home");
    }
  }, [polygonPoints, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Format coordinates for GeoJSON Polygon: [[[lng, lat], [lng, lat], ...]]
    const coordinates = polygonPoints.map(p => [p.lng, p.lat]);
    if (coordinates.length > 0) {
      coordinates.push(coordinates[0]); 
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      polygon: {
        type: "Polygon",
        coordinates: [coordinates],
      },
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/parks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.status === "success") {
        toast.success("Parque creado correctamente");
        navigate("/home");
      } else {
        toast.error(data.message || "Error al crear el parque");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Agregar Nuevo Parque
        </h2>
        
        <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-800">
            <strong>Polígono definido:</strong> {polygonPoints.length} puntos capturados.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Parque
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Descripción
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm border p-2"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => navigate("/home")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Crear Parque"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ParkForm;
