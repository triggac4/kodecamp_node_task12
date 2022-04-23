require("dotenv").config();
require("express-async-errors");
const express = require("express");
const connect = require("./database/database");
const invalidRoute = require("./middleware/invalidRoute");
const errorHandler = require("./middleware/errorHandler");
const router=require('./router/product')
const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  res.send("Hello World");
});


app.use('/api/v1/product',router)
app.use([invalidRoute, errorHandler]);



const PORT = process.env.PORT ?? 3000;
const start = async () => {
  try {
    await connect(process.env.MONGO_URL);
    app.listen(PORT, () => {
      console.log(`Server started at port ${PORT}...`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();
