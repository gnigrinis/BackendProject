const express = require('express')
const router = express.Router()
const productManager = require('../../dao/product.manager')
const cartManager = require('../../dao/cart.manager')
const userManager = require('../../dao/user.manager')
const { hashPassword, isValidPassword} = require('../utils/passwords.utils')

const passport = require('passport')

//Home
router.get('/', async (req,res)=>{
  if(req.session.user){
    const userSession = req.session.user
    const player={
      title: 'Home',
      firstname: userSession.firstname,
      user: userSession.user,
      admin: userSession.admin
    }
    if (player.admin===true||player.user===true){
      res.redirect('/products')
      }
  } else{
    res.redirect('/login')
  }
})

//Sign Up GET
router.get('/signup', async (req,res)=>{
  res.render('signup',{
    style:'index.css',
  })
})

//Controlador de sign up POST
const signup = async (req, res) => {
  let user=req.body
  //verificar correo
  let checker = await userManager.getByEmail(user.email)
  
  if(checker){
    return res.render('signup',{
      error: 'El email ya existe'
    })
  }
  //verificar contraseña
  if(user.password !== user.password2){
    return res.render('signup', {
      error: 'Las contraseñas no coinciden'
    })
  }
  //crear usuario
  try{
    const newUser = await userManager.create({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      age: user.age,
      password: hashPassword(user.password)
    })
    
    req.session.user ={
      firstname: newUser.firstname,
      id: newUser._id,
      ...newUser._doc
    }
    req.session.save((err) => {
      res.status(201).redirect('/')
    })
  }catch(error){
    return res.render('signup', {
      error: 'Ocurrio un error. Intentalo más tarde'
    })
  }
}

//Sign POST antiguo
//router.post('/signup', signup)

//Sign Up POST Passport
router.post('/signup', passport.authenticate('local-signup', {
  successRedirect: '/',
  failureRedirect: '/signup'
}))



//login GET
router.get('/login', async (req,res)=>{
  res.render('login',{
    style:'index.css',
  })
})

//Controlador de Login POST
const login = async (req, res) => {
  const email = req.body.email

  if(email == 'adminCoder@coder.com'){
    const password = req.body.password
    if(password == 'adminCod3r123'){
      req.session.user = {
        firstname: 'Coder',
        lastname: 'House',
        email: email,
        age: 9,
        user: true,
        admin: true,
      }
      req.session.save((err) => {
        if(err) {
          console.error('Error al guardar la sesión:', err)
        }else{
          console.log('La session se guardó exitosamente')
          res.redirect('/')
        }
      })
    }else{
      const user = await userManager.getByEmail(email)
      if (!user) {
        return res.render('login', { 
          error: 'El usuario no existe' 
        })
      }
    }
  }else{
      try {
        const user = await userManager.getByEmail(email)
        const password = req.body.password

        if (!user) {
          return res.render('login', { 
            error: 'El usuario no existe' 
          })
        }
        if (!password){
          return res.render('login', { 
            error: 'El password es requerido' 
          })
        }
        if(!isValidPassword(password, user.password)){
          return res.render('login', { 
            error: 'Contraseña invalida' 
          }) 
        }

        req.session.user = {
          firstname: user.firstname,
          user: user.user,
          admin: user.admin,
          ...user
        }
        req.session.save((err) => {
          if(err) {
            console.error('Error al guardar la sesión:', err)
          }else{
            console.log('La session se guardó exitosamente')
            res.redirect('/')
          }
        })
      } catch(e) {
        res.render('login', { error: 'Ha ocurrido un error' })
      }
}}

//Login POST Antiguo
//router.post('/login', login)

//Login POST Passport
router.post('/login', passport.authenticate('local-login', {
  failureRedirect: '/login'
}), async (req,res) => {
  if(!req.user) returnres.status(400).send({status:'error', error:"Credenciales invalidas"})
  req.session.user = {
    firstname: req.user.firstname,
    user: req.user.user,
    admin: req.user.admin,
    ...req.user
  }
  req.session.save((err) => {
    if(err) {
      console.error('Error al guardar la sesión:', err)
    }else{
      console.log('La session se guardó exitosamente')
    }
  })
  res.redirect(('/'))
}) 


//Log out
router.get('/logout', (req, res) => {

  // borrar la cookie
  res.clearCookie('user')
  res.clearCookie('cartID')
  req.session.destroy((err) => {
    if(err) {
      console.error('Hubo problemas para borrar la session', err)
    }

    res.render('login', {
    })

    req.user = null
  })
})

//Profile
router.get('/profile', (req, res) => {

  if (req.session.user.admin===true||req.session.user.user===true){
    res.render('profile', {
      style:'index.css',
      isAdmin: req.session.user.admin===true,
      isUser: req.session.user.user===true,
      ...req.session.user
    })
  }else{
    res.redirect('/login')
  }
})

//Chat
router.get('/chat', (req, res) => {
  let testUser={
    name:"Giancarlo",
    lastName:"Nigrinis",
    admin: true,
    user: true,
  }
  
  res.render('chat',{
    user:testUser,
    style:'index.message.css',
    isAdmin:testUser.role==="admin",
  })
})

//products
router.get('/products', async (req, res) => {
  const userSession = req.session.user
  const userId = req.session.user._id

  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  try {
    const products = await productManager.getProducts()
    const cartId = cartManager.getCartIdFromCookie(req, userId)
    const totalPages = Math.ceil(products.length / limit)
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProducts = products.slice(startIndex, endIndex)


    const player={
      title: 'Products',
      user: userSession.user,
      admin: userSession.admin
    }
    
    res.render('products', {
      firstname: userSession.firstname,
      email: userSession.email,
      style: 'index.css',
      isAdmin: player.admin === true,
      isUser: player.user === true,
      products: paginatedProducts,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      cartId,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/products?page=${page - 1}` : null,
      nextLink: page < totalPages ? `/products?page=${page + 1}` : null
    })
  } catch (error) {
    res.render('login', {
    })
  }
})

//carts
router.get('/cart/:cid', async (req, res) => {
  const { cid } = req.params
  const userSession = req.session.user

  try {
    const cart = await cartManager.getCartWithPopulatedProducts(cid)

    const player={
      title: 'Cart',
      user: userSession.user,
      admin: userSession.admin
    }
    res.render('cart', {
      firstname: userSession.firstname,
      style: 'index.cart.css',
      isAdmin: player.admin === true,
      isUser: player.user === true,
      cart
    })
  } catch (error) {
    return res.render('cart'),{
      error: "El carrito está vacio"
    }
  }
})

//Metodo Get con Web Socket
router.get('/realtimeproducts', async (req,res)=>{
  let testUser={
    name:"Giancarlo",
    lastName:"Nigrinis",
    role:"admin"
  }

  const products = await productManager.getProducts()

  res.render('realTimeProducts',{
    user:testUser,
    style:'index.css',
    isAdmin:testUser.role==="admin",
    products
  })
})

//Metodo Post con Web Socket
router.post('/realTimeProducts', async (req, res) => {
    newProduct=req.body
    try {
      await productManager.addProduct(newProduct)
      res.status(201).redirect('/realTimeProducts')
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })

module.exports = router
