const { default: mongoose } = require("./database/mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

//routes
const userRoutes = require("./users/userRoutes");

//middleware
app.use(cors()).use(express.json()).use("/users", userRoutes);

//connection to database
mongoose;

app.listen(PORT, () => console.log(`Server started on localhost:${PORT}`));
