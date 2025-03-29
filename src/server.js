const { default: mongoose } = require("./database/mongodb");
const express = require("express");
const cors = require("cors");
require("./users/userCron"); //cron mecanicien
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
const mailRoutes = require("./mail/mailerRoutes");
const appointmentRoutes = require("./appointment/appointmentRoutes");
const interventionRoutes = require("./intervention/interventionRoutes");
const mechanicRoutes = require("./mechanic/mechanicRoutes");


//middleware
app
  .use(cors())
  .use(express.json())
  .use("/users", userRoutes)
  .use("/brands", vehicleBrandRoutes)
  .use("/models", vehicleModelRoutes)
  .use("/services", serviceRoutes)
  .use("/vehicles", vehicleRoutes)
  .use("/products", productRoutes)
  .use("/mail", mailRoutes)
  .use("/appointments", appointmentRoutes)
  .use("/interventions", interventionRoutes)
  .use("/mechanics",mechanicRoutes);

//connection to database
mongoose;

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
