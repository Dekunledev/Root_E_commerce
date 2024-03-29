const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CartSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  products: [
    {
      productId: {
        type: String,
      },
      name: String,
      quantity: {
        type: Number,
        required: true,
        min: [1, "Quantity can not be less than 1"],
        default: 1,
      },
      price: Number,
    },
  ],
  bill: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Cart", CartSchema);
