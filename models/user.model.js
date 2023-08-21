const { Schema, model } =require('mongoose')

const schema = new Schema({
  firstname: String,
  lastname: String,
  email: String,
  age: Number,
  password: String,
  admin: {type: Boolean, default: false},
  user: {type: Boolean, default: true},
  createDate: {type: Number, default: Date.now()}
})

const userModel = model('users', schema)

module.exports = userModel