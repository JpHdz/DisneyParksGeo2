import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function RestaurantDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDeleteDish = async (dishId) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este platillo?")) {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/dishes/${dishId}`, {
          method: "DELETE",
        });
        if (res.ok) {
          toast.success("Platillo eliminado");
          setRestaurant((prev) => ({
            ...prev,
            dishes: prev.dishes.filter((d) => d._id !== dishId),
          }));
        } else {
          toast.error("Error al eliminar el platillo");
        }
      } catch (error) {
        console.error("Error deleting dish:", error);
        toast.error("Error de conexión");
      }
    }
  };

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/v1/restaurants/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setRestaurant(data.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching restaurant:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl font-serif text-blue-900">Cargando magia...</p>
      </div>
    );

  if (!restaurant)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl text-red-500">Restaurante no encontrado</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pt-14">
      {/* Hero Section */}
      <div className="relative h-96 w-full bg-blue-900 overflow-hidden">
        <img
          src={
            restaurant.photos && restaurant.photos.length > 0
              ? `${import.meta.env.VITE_API_URL}/${restaurant.photos[0]}`
              : "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop"
          }
          alt={restaurant.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl font-serif font-bold mb-4 drop-shadow-lg">
            {restaurant.name}
          </h1>
          <div className="flex items-center gap-2 text-xl bg-black/30 px-4 py-2 rounded-full backdrop-blur-sm">
            <span className="text-yellow-400">{"★".repeat(restaurant.stars)}</span>
            <span className="font-light">|</span>
            <span className="font-medium">{restaurant.category}</span>
          </div>
        </div>
        <div className="absolute top-4 left-4 flex gap-2">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all"
          >
            &larr; Volver
          </button>
          <button
            onClick={() => navigate(`/restaurant/edit/${id}`)}
            className="bg-yellow-500/80 hover:bg-yellow-500 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all font-semibold"
          >
             Editar
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-3xl shadow-xl p-8 -mt-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-serif text-blue-900 mb-6 border-b-2 border-yellow-400 inline-block pb-2">
                Experiencia Culinaria
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-8">
                {restaurant.description}
              </p>
              
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-bold text-blue-900 mb-2">Ubicación</h3>
                <p className="text-gray-700">{restaurant.park?.name || "Parque Disney"}</p>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-serif text-blue-900 mb-6 border-b-2 border-yellow-400 inline-block pb-2">
                Menú Destacado
              </h2>
              {restaurant.dishes && restaurant.dishes.length > 0 ? (
                <div className="space-y-6">
                  {restaurant.dishes.map((dish) => (
                    <div key={dish._id} className="flex gap-4 items-start group">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                         <img 
                           src="https://www.travelandleisure.com/thmb/LYBTSZAQOp6MI_wIO2XzNv1oLRw=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/mickey-premium-bar-disney-world_DISNEYFOOD1122-1ff3c60ee8854e159e822be22d26705c.jpg" 
                           alt="Dish" 
                           className="w-full h-full object-cover"
                         />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-gray-800 text-lg group-hover:text-blue-600 transition-colors">
                            {dish.name}
                          </h4>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => navigate(`/dish/edit/${dish._id}`)}
                              className="text-blue-500 hover:text-blue-700"
                              title="Editar"
                            >
                              ✎
                            </button>
                            <button
                              onClick={() => handleDeleteDish(dish._id)}
                              className="text-red-500 hover:text-red-700"
                              title="Eliminar"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm">{dish.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Menú no disponible por el momento.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantDetails;
