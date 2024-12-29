const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const { errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: "https://clonecrunchyroll.vercel.app", // URL del frontend
  methods: ["GET", "POST", "PUT", "DELETE"], // Métodos permitidos
  credentials: true, // Habilitar cookies si es necesario
};
app.use(cors(corsOptions));

// Middleware para parsear JSON y datos codificados en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para registrar solicitudes (opcional)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Rutas
app.use("/api/users", userRoutes);

// Manejo de rutas no definidas
app.use((req, res, next) => {
  res.status(404).json({ message: "Ruta no encontrada" });
});

// Middleware de manejo de errores
app.use(errorHandler);

module.exports = app;
