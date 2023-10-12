module.exports = {
  authorizeAdmin: (req, res, next) => {
    if (req.user[0].role == "admin") {
      next()
    } else {
      res.status(403).json({
        message:
          "No tienes permiso para acceder a esta ruta como administrador",
      })
    }
  },
  authorizeUser: (req, res, next) => {
    if (req.user[0].role == "user") {
      next()
    } else {
      res.status(403).json({
        message: "No tienes permiso para acceder a esta ruta como usuario",
      })
    }
  },
}
