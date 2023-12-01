const { Schema, model } = require("mongoose")

const schema = new Schema({
  title: String,
  description: String,
  code: Number,
  price: Number,
  status: Boolean,
  stock: Number,
  category: [String],
  thumbnails: [String],
  createDate: { type: Number, default: Date.now() },
  owner: {
    type: {
      userType: { type: String, enum: ["premium", "admin"] }, // Tipo de usuario (premium o admin)
      email: { type: String }, // Correo electrónico del propietario
    },
    default: null,
  },
})

const productModel = model("products", schema)

module.exports = productModel
