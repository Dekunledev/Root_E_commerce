const express = require("express");
const router = express.Router();

const { register, login, get_user } = require("../controllers/userControllers");
const auth = require("../middleware/auth");

router.post("/register", register);
router.post("/login", login);
router.get("/user", auth, get_user);

module.exports = router;
