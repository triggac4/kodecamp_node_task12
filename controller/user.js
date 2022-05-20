const userModel = require("../model/user");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const CustomError = require("../error/customError");

function validateEntry(data) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  const result = schema.validate(data);
  return result;
}

const passwordHashFunction = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    return hashed;
  } catch (err) {
    console.log(err);
  }
};

const signIn = async (req, res) => {
  const user = req.body;
  const result = await userModel.findOne({ email: user.email });
  if (!result) {
    throw new CustomError("Invalid email or password");
  }
  console.log(user.password);
  const validatePassword = await result.validatePassword(user.password);
  if (!validatePassword) {
    console.log(validatePassword);
    throw new CustomError("Invalid email or password validation not working",404);
  }
  const refreshToken = await result.generateToken(
    result,
    process.env.JWT_REFRESH_SECRET,
    "1d"
  );
  const accessToken = await result.generateToken(
    result,
    process.env.JWT_ACCESS_SECRET,
    "0.25h"
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
  });

  result.refreshToken = refreshToken;
  await result.save();

  res.status(201).json({ success: true, data: { accessToken, user: result } });
};

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);
  const entries = validateEntry({ firstName, lastName, email, password });
  if (entries.CustomError) {
    throw new CustomError(entries.CustomError.details[0].message,401);
  }
  const hashed = await passwordHashFunction(password);
  const result = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashed,
  });
  const refreshToken = await result.generateToken(
    result,
    process.env.JWT_REFRESH_SECRET,
    "1d"
  );
  const accessToken = await result.generateToken(
    result,
    process.env.JWT_ACCESS_SECRET,
    "0.25h"
  );
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24,
    secure: true,
  });

  result.refreshToken = refreshToken;
  await result.save();

  res.status(201).json({ success: true, data: { accessToken, user: result } });
};

const getAllUsers = async (req, res) => {
  const users = await userModel.find({});
  res.status(200).json({ success: true, data: users });
};

const getUserById = async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    throw new CustomError("User not found",404);
  }
  res.status(200).json({ success: true, data: user });
};

const updateUser = async (req, res) => {
  const { firstName, lastName } = req.body;
  if (firstName && lastName) {
    const user = await userModel.findByIdAndUpdate(req.params.id, {
      firstName,
      lastName,
    });
    if (!user) {
      throw new CustomError("something went wrong",400);
    }
    res.status(200).json({ success: true, data: user });
  } else {
    throw new CustomError("Invalid data",400);
  }
};

const deleteUser = async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new CustomError("User not found",404);
  }
  res.status(200).json({ success: true, data: user });
};

const refreshAccessToken=async(req,res)=>{
  const refreshToken=req.cookies.refreshToken;
  if(!refreshToken){
    throw new CustomError("No refresh token",404);
  }
  const user=await userModel.findOne({refreshToken});
  if(!user){
    throw new CustomError("Invalid refresh token",401);
  }
  
  const payload=jwt.verify(refreshToken,process.env.JWT_REFRESH_SECRET);
  if(payload._id!=user._id){
    throw new CustomError("Invalid refresh token",401);
  }

  const accessToken=await user.generateToken(user,process.env.JWT_ACCESS_SECRET,"0.25h");
  res.status(200).json({success:true,data:{accessToken,user}});
  
}

module.exports = {
  signIn,
  signUp,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  refreshAccessToken,
};
