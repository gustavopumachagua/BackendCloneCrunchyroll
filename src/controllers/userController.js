const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Función para registrar usuario
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

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      email,
      password: hashedPassword,
      name: email.split("@")[0], // Agrega nombre si es necesario
    });

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token, // Retorna el token
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
        favorites: user.favorites,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al registrar usuario", error: error.message });
  }
};

// Función para iniciar sesión
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

    // Generar token JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
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
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al iniciar sesión", error: error.message });
  }
};

// Obtener perfil del usuario
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id); // Usuario autenticado gracias al middleware protect
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
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener perfil", error: error.message });
  }
};

// Guardar actividad: agregar a favoritos o historial
const saveUserActivity = async (req, res) => {
  const { type, data } = req.body; // type: "favorite" o "history"

  try {
    const user = req.user;

    if (type === "favorite") {
      user.favorites.push(data); // Agregar a favoritos
    } else if (type === "history") {
      user.history.push(data); // Agregar al historial
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
    const user = req.user; // Usuario autenticado (middleware `protect`)

    // Actualizar el nombre si se proporciona
    if (name) user.name = name;

    // Actualizar el avatar si se proporciona y validar formato Base64
    if (avatar) {
      if (!avatar.startsWith("data:image/")) {
        return res
          .status(400)
          .json({ message: "Formato de imagen no válido para el avatar." });
      }
      user.avatar = avatar;
    }

    // Actualizar la imagen de fondo si se proporciona y validar formato Base64
    if (backgroundImage) {
      if (!backgroundImage.startsWith("data:image/")) {
        return res.status(400).json({
          message: "Formato de imagen no válido para la imagen de fondo.",
        });
      }
      user.backgroundImage = backgroundImage;
    }

    // Actualizar el correo electrónico si se proporciona y validar
    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ message: "Correo electrónico no válido." });
      }
      user.email = email;
    }

    // Actualizar la contraseña si se proporciona y validar
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ message: "La contraseña debe tener al menos 6 caracteres." });
      }
      const bcrypt = require("bcrypt"); // Asegúrate de tener bcrypt instalado
      const hashedPassword = await bcrypt.hash(password, 10); // Encripta la nueva contraseña
      user.password = hashedPassword;
    }

    // Guardar los cambios en la base de datos
    await user.save();

    // Responder con los datos actualizados del usuario
    res.json({
      message: "Perfil actualizado exitosamente",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        backgroundImage: user.backgroundImage,
        favorites: user.favorites,
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

    // Filtrar duplicados de forma segura
    const updatedFavorites = user.favorites.filter(
      (fav) => fav.animeId !== animeId
    );

    if (updatedFavorites.length === user.favorites.length) {
      // No estaba en favoritos, agregarlo
      updatedFavorites.push({ animeId, title, image, subtitle });
      message = "Anime añadido a favoritos";
    } else {
      // Ya estaba en favoritos, lo eliminamos
      message = "Anime eliminado de favoritos";
    }

    user.favorites = updatedFavorites;

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

module.exports = {
  updateProfile,
  registerUser,
  loginUser,
  getProfile,
  saveUserActivity,
  toggleFavorite,
};
