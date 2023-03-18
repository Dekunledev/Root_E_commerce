const Cart = require("../models/Cart");
const Product = require("../models/Product");

const get_cart_items = async (req, res) => {
  const userId = req.params.id;
  try {
    let cart = await Cart.findOne({ userId });
    if (cart && cart.products.length > 0) {
      return res.status(200).json(cart);
    } else {
      return res.status(200).json(null);
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to get cart items. Please try again.
                  Error: ${err}`,
    });
  }
};

const add_cart_item = async (req, res) => {
  const userId = req.params.id;
  const { productId, quantity } = req.body;

  try {
    let userCart = await Cart.findOne({ userId });
    let product = await Product.findOne({ _id: productId });
    if (!product) {
      return res.status(404).json({ message: "Product not found!" });
    }
    const price = product.price;
    const name = product.title;

    if (userCart) {
      // if cart exists for the user
      let productIndex = userCart.products.findIndex(
        (p) => p.productId == productId
      );

      // Check if product exists or not
      if (productIndex > -1) {
        let productItem = userCart.products[productIndex];
        productItem.quantity += quantity;
        userCart.products[productIndex] = productItem;
      } else {
        userCart.products.push({ productId, name, quantity, price });
      }
      userCart.bill += quantity * price;
      userCart = await userCart.save();
      return res.status(201).json(userCart);
    } else {
      // no cart exists, create one
      const newCart = await Cart.create({
        userId,
        products: [{ productId, name, quantity, price }],
        bill: quantity * price,
      });
      return res.status(201).json(newCart);
    }
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to add cart item. Please try again.
                        Error: ${err}`,
    });
  }
};

const delete_item = async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  try {
    let cart = await Cart.findOne({ userId });
    let productIndex = cart.products.findIndex((p) => p.productId == productId);
    if (itemIndex > -1) {
      let productItem = cart.products[productIndex];
      cart.bill -= productItem.quantity * productItem.price;
      cart.products.splice(productIndex, 1);
    }
    cart = await cart.save();
    return res.status(201).json(cart);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to delete cart item. Please try again.
                          Error: ${err}`,
    });
  }
};

module.exports = { get_cart_items, add_cart_item, delete_item };
