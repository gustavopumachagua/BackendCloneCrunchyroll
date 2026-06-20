const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  toggleFavorite,
  addToHistory,
  removeFromHistory,
  clearHistory,
  verifyEmail,
  resetPassword,
  getProfiles,
  addProfile,
  deleteProfile,
  getCrunchylists,
  saveCrunchylist,
  deleteCrunchylist,
} = require("../controllers/userController");
const { protect } = require("../middlewares/authMiddleware");

// Rutas
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.post("/favorites/toggle", protect, toggleFavorite);
router.post("/history", protect, addToHistory);
router.delete("/history/:id", protect, removeFromHistory);
router.delete("/history", protect, clearHistory);
router.post("/reset-password/email", verifyEmail);
router.put("/reset-password", resetPassword);
router.post("/profiles", protect, addProfile);
router.get("/profiles", protect, getProfiles);
router.delete("/profiles/:id", protect, deleteProfile);
router.get("/crunchylists", protect, getCrunchylists);
router.post("/crunchylists", protect, saveCrunchylist);
router.delete("/crunchylists/:id", protect, deleteCrunchylist);

module.exports = router;
