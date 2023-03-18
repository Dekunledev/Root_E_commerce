const Product = require("../models/Product");

const get_products = async (req, res) => {
  try {
    const products = await Product.find().sort({ date: -1 });
    return res.status(200).json(products);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to get products. Please try again.
                Error: ${err}`,
    });
  }
};

const add_product = async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    await newProduct.save();
    return res.status(200).json(newProduct);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to add product. Please try again.
                  Error: ${err}`,
    });
  }
};

const update_product = async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      { _id: req.params.id },
      req.body
    );
    const product = await Product.findOne({ _id: req.params.id });
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to update product. Please try again.
                    Error: ${err}`,
    });
  }
};

const delete_product = async (req, res) => {
  try {
    const product = await findByIdAndDelete({ _id: req.params.id });
    return res.status(200).json({ message: "Product successfully deleted" });
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: `Unable to delete product. Please try again.
                      Error: ${err}`,
    });
  }
};

module.exports = { get_products, add_product, update_product, delete_product };
