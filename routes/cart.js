const express = require("express");
const router = express.Router();

const {
  get_cart_items,
  add_cart_item,
  delete_item,
} = require("../controllers/cartControllers");
// const auth = require("../middleware/auth");

router.get("/cart/:id", get_cart_items);
router.post("/cart/:id", add_cart_item);
router.delete("/cart/:userId/:productId", delete_item);

module.exports = router;
