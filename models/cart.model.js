const { Schema, model, ObjectId } = require('mongoose');

const cartSchema = new Schema({
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'products' },
    quantity: Number
  }]
});

const cartModel = model('carts', cartSchema);

module.exports = cartModel;
