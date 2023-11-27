const userManager = require("../dao/user.manager")
const cartManager = require("../dao/cart.manager")
const userModel = require("../models/user.model")
const MailSender = require("../services/mail.sender.service")

const signup = async (req, res) => {
  const cartID = await cartManager.createCart()
  newUser = {
    cart: cartID,
    ...req.body,
  }
  try {
    await userManager.create(newUser)
    res.status(201).json({ message: "Usuario creado" })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find(
      {},
      "firstname lastname email role lastConecction"
    )
    res.json(users)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteInactiveUsers = async (req, res) => {
  try {
    const inactiveThreshold = new Date(Date.now() - 30 * 60 * 1000) // Últimos 30 minutos
    const inactiveUsers = await userModel.find({
      lastConecction: { $lt: inactiveThreshold },
    })

    inactiveUsers.forEach(async (user) => {
      await userModel.findByIdAndDelete(user._id)
      await MailSender.send(
        user.email,
        "Tu cuenta ha sido eliminada por inactividad"
      ) // Enviar correo al usuario eliminado
    })

    res.json({ message: "Usuarios inactivos eliminados correctamente" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const changeUserRole = async (req, res) => {
  const { uid } = req.params // Obtén el ID del usuario a actualizar
  try {
    const user = await userModel.findById(uid)

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    user.role = "admin" // Cambia el rol del usuario a 'admin'
    await user.save()

    res
      .status(200)
      .json({ message: "Rol de usuario actualizado a Administrador" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

const deleteUser = async (req, res) => {
  const { uid } = req.params // Obtén el ID del usuario a eliminar
  try {
    const user = await userModel.findById(uid)

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    await userModel.deleteOne({ _id: uid })

    res.status(200).json({ message: "Usuario eliminado" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  signup,
  getAllUsers,
  deleteInactiveUsers,
  changeUserRole,
  deleteUser,
}
