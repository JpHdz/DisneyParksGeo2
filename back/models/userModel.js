const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

// name, email, photo, password, passwordConfirm

const userShcema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A user must have a name"],
  },
  email: {
    type: String,
    required: [true, "A user must have a mail"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, "The String must be a valid Email"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "A password must have more or equal than 8 characters"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    validate: {
      // This only works on CREATE AND SAVE!!!
      validator: function (el) {
        return el === this.password;
      },
      message: "Passwords are not the same",
    },
  },
});

userShcema.pre("save", async function () {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return;
  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete password confirm field
  this.passwordConfirm = undefined;
});

userShcema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model("User", userShcema);
module.exports = User;
