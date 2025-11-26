import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

function DishForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [restaurants, setRestaurants] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    restaurantId: "",
  });

  useEffect(() => {
    // Fetch restaurants to populate dropdown (only needed for creation)
    if (!id) {
      fetch("http://localhost:3000/api/v1/restaurants")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setRestaurants(data.data.data);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching restaurants:", err);
          toast.error("Error al cargar restaurantes");
          setLoading(false);
        });
    }

    // Fetch dish data if editing
    if (id) {
      fetch(`http://localhost:3000/api/v1/dishes/${id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            const { name, description } = data.data.data;
            setFormData({ name, description, restaurantId: "" }); // restaurantId not needed for edit
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching dish:", err);
          toast.error("Error al cargar el platillo");
          setLoading(false);
        });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!id && !formData.restaurantId) {
      toast.error("Debes seleccionar un restaurante");
      return;
    }

    const url = id 
      ? `http://localhost:3000/api/v1/dishes/${id}`
      : "http://localhost:3000/api/v1/dishes";
    const method = id ? "PATCH" : "POST";

    try {
      // 1. Create/Update Dish
      const resDish = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
        }),
      });
      const dataDish = await resDish.json();

      if (dataDish.status === "success") {
        if (!id) {
          // If creating, link to restaurant
          const newDishId = dataDish.data.data._id;
          const resRest = await fetch(`http://localhost:3000/api/v1/restaurants/${formData.restaurantId}`);
          const dataRest = await resRest.json();
          const currentDishes = dataRest.data.data.dishes.map(d => d._id);
          const updatedDishes = [...currentDishes, newDishId];

          const resUpdate = await fetch(`http://localhost:3000/api/v1/restaurants/${formData.restaurantId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ dishes: updatedDishes }),
          });

          if (resUpdate.ok) {
            toast.success("Platillo creado y agregado al restaurante");
            navigate(`/restaurant/${formData.restaurantId}`);
          } else {
            toast.error("Platillo creado pero error al vincular con restaurante");
          }
        } else {
          toast.success("Platillo actualizado correctamente");
          navigate(-1);
        }
      } else {
        toast.error("Error al guardar el platillo");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error de conexión");
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm("¿Estás seguro de que quieres eliminar este platillo?")) {
      try {
        const res = await fetch(`http://localhost:3000/api/v1/dishes/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success("Platillo eliminado");
          navigate(-1);
        } else {
          toast.error("Error al eliminar");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error de conexión");
      }
    }
  };

  if (loading) return <div className="text-center pt-20">Cargando...</div>;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {id ? "Editar Platillo" : "Agregar Nuevo Platillo"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!id && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Restaurante
              </label>
              <select
                name="restaurantId"
                value={formData.restaurantId}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
              >
                <option value="">Selecciona un restaurante</option>
                {restaurants.map((rest) => (
                  <option key={rest._id} value={rest._id}>
                    {rest.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nombre del Platillo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
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
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
            />
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
                {id ? "Guardar Cambios" : "Crear Platillo"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default DishForm;
