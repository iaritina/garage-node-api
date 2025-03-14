const { default: mongoose } = require("./database/mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

//routes
const userRoutes = require("./users/userRoutes");
const vehicleBrandRoutes = require("./vehiculeBrands/brandRoutes");
const vehicleModelRoutes = require("./vehicleModels/modelRoutes");
const serviceRoutes = require("./service/serviceRoutes");
const vehicleRoutes = require("./vehicle/vehicle-routes");
const productRoutes = require("./product/productRoutes");

//middleware
app
  .use(cors())
  .use(express.json())
  .use("/users", userRoutes)
  .use("/brands", vehicleBrandRoutes)
  .use("/models", vehicleModelRoutes)
  .use("/services", serviceRoutes)
  .use("/vehicles",vehicleRoutes)
  .use("/products",productRoutes)

//connection to database
mongoose;

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
