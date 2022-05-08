const userModel = require("../model/user");
const Joi =require("joi")

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

const signIn = async (req, res) => {
  const user = req.body;
  const result = await userModel.findOne({ email: user.email });
  if (!result) {
    throw new Error("Invalid email or password");
  }
  const validatePassword = await result.validatePassword(user.password);
  if (!validatePassword) {
    throw new Error("Invalid email or password");
  }
  const token = await result.generateToken(result);
  res.status(201).json({ success: true, data: { token, user } });
};

const signUp = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const entries = validateEntry({ firstName, lastName, email, password });
  if(entries.error){
    throw new Error(entries.error.details[0].message);
  }
  const result = await userModel.create({
    firstName,
    lastName,
    email,
    password,
  });
  console.log(result)
  const token = await result.generateToken(result);
  res.status(201).json({ success: true, data: { token, result } });
};

const getAllUsers = async (req, res) => {
  const users = await userModel.find({});
  res.status(200).json({ success: true, data: users });
};

const getUserById = async (req, res) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    throw new Error("User not found");
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
      throw new Error("something went wrong");
    }
    res.status(200).json({ success: true, data: user });
  } else {
    throw new Error("Invalid data");
  }
};

const deleteUser = async (req, res) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    throw new Error("User not found");
  }
  res.status(200).json({ success: true, data: user });
};

module.exports = {
  signIn,
  signUp,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
