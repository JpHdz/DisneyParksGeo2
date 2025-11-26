import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function AttractionDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attraction, setAttraction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/v1/attractions/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") {
          setAttraction(data.data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching attraction:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl font-serif text-blue-900">Cargando magia...</p>
      </div>
    );

  if (!attraction)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <p className="text-xl text-red-500">Atracción no encontrada</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 pt-14">
      {/* Hero Section */}
      <div className="relative h-96 w-full bg-blue-900 overflow-hidden">
        <img
          src={
            attraction.photos && attraction.photos.length > 0
              ? `http://localhost:3000/${attraction.photos[0]}`
              : "https://images.unsplash.com/photo-1561582077-8d0706240019?q=80&w=2070&auto=format&fit=crop"
          }
          alt={attraction.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-5xl font-serif font-bold mb-4 drop-shadow-lg">
            {attraction.name}
          </h1>
          <div className="flex items-center gap-4 text-xl bg-black/30 px-6 py-2 rounded-full backdrop-blur-sm">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span className="font-bold">{attraction.rating}/10</span>
            </div>
            <span className="font-light">|</span>
            <div className="flex items-center gap-1">
              <span className="text-red-400 font-bold">{attraction.waitTime} min</span>
              <span className="text-sm opacity-80">de espera</span>
            </div>
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
            onClick={() => navigate(`/attraction/edit/${id}`)}
            className="bg-blue-500/80 hover:bg-blue-500 text-white px-4 py-2 rounded-full backdrop-blur-md transition-all font-semibold"
          >
            Editar
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="bg-white  shadow-xl p-8 -mt-20 relative z-10 text-center">
          <h2 className="text-3xl font-serif text-blue-900 mb-6 border-b-2 border-blue-200 inline-block pb-2">
            Sobre la Atracción
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-8 max-w-2xl mx-auto">
            {attraction.description}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-bold text-blue-900">Latitud</h3>
              <p className="text-sm text-gray-600">{attraction.coordinates?.lat || "N/A"}</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-bold text-blue-900">Longitud</h3>
              <p className="text-sm text-gray-600">{attraction.coordinates?.lng || "N/A"}</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="font-bold text-blue-900">Ubicación</h3>
              <p className="text-sm text-gray-600">{attraction.park?.name || "Parque Disney"}</p>
            </div>
          </div>

          {/* YouTube Video Section */}
          <div className="mt-12 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Te podria interesar</h3>
            <div className="aspect-w-16 aspect-h-9 w-full rounded-xl overflow-hidden shadow-lg">
              <iframe 
                className="w-full h-[500px]"
                src="https://www.youtube.com/embed/BTnohw6ZQsY?start=787" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttractionDetails;
