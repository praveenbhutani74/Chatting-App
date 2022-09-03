const expressAsyncHandler = require("express-async-handler");
const Chat = require("../Models/chatModel");
const User = require("../Models/userModel");

const ChatForUser = expressAsyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("Params Not Sent");
    return res.status(400);
  }

  var isChat = Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $eleMatch: { $eq: req.user._id } } },
      { users: { $eleMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  console.log(isChat);
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var ChatCreatedData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.users._id, userId],
    };
    try {
      const createdChat = await Chat.create(ChatCreatedData);
      const ChatUser = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");
      res.status(200).send(ChatUser);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const FetchChats = expressAsyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $eleMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (result) => {
        result = User.populate(result, {
          path: latestMessage.sender,
          select: "name pic email",
        });
        res.status(200).send(result);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});
const crateGroupChat = expressAsyncHandler(async (req, res) => {
  if (!req.body.users || req.body.name) {
    return res.status(400).send({ message: "Please Fill All The Fields" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res.status(400).send("More then 2 users required");
  }
  users.push(req.user);

  try {
    const GropuChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const AllGropuChat = await Chat.findOne({ _id: GropuChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(AllGropuChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const RenameGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const UpdatedGropuName = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!UpdatedGropuName) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(UpdatedGropuName);
  }
});

const AddUserToGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const AddToGroup = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!AddToGroup) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(AddToGroup);
  }
});

const RemoveUserFromGroup = expressAsyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const deletedUser = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!deletedUser) {
    res.status(404);
    throw new Error("User Not Found");
  } else {
    res.json(deletedUser);
  }
});

module.exports = {
  ChatForUser,
  FetchChats,
  crateGroupChat,
  RenameGroup,
  AddUserToGroup,
  RemoveUserFromGroup,
};
