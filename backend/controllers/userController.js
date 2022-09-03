const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const GenerateJwtToken = require("./GenerateJwtToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please Enter all fields");
  }
  const userExist = await User.findOne({ email });

  if (userExist) {
    res.status(400);
    throw new Error("User already Exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: GenerateJwtToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to Sign Up ");
  }
});

const LoginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.MatchPassword(password))) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: GenerateJwtToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Wrong Email and Password");
  }
});

const GetAllUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { regex: req.query.search, $option: "i" } },
          { email: { regex: req.query.search, $option: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, LoginUser, GetAllUsers };
