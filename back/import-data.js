const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Park = require("./models/parkModel");
const Attraction = require("./models/attractionModel");
const Restaurant = require("./models/restaurantModel");
const Dish = require("./models/dishModel");

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const importData = async () => {
  try {
    // 1. Create Parks
    const magicKingdom = await Park.create({
      name: "Magic Kingdom",
      description:
        "El parque temático original de Walt Disney World Resort, donde los cuentos de hadas se hacen realidad.",
      polygon: {
        type: "Polygon",
        coordinates: [
          [
            [-81.5812, 28.4195],
            [-81.579, 28.4195],
            [-81.579, 28.4175],
            [-81.5812, 28.4175],
            [-81.5812, 28.4195],
          ],
        ],
      },
    });

    const epcot = await Park.create({
      name: "EPCOT",
      description:
        "Celebra los logros humanos y la cultura internacional con tecnología innovadora.",
      polygon: {
        type: "Polygon",
        coordinates: [
          [
            [-81.551, 28.376],
            [-81.549, 28.376],
            [-81.549, 28.374],
            [-81.551, 28.374],
            [-81.551, 28.376],
          ],
        ],
      },
    });

    console.log("Parks loaded!");

    // 2. Create Attractions
    await Attraction.create([
      {
        name: "Space Mountain",
        rating: 9,
        description: "Una montaña rusa en la oscuridad a través del espacio.",
        waitTime: 45,
        coordinates: { lat: 28.419, lng: -81.577 },
        park: magicKingdom._id,
      },
      {
        name: "Haunted Mansion",
        rating: 10,
        description: "Un recorrido espeluznante por una mansión embrujada.",
        waitTime: 30,
        coordinates: { lat: 28.42, lng: -81.582 },
        park: magicKingdom._id,
      },
      {
        name: "Spaceship Earth",
        rating: 8,
        description: "Un viaje a través de la historia de la comunicación.",
        waitTime: 15,
        coordinates: { lat: 28.375, lng: -81.549 },
        park: epcot._id,
      },
      {
        name: "Test Track",
        rating: 9,
        description: "Diseña un vehículo virtual y ponlo a prueba.",
        waitTime: 60,
        coordinates: { lat: 28.372, lng: -81.545 },
        park: epcot._id,
      },
    ]);

    console.log("Attractions loaded!");

    // 3. Create Dishes
    const dishes = await Dish.create([
      {
        name: "The Grey Stuff",
        description: "Es delicioso, ¡no creas lo que te digo, pregúntale a los platos!",
      },
      {
        name: "Galactic Burger",
        description: "Hamburguesa con queso espacial y papas fritas de otro mundo.",
      },
      {
        name: "Cheddar Cheese Soup",
        description: "Famosa sopa de queso cheddar canadiense con tocino.",
      },
      {
        name: "Filet Mignon",
        description: "Tierno filete de res con salsa de champiñones.",
      },
    ]);

    console.log("Dishes loaded!");

    // 4. Create Restaurants
    await Restaurant.create([
      {
        name: "Be Our Guest Restaurant",
        description: "Cena dentro del castillo de la Bestia.",
        stars: 5,
        category: "Fine Dining",
        coordinates: { lat: 28.421, lng: -81.58 },
        park: magicKingdom._id,
        dishes: [dishes[0]._id, dishes[3]._id],
      },
      {
        name: "Cosmic Ray's Starlight Café",
        description: "Comida rápida con entretenimiento alienígena.",
        stars: 3,
        category: "Quick Service",
        coordinates: { lat: 28.418, lng: -81.579 },
        park: magicKingdom._id,
        dishes: [dishes[1]._id],
      },
      {
        name: "Le Cellier Steakhouse",
        description: "Asador canadiense en el pabellón de Canadá.",
        stars: 5,
        category: "Fine Dining",
        coordinates: { lat: 28.369, lng: -81.552 },
        park: epcot._id,
        dishes: [dishes[2]._id, dishes[3]._id],
      },
    ]);

    console.log("Restaurants loaded!");
    console.log("Data successfully loaded!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Park.deleteMany();
    await Attraction.deleteMany();
    await Restaurant.deleteMany();
    await Dish.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
