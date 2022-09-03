const express = require("express");
const {
  ChatForUser,
  FetchChats,
  crateGroupChat,
  RenameGroup,
  AddUserToGroup,
  RemoveUserFromGroup,
} = require("../controllers/chatController");
const { protectedUser } = require("../middleware/authmiddleware");

const router = express.Router();

router.route("/").post(protectedUser, ChatForUser);
router.route("/").get(protectedUser, FetchChats);
router.route("/group").post(protectedUser, crateGroupChat);
router.route("/rename").put(protectedUser, RenameGroup);
router.route("/groupadd").put(protectedUser, AddUserToGroup);
router.route("/grouprmove").put(protectedUser, RemoveUserFromGroup);

module.exports = router;
