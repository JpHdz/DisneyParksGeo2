const express = require("express");
const authService = require("../services/authService");
const userService = require("../services/userService");
const usersRouter = express.Router();

usersRouter.post("/signup", authService.signup);
usersRouter.post("/login", authService.login);
usersRouter.get("/logout", authService.logout);

usersRouter.use(authService.protect);

usersRouter.get("/me", userService.getMe, userService.getUser);

usersRouter
  .route("/")
  .get(userService.getAllUsers)
  .post(userService.createUser);
usersRouter
  .route("/:id")
  .get(userService.getUser)
  .patch(userService.updateUser)
  .delete(userService.deleteUser);

module.exports = usersRouter;
