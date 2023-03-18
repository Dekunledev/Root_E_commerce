const express = require("express");
const router = express.Router();

const {
  get_products,
  add_product,
  update_product,
  delete_product,
} = require("../controllers/productControllers");
// const auth = require("../middleware/auth");

router.get("/products", get_products);
router.post("/products", add_product);
router.put("/products/:id", update_product);
router.delete("/products/:id", delete_product);

module.exports = router;
