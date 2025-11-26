const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});

const port = process.env.APP_PORT || 3000;

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DB_PASSWORD
);

mongoose.connect(DB).then(() => {
  console.log("Connection succesful!");
});

const server = app.listen(port, (req, res) => {
  console.log(`App listening on port ${port}`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION. Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
