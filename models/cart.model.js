const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  email: { type: String, ref: "user" },
  products: [
    {
      product: { type: Schema.Types.ObjectId, ref: "products" },
      quantity: Number,
    },
  ],
  default: [],
});

const cartModel = model("carts", cartSchema);

module.exports = cartModel;
