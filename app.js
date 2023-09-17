(async () => {
  const path = require("path");
  const { Command } = require("commander");
  const program = new Command();
  program.option("-e, --env <env>", "Entorno de ejecucion", "production");
  program.parse();

  const { env } = program.opts();

  //Variables de entorno
  require("dotenv").config({
    path: path.join(
      __dirname,
      env == "development" ? ".env.development" : ".env"
    ),
  });

  const config = require("./config/config");

  console.log(config);

  //Routers
  const productsRouter = require("./routes/productsRouter");
  const cartsRouter = require("./routes/cartsRouter");
  const viewRouter = require("./routes/viewsRouter");
  const usersRouter = require("./routes/usersRouter");
  const authRouter = require("./routes/auth.router");
  const sessionsRouter = require("./routes/sessions.router");

  //Passport
  const passport = require("passport");
  const initPassportLocal = require("./config/passport.local.config");

  //Mongoose
  const mongoose = require("mongoose");
  mongoose
    .connect(config.MONGO_URL)
    .then(() => console.log("se ha conectado a la base de datos"))
    .catch(() => console.log("no se ha conectado a la base de datos"));

  //Express
  const express = require("express");
  const app = express();

  //Handlebars
  const { engine } = require("express-handlebars");

  //Web Socket
  const { Server } = require("socket.io");
  const http = require("http");
  const server = http.createServer(app);
  const io = new Server(server);

  //Socket Manager
  const socketManager = require("./websocket/chat.socket");
  io.on("connection", socketManager);

  //Express Session
  const session = require("express-session");

  //File store Sessions locales
  //const fileStore = require('session-file-store')
  //const FileStore = fileStore(session)

  //Store de Mongo
  const MongoStore = require("connect-mongo");

  //cookie parser
  const cookieParser = require("cookie-parser");

  //Definiendo Puerto
  const port = config.PORT;
  server.listen(port, () => {
    console.log(`Express Server Listening at http://localhost:${port}`);
  });
  io.on("connection", (socket) => {
    console.log(`Cliente Conectado: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log("Cliente Desconectado");
    });

    socket.on("addProduct", () => {
      console.log("Producto agregado");
    });
  });

  // Middleware para parsear parámetros o queries en caso de usar consultas complejas.
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  //Middleware de sesion
  app.use(cookieParser("esunsecreto"));
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
  );

  //registro de middleware de passport
  initPassportLocal();
  app.use(passport.initialize());
  app.use(passport.session());

  // middleware global
  app.use((req, res, next) => {
    //console.log(req.session, req.user)
    next();
  });

  // Asignar el router de productos a la ruta /api/products
  app.use("/api", productsRouter);

  // Asignar el router de carritos a la ruta /api/carts
  app.use("/api", cartsRouter);

  // Asignar el router de users a la ruta /api/users
  app.use("/api", usersRouter);

  app.use("/api", authRouter);

  app.use("/api", sessionsRouter);

  //Plantilla Handlebars
  app.use("/", viewRouter);
  app.engine("handlebars", engine());
  app.set("views", __dirname + "/views");
  app.set("view engine", "handlebars");

  //Seteando de manera estática la carpeta public
  app.use(express.static(__dirname + "/public"));
})();
