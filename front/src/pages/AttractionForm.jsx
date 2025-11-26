import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

function AttractionForm() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [parks, setParks] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rating: 1,
    waitTime: 0,
    thrillLevel: "Moderada",
    minHeight: "Sin restricción",
    coordinates: { 
      lat: parseFloat(searchParams.get("lat")) || 0, 
      lng: parseFloat(searchParams.get("lng")) || 0 
    },
    park: "",
  });

  useEffect(() => {
    // Fetch parks
    fetch("http://localhost:3000/api/v1/parks")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setParks(data.data.data);
        }
      });

    if (id) {
      fetch(`http://localhost:3000/api/v1/attractions/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            const { name, description, rating, waitTime, coordinates, park } =
              data.data.data;
            setFormData({ 
              name, 
              description, 
              rating, 
              waitTime,
              thrillLevel: data.data.data.thrillLevel || "Moderada",
              minHeight: data.data.data.minHeight || "Sin restricción",
              coordinates,
              park: park?._id || park 
            });
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching attraction:", err);
          toast.error("Error al cargar la atracción");
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "lat" || name === "lng") {
      setFormData((prev) => ({
        ...prev,
        coordinates: { ...prev.coordinates, [name]: parseFloat(value) },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const [photo, setPhoto] = useState(null);

  // ... (existing useEffects) ...

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEdit = !!id;
    const url = isEdit 
      ? `http://localhost:3000/api/v1/attractions/${id}`
      : "http://localhost:3000/api/v1/attractions";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (data.status === "success") {
        const attractionId = data.data.data._id || id;
        
        // Upload photo if selected
        if (photo) {
          const photoFormData = new FormData();
          photoFormData.append("photos", photo);
          
          const resPhoto = await fetch(`http://localhost:3000/api/v1/attractions/${attractionId}/photos`, {
            method: "POST",
            body: photoFormData,
          });
          
          if (!resPhoto.ok) {
            toast.error("Atracción guardada, pero error al subir foto");
          }
        }

        toast.success(`Atracción ${isEdit ? "actualizada" : "creada"} correctamente`);
        navigate(-1);
      } else {
        toast.error("Error al guardar");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    }
  };

  const handleDelete = async () => {
    if (!id) return; // Cannot delete if creating
    if (window.confirm("¿Estás seguro de que quieres eliminar esta atracción?")) {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/attractions/${id}`, {
          method: "DELETE",
        });
        if (res.status === 204) {
          toast.success("Atracción eliminada");
          navigate("/home");
        } else {
          toast.error("Error al eliminar");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error de conexión");
      }
    }
  };

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? "Editar Atracción" : "Agregar Nueva Atracción"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Foto (Opcional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-purple-50 file:text-purple-700
                hover:file:bg-purple-100"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Parque
            </label>
            <select
              name="park"
              value={formData.park}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
            >
              <option value="">Selecciona un parque</option>
              {parks.map((park) => (
                <option key={park._id} value={park._id}>
                  {park.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rating (1-10)
              </label>
              <input
                type="number"
                name="rating"
                min="1"
                max="10"
                value={formData.rating}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tiempo de Espera (min)
              </label>
              <input
                type="number"
                name="waitTime"
                min="0"
                value={formData.waitTime}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              />
            </div>
          </div>



          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Latitud
              </label>
              <input
                type="number"
                name="lat"
                step="any"
                value={formData.coordinates.lat}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Longitud
              </label>
              <input
                type="number"
                name="lng"
                step="any"
                value={formData.coordinates.lng}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm border p-2"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            {id && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Eliminar
              </button>
            )}
            <div className={`flex gap-2 ${!id ? "w-full justify-end" : ""}`}>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {id ? "Guardar Cambios" : "Crear Atracción"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AttractionForm;
