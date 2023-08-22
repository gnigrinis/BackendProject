(async () =>{
//Routers
const productsRouter = require('../src/routes/productsRouter')
const cartsRouter = require('../src/routes/cartsRouter')
const viewRourter = require('../src/routes/viewsRouter')
const usersRouter = require('../src/routes/usersRouter')

//Mongoose
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://gnigrinis:P72FtiVO5nvaGCwn@cluster0.zt1wb.mongodb.net/ecommerce?retryWrites=true&w=majority")
.then(() => console.log('se ha conectado a la base de datos'))
.catch(() => console.log('no se ha conectado a la base de datos'))

//Express
const express = require('express')
const app = express()

//Handlebars
const { engine } = require('express-handlebars')

//Web Socket
const {Server} = require("socket.io")
const http =require('http')
const server =http.createServer(app)
const io = new Server(server)

//Socket Manager
const socketManager = require('../src/websocket/chat.socket')
io.on('connection', socketManager)

//Express Session
const session = require('express-session')

//File store Sessions locales
//const fileStore = require('session-file-store')
//const FileStore = fileStore(session)

//Store de Mongo
const MongoStore = require('connect-mongo')

//cookie parser
const cookieParser = require('cookie-parser')

//Definiendo Puerto
const port = 8080
server.listen(port, () => {
  console.log(`Express Server Listening at http://localhost:${port}`)
})
io.on('connection', socket=>{
  
  console.log(`Cliente Conectado: ${socket.id}`)
  
  socket.on('disconnect', ()=>{
    console.log('Cliente Desconectado')
  })
  
  socket.on('addProduct', ()=>{
    console.log('Producto agregado')
  })
})

// Middleware para parsear parámetros o queries en caso de usar consultas complejas.
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

//Middleware de sesion
app.use(cookieParser('esunsecreto'))
app.use(session({
  secret: 'esunsecreto',
  resave: true,
  saveUninitialized: true,
  //store: new FileStore({ path: './sessions', ttl: 100, retries: 0})
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://gnigrinis:P72FtiVO5nvaGCwn@cluster0.zt1wb.mongodb.net/ecommerce?retryWrites=true&w=majority',
    ttl: 60 * 60
  })
}))

/// middleware global
/* app.use((req, res, next) => {

  if (req.session?.user) {
    req.user = {
      name: req.session.user.name,
      role: "admin"
    }
  }

  next()
}) */

// Asignar el router de productos a la ruta /api/products
app.use('/api', productsRouter)

// Asignar el router de carritos a la ruta /api/carts
app.use('/api', cartsRouter)

// Asignar el router de users a la ruta /api/carts
app.use('/api', usersRouter)

//Plantilla Handlebars
app.use('/', viewRourter)
app.engine('handlebars', engine())
app.set('views',__dirname+'/views')
app.set('view engine', 'handlebars')

//Seteando de manera estática la carpeta public
app.use(express.static(__dirname+'/public'))
})()

