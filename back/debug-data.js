const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Park = require("./models/parkModel");
const Restaurant = require("./models/restaurantModel");
const Dish = require("./models/dishModel");

dotenv.config({ path: "./.env" });

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB).then(() => console.log("DB connection successful!"));

const fs = require('fs');
const log = (msg) => fs.appendFileSync('debug-output.txt', msg + '\n');

const debugData = async () => {
  try {
    fs.writeFileSync('debug-output.txt', ''); // Clear file
    const parks = await Park.find();
    log(`Found ${parks.length} parks.`);
    
    for (const park of parks) {
      log(`Park: ${park.name} (${park._id})`);
      const restaurants = await Restaurant.find({ park: park._id });
      log(`  Restaurants: ${restaurants.length}`);
      restaurants.forEach(r => log(`    - ${r.name} (Park ID in Restaurant: ${r.park})`));
    }

  } catch (err) {
    log(err.toString());
  }
  process.exit();
};

debugData();
