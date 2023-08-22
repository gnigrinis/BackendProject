const { Schema, model, ObjectId } = require('mongoose')

const cartSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'user' },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    quantity: Number
  }], default: []
})

const cartModel = model('carts', cartSchema)

module.exports = cartModel
