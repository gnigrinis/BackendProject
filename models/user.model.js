const { Schema, model } =require('mongoose')

const schema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  password: String,
  role: String,
  createDate: {type: Number, default: Date.now()}
})

const userModel = model('carts', schema)

module.exports = userModel