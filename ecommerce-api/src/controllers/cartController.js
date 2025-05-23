const Cart = require("../models/cart");
const Product = require("../models/product");
const errorHandler = require("../middlewares/errorHandler");

exports.getCartByUserId = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId }).populate(
      "products.productId"
    );
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

exports.addToCart = async (req, res, next) => {
  const { userId, productId, quantity } = req.body;

  try {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
        totalPrice: 0,
      });
    } else {
      const productIndex = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );

      if (productIndex > -1) {
        cart.products[productIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    cart.totalPrice += product.price * quantity;

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

exports.removeFromCart = async (req, res, next) => {
  const { userId, productId } = req.body;

  try {
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (p) => p.productId.toString() === productId
    );

    if (productIndex > -1) {
      const Product = require("../models/product");
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      cart.totalPrice -= product.price * cart.products[productIndex].quantity;
      cart.products.splice(productIndex, 1);
      await cart.save();
    }

    res.status(200).json(cart);
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOneAndDelete({ userId: req.params.userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    errorHandler(error, req, res, next);
  }
};
