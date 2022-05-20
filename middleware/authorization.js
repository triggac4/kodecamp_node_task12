const CustomError=require('../error/customError')
const jwt = require("jsonwebtoken");
const authorize = (req, res ,next) => {
  if (!req.headers.authorization) {
    throw new CustomError("No authorization header",401);
  }
  const token = req.headers.authorization.split(" ")[1];
  try {
   // console.log("token",token);
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload;
    next();
  } catch (e) {
    throw new CustomError("Invalid token",401);
  }
};

module.exports= authorize;

