const express = require("express");
const router = express.Router();

const {
  get_orders,
  checkout,
  verifyWebhook,
} = require("../controllers/orderControllers");
// const auth = require("../middleware/auth");

router.get("/order/:id", get_orders);
router.post("/order/:id", checkout);
router.post("/root-webhook", verifyWebhook);

module.exports = router;
