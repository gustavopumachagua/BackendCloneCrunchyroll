const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "El email es obligatorio"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "La contraseña es obligatoria"],
    },
    name: {
      type: String,
      required: true, // El nombre será obligatorio
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150", // Imagen predeterminada
    },
    backgroundImage: {
      type: String,
      default: "https://via.placeholder.com/600",
    },
    favorites: [
      {
        animeId: { type: String, unique: true }, // Evitar duplicados en la base de datos
        title: String,
        image: String,
        subtitle: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
