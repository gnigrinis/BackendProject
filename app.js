;(async () => {
  const path = require("path")
  const { Command } = require("commander")
  const program = new Command()
  program.option("-e, --env <env>", "Entorno de ejecucion", "production")
  program.parse()

  const { env } = program.opts()

  //Variables de entorno
  require("dotenv").config({
    path: path.join(
      __dirname,
      env == "development" ? ".env.development" : ".env"
    ),
  })

  const config = require("./config/config")

  console.log(config)

  //Routers
  const productsRouter = require("./routes/productsRouter")
  const cartsRouter = require("./routes/cartsRouter")
  const viewRouter = require("./routes/viewsRouter")
  const usersRouter = require("./routes/usersRouter")
  const authRouter = require("./routes/auth.router")
  const sessionsRouter = require("./routes/sessions.router")
  const notificationsRoutes = require("./routes/notifications.router")

  //Middleware logger
  const loggerMiddleware = require("./utils/logger.midddleware")
  const logger = require("./logger")

  //Passport
  const passport = require("passport")
  const initPassportLocal = require("./config/passport.local.config")

  //Mongoose
  const mongoose = require("mongoose")
  mongoose
    .connect(config.MONGO_URL)
    .then(() => logger.warn("se ha conectado a la base de datos"))
    .catch(() => logger.error("no se ha conectado a la base de datos"))

  //Express
  const express = require("express")
  const app = express()

  //Swagger
  const swaggerUiExpress = require("swagger-ui-express")
  const swaggerJsDoc = require("swagger-jsdoc")
  const specs = swaggerJsDoc({
    definition: {
      openapi: "3.0.1",
      info: {
        title: "My Buy API",
        description: "Documentación para My Buy API",
      },
    },
    apis: [`./doc/**/*.yaml`],
  })

  app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

  //Handlebars
  const { engine } = require("express-handlebars")

  //Web Socket
  const { Server } = require("socket.io")
  const http = require("http")
  const server = http.createServer(app)
  const io = new Server(server)

  //Socket Manager
  const socketManager = require("./websocket/chat.socket")
  io.on("connection", socketManager)

  //Express Session
  const session = require("express-session")

  //File store Sessions locales
  //const fileStore = require('session-file-store')
  //const FileStore = fileStore(session)

  //Store de Mongo
  const MongoStore = require("connect-mongo")

  //cookie parser
  const cookieParser = require("cookie-parser")

  //Definiendo Puerto
  const port = config.PORT
  server.listen(port, () => {
    logger.info(`Express Server Listening at http://localhost:${port}`)
  })
  io.on("connection", (socket) => {
    logger.debug(`Cliente Conectado: ${socket.id}`)

    socket.on("disconnect", () => {
      logger.debug("Cliente Desconectado")
    })

    socket.on("addProduct", () => {
      logger.info("Producto agregado")
    })
  })

  //Logger
  app.use(loggerMiddleware)

  // Middleware para parsear parámetros o queries en caso de usar consultas complejas.
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json())

  //Middleware de sesion
  app.use(cookieParser("esunsecreto"))
  app.use(
    session({
      secret: "esunsecreto",
      resave: true,
      saveUninitialized: true,
      //store: new FileStore({ path: './sessions', ttl: 100, retries: 0})
      store: MongoStore.create({
        mongoUrl: config.MONGO_URL,
        ttl: 60 * 60,
      }),
    })
  )

  //registro de middleware de passport
  initPassportLocal()
  app.use(passport.initialize())
  app.use(passport.session())

  // middleware global
  app.use((req, res, next) => {
    //logger.info(req.session, req.user)
    next()
  })

  // Asignar el router de productos a la ruta /api/products
  app.use("/api", productsRouter)

  // Asignar el router de carritos a la ruta /api/carts
  app.use("/api", cartsRouter)

  // Asignar el router de users a la ruta /api/users
  app.use("/api", usersRouter)

  app.use("/api", authRouter)

  app.use("/api", sessionsRouter)

  //Router de Mail
  app.use("/api", notificationsRoutes)

  //Midlavware de errores
  app.use((err, req, res, next) => {
    logger.error(err.message)

    res.send({
      success: false,
      error: err.stack,
    })
  })

  //Plantilla Handlebars
  app.use("/", viewRouter)
  app.engine("handlebars", engine())
  app.set("views", __dirname + "/views")
  app.set("view engine", "handlebars")

  //Seteando de manera estática la carpeta public
  app.use(express.static(__dirname + "/public"))
})()
