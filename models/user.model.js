const { Schema, model } = require("mongoose")
const schema = new Schema({
  firstname: String,
  lastname: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  cart: { type: Schema.Types.ObjectId, ref: "carts" },
  role: { type: String, default: "user" },
  createDate: { type: Number, default: Date.now() },
  documents: { type: [{ name: String, url: String }] },
  lastConecction: {
    type: Date,
    default: Date.now,
  },
})

const userModel = model("users", schema)

module.exports = userModel
