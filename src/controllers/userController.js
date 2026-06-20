const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, llena todos los campos" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password: hashedPassword,
      name: email.split("@")[0],
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
        favorites: user.favorites,
        history: user.history,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Por favor, llena todos los campos" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "El usuario no existe" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
        favorites: user.favorites,
        history: user.history,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({
      id: user._id,
      name: user.name || "Usuario",
      email: user.email,
      avatar: user.avatar || "https://via.placeholder.com/150",
      favorites: user.favorites || [],
      history: user.history || [],
      backgroundImage:
        user.backgroundImage || "https://via.placeholder.com/600",
      favorites: user.favorites,
      history: user.history,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfil", error: error.message });
  }
};

const saveUserActivity = async (req, res) => {
  const { type, data } = req.body;

  try {
    const user = req.user;

    if (type === "favorite") {
      user.favorites.push(data);
    } else if (type === "history") {
      user.history.push(data);
    } else {
      return res.status(400).json({ message: "Tipo de actividad no válido" });
    }

    await user.save();

    res.json({
      message: `Actividad guardada exitosamente: ${type}`,
      user: { favorites: user.favorites, history: user.history },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al guardar actividad", error: error.message });
  }
};
const updateProfile = async (req, res) => {
  const { name, avatar, backgroundImage, email, password } = req.body;

  try {
    const user = req.user;

    if (name) user.name = name;

    if (avatar) {
      if (!avatar.startsWith("data:image/")) {
        return res
          .status(400)
          .json({ message: "Formato de imagen no válido para el avatar." });
      }
      user.avatar = avatar;
    }

    if (backgroundImage) {
      if (!backgroundImage.startsWith("data:image/")) {
        return res.status(400).json({
          message: "Formato de imagen no válido para la imagen de fondo.",
        });
      }
      user.backgroundImage = backgroundImage;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "Correo electrónico no válido." });
      }
      user.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "La contraseña debe tener al menos 6 caracteres." });
      }
      const bcrypt = require("bcrypt");
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      message: "Perfil actualizado exitosamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
        favorites: user.favorites,
        history: user.history,
      },
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    res.status(500).json({ message: "Error al actualizar perfil", error });
  }
};
const toggleFavorite = async (req, res) => {
  const { animeId, title, image, subtitle } = req.body;

  try {
    const user = await User.findById(req.user.id);

    const favoriteIndex = user.favorites.findIndex(
      (fav) => fav.animeId === animeId
    );

    if (favoriteIndex === -1) {
      user.favorites.push({ animeId, title, image, subtitle });
      message = "Anime añadido a favoritos";
    } else {
      user.favorites.splice(favoriteIndex, 1);
      message = "Anime eliminado de favoritos";
    }

    await user.save();

    res.json({
      message,
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la lista de favoritos",
      error: error.message,
    });
  }
};

const addToHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const newHistoryItem = req.body;

    const exists = user.history.some(
      (item) => item.mal_id === newHistoryItem.mal_id
    );
    if (exists) {
      return res
        .status(400)
        .json({ message: "El elemento ya está en el historial" });
    }

    user.history.push(newHistoryItem);
    await user.save();

    res.json({
      message: "Elemento añadido al historial",
      history: user.history,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al añadir al historial",
      error: error.message,
    });
  }
};

const removeFromHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.history = user.history.filter((item) => item.mal_id !== req.params.id);
    await user.save();

    res.json({
      message: "Elemento eliminado del historial",
      history: user.history,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar del historial",
      error: error.message,
    });
  }
};

const clearHistory = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.history = [];
    await user.save();

    res.json({ message: "Historial limpiado", history: user.history });
  } catch (error) {
    res.status(500).json({ message: "Error al limpiar el historial", error });
  }
};

const verifyEmail = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json({ message: "Por favor, proporciona un correo válido." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Correo no encontrado." });
    }

    res.json({ message: "Correo verificado con éxito.", email });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al verificar el correo.", error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      message: "Contraseña actualizada exitosamente.",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
        favorites: user.favorites,
        history: user.history,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar la contraseña.",
      error: error.message,
    });
  }
};
const addProfile = async (req, res) => {
  const { name, avatar } = req.body;

  try {
    const user = await User.findById(req.user.id);

    const newProfile = {
      id: user.profiles.length + 1,
      name,
      avatar: avatar || "https://via.placeholder.com/100",
    };

    user.profiles.push(newProfile);
    await user.save();

    res.json({
      message: "Perfil añadido exitosamente",
      profiles: user.profiles,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al añadir el perfil",
      error: error.message,
    });
  }
};
const getProfiles = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ profiles: user.profiles });
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener perfiles",
      error: error.message,
    });
  }
};
const deleteProfile = async (req, res) => {
  const profileId = req.params.id;

  try {
    const user = await User.findById(req.user.id);

    const profileIndex = user.profiles.findIndex(
      (profile) => profile.id === profileId
    );
    if (profileIndex === -1) {
      return res.status(404).json({ message: "Perfil no encontrado" });
    }

    user.profiles.splice(profileIndex, 1);
    await user.save();

    res.json({
      message: "Perfil eliminado exitosamente",
      profiles: user.profiles,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al eliminar el perfil", error: error.message });
  }
};

const getCrunchylists = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json(user.crunchylists);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener las Crunchylists." });
  }
};

const saveCrunchylist = async (req, res) => {
  const { id, name, content, createdAt } = req.body;

  try {
    const user = await User.findById(req.user.id);
    const listIndex = user.crunchylists.findIndex((list) => list.id === id);

    if (listIndex !== -1) {
      user.crunchylists[listIndex] = { id, name, content, createdAt };
    } else {
      user.crunchylists.push({ id, name, content, createdAt });
    }

    await user.save();
    res.status(200).json({ message: "Crunchylist guardada exitosamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al guardar la Crunchylist." });
  }
};

const deleteCrunchylist = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(req.user.id);
    user.crunchylists = user.crunchylists.filter((list) => list.id !== id);
    await user.save();
    res.status(200).json({ message: "Crunchylist eliminada exitosamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la Crunchylist." });
  }
};

module.exports = {
  updateProfile,
  registerUser,
  loginUser,
  getProfile,
  saveUserActivity,
  toggleFavorite,
  addToHistory,
  removeFromHistory,
  clearHistory,
  resetPassword,
  verifyEmail,
  addProfile,
  getProfiles,
  deleteProfile,
  getCrunchylists,
  saveCrunchylist,
  deleteCrunchylist,
};
