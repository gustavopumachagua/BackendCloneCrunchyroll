const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  toggleFavorite,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// Rutas
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile); // Ruta para obtener el perfil
router.put("/profile", protect, updateProfile); // Ruta para actualizar el perfil
router.post("/favorites/toggle", protect, toggleFavorite);

module.exports = router;
