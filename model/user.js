const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Joi = require("joi");
const JWT = require("jsonwebtoken");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      maxlength: 1024,
      minlength:6
    },
    refreshToken:{
        type:String,
        default:""
    }
  },
  { timestamps: true }
);


userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function (
  {firstName,
  lastName,
  email,_id},secret,expiresIn
) {
  const token = JWT.sign(
    { firstName, lastName, email, _id },
    secret,
    { expiresIn: expiresIn }
  );
  return token;
};
module.exports = mongoose.model("User", userSchema);
