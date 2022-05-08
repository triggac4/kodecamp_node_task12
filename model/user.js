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
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.password) {
      const salt = await bcrypt.genSalt(10);
      this.password =await bcrypt.hash(this.password, salt);
      next();
    }
    else{
        throw new Error("Password is required");
    }
  } catch (err) {
    next(err);
  }
});

userSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = async function (
  {firstName,
  lastName,
  email,_id}
) {
  const token = JWT.sign(
    { firstName, lastName, email, _id },
    process.env.JWT_SECRET,
    { expiresIn: "30d" }
  );
  return token;
};
module.exports = mongoose.model("User", userSchema);
