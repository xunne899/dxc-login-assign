const express = require("express");
const router = express.Router();
const crypto = require("crypto");


const { User } = require("../models");
const { checkIfAuthenticated } = require("../middlewares");

router.get("/", checkIfAuthenticated, async (req, res) => {
  const user = await User.collection().fetch();
  res.render("users/view", {
    user: user.toJSON(),
  });
});

module.exports = router;