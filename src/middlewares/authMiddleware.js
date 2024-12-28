const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      return next();
    } catch (error) {
      console.error("Error al verificar el token:", error.message);
      return res.status(401).json({ message: "No autorizado, token inválido" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No se encontró el token" });
  }
};

module.exports = { protect };
