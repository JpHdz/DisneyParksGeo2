import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function ModalInfo({
  parks,
  selectedPark,
  details,
  loading,
  onParkSelect,
  onBack,
  onItemClick,
}) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSearchQuery("");
  }, [selectedPark]);

  const filteredParks = parks.filter((park) =>
    park.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRestaurants = details?.restaurants?.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  const filteredAttractions = details?.attractions?.filter((attraction) =>
    attraction.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="absolute top-0 pt-20 left-0 h-full w-1/3 bg-white shadow-lg  overflow-y-auto p-4">
      {!selectedPark ? (
        <>
          <h2 className="text-2xl font-bold mb-4 text-gray-800">Parques</h2>
          <input
            type="text"
            placeholder="Buscar parques..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 mb-4 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="space-y-4">
            {filteredParks.map((park) => (
              <div
                key={park._id}
                onClick={() => onParkSelect(park)}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <h3 className="text-xl font-semibold text-gray-700">{park.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                  {park.description}
                </p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div>
          <button
            onClick={onBack}
            className="mb-4 text-blue-500 hover:text-blue-700 font-medium flex items-center"
          >
            &larr; Volver a la lista
          </button>

          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            {selectedPark.name}
          </h2>
          <p className="text-gray-600 mb-6">{selectedPark.description}</p>

          {loading ? (
            <div className="text-center py-4">Cargando detalles...</div>
          ) : (
            <>
              <input
                type="text"
                placeholder="Buscar atracciones o restaurantes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-2 mb-6 border rounded border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                  Restaurantes
                </h3>
                {filteredRestaurants.length > 0 ? (
                  <div className="space-y-3">
                    {filteredRestaurants.map((restaurant) => (
                      <div
                        key={restaurant._id}
                        className="bg-gray-50 p-3 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div 
                          className="cursor-pointer"
                          onClick={() => onItemClick(restaurant.coordinates)}
                        >
                          <h4 className="font-semibold text-gray-700">
                            {restaurant.name}
                          </h4>
                          <div className="flex items-center text-yellow-500 text-sm mb-1">
                            {"★".repeat(restaurant.stars)}
                            <span className="text-gray-400 ml-1">
                              ({restaurant.category})
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {restaurant.description}
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/restaurant/${restaurant._id}`);
                          }}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          Ver más detalles
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No hay restaurantes registrados.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">
                  Atracciones
                </h3>
                {filteredAttractions.length > 0 ? (
                  <div className="space-y-3">
                    {filteredAttractions.map((attraction) => (
                      <div
                        key={attraction._id}
                        className="bg-gray-50 p-3 rounded hover:bg-gray-100 transition-colors"
                      >
                        <div 
                          className="cursor-pointer"
                          onClick={() => onItemClick(attraction.coordinates)}
                        >
                          <div className="flex justify-between items-start">
                            <h4 className="font-semibold text-gray-700">
                              {attraction.name}
                            </h4>
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Rating: {attraction.rating}/10
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {attraction.description}
                          </p>
                          <p className="text-xs text-red-500 mt-1 font-semibold mb-2">
                            Espera: {attraction.waitTime} min
                          </p>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/attraction/${attraction._id}`);
                          }}
                          className="text-xs bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors"
                        >
                          Ver más detalles
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No hay atracciones registradas.
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ModalInfo;
