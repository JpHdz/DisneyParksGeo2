const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const globalErrorHandler = require("./services/errorService");
const AppError = require("./utils/appError");
const userRouter = require("./routes/userRoutes");
const dishRouter = require("./routes/dishRoutes");
const restaurantRouter = require("./routes/restaurantRoutes");
const attractionRouter = require("./routes/attractionRoutes");
const parkRouter = require("./routes/parkRoutes");
const photoRouter = require("./routes/photoRoutes");

const allowedOrigin = "http://localhost:5173";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
  })
);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/dishes", dishRouter);
app.use("/api/v1/restaurants", restaurantRouter);
app.use("/api/v1/attractions", attractionRouter);
app.use("/api/v1/parks", parkRouter);
app.use("/api/v1", photoRouter);
// app.use("/api/users");
// app.use("/api/attractions");
// app.use("/api/restaurants");

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
