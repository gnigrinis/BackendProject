const chatMessageManager = require("../dao/chat.message.manager")
const logger = require("../logger")

async function socketManager(socket) {
  logger.debug(`user has connected: ${socket.id}`)

  /// logica de mensajes
  // obtener todos los mensajes de la base de datos
  const messages = await chatMessageManager.getAll()
  socket.emit("chat-messages", messages)

  socket.on("chat-message", async (msg) => {
    // guardar el mensaje en la DB
    await chatMessageManager.create(msg)
    socket.broadcast.emit("chat-message", msg)
  })
}

module.exports = socketManager
