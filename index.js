require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");

const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Error: La variable de entorno MONGO_URI no está definida.");
  process.exit(1);
}

(async () => {
  try {
    await connectDB();
    console.log("Conectado a la base de datos exitosamente");

    app.listen(PORT, () => {
      console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al conectar a la base de datos:", error);
    process.exit(1);
  }
})();

process.on("unhandledRejection", (err) => {
  console.error("Error no controlado:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Excepción no capturada:", err);
  process.exit(1);
});
