const { Schema, model } =require('mongoose')

const schema = new Schema({
  title: String,
  description: String,
  code: Number,
  price: Number,
  status: Boolean,
  stock: Number,
  category: [String],
  thumbnails: [String],
  createDate: {type: Number, default: Date.now()}
})

const productModel = model('products', schema)

module.exports = productModel