const { Router } = require('express')
const userManager = require('../../dao/user.manager')

const router = Router()

router.post('/signup', async (req, res) => {
  newUser=req.body
  try{
    await userManager.create(newUser) 
    res.status(201).json({message: 'Usuario creado'})
  }catch(error){
    res.status(400).json({error: error.message})
  }
})


module.exports = router