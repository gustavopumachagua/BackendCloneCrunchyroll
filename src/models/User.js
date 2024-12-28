const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
  animeId: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  subtitle: { type: String },
});

const historyItemSchema = mongoose.Schema({
  mal_id: { type: String, required: true },
  title: { type: String, required: true },
  aired: { type: String },
  score: { type: String },
  animeImage: { type: String },
  episodeNumber: { type: Number },
  addedDate: { type: Date, default: Date.now },
});
const profileSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: "https://via.placeholder.com/100" },
});
const CrunchylistSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  content: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now },
});

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
      required: true,
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    backgroundImage: {
      type: String,
      default: "https://via.placeholder.com/600",
    },
    favorites: {
      type: [favoriteSchema],
      default: [],
    },
    history: {
      type: [historyItemSchema],
      default: [],
    },
    profiles: [profileSchema],
    crunchylists: [CrunchylistSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
