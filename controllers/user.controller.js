const userManager = require("../dao/user.manager");
const cartManager = require("../dao/cart.manager");

const signup = async (req, res) => {
  const cartID = await cartManager.createCart();
  newUser = {
    cart: cartID,
    ...req.body,
  };
  try {
    await userManager.create(newUser);
    res.status(201).json({ message: "Usuario creado" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = signup;
