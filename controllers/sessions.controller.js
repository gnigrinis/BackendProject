const currentUser = async (req, res) => {
  // Verifica si el usuario está autenticado
  if (req.isAuthenticated()) {
    // Accede a la información del usuario actual
    const currentUser = req.user;
    res.render("current", {
      style: "index.css",
      users: currentUser,
      isAdmin: req.session.user.role === "admin",
      isUser: req.session.user.role === "user",
    });
  } else {
    res.status(401).json({ message: "Usuario no autenticado" });
  }
};

module.exports = currentUser;
