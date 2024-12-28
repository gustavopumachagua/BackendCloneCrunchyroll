const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.use(errorHandler);

module.exports = app;
