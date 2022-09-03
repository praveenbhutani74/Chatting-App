const express = require("express");
const {
  registerUser,
  LoginUser,
  GetAllUsers,
} = require("../controllers/userController");
const { protectedUser } = require("../middleware/authmiddleware");

const router = express.Router();

router.route("/").get(protectedUser, GetAllUsers);
router.route("/").post(registerUser);
router.route("/login").post(LoginUser);

module.exports = router;
