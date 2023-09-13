var express = require("express");
var router = express.Router();
var db = require("../models");
var UserService = require("../services/UserService");
var userService = new UserService(db);
var { canSeeUserList, canSeeUserDetails, checkIfAuthorized, isAdmin } = require("./authMiddlewares")
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

/* GET user list for Admin only. */
router.get('/', canSeeUserList, async function(req, res, next) {
  const users = await userService.getAll();
  const userId = req.user?.id ?? 0;
  const username = req.user?.username ?? 0;
  const isAdmin = req.user?.role === "Admin";
  res.render('users', {users: users, username, userId, isAdmin});
});

/* GET users listing for specific user. */
router.get("/:userId", canSeeUserDetails, async function (req, res, next) {
  try {
    const user = await userService.getOne(req.params.userId);

    if (!user) {
      // User not found, render an error page or redirect
      return res.status(404).render("error", {
        message: "User not found",
        error: { status: 404 }
      });
    }

    const userId = req.user?.id ?? 0;
    const username = req.user?.username ?? 0;
    const isAdmin = req.user?.role === "Admin";
    
    res.render("userDetails", { user: user, username, userId, isAdmin });
  } catch (error) {
    // Handle other errors here
    next(error); // Pass the error to the global error handler
  }
});


/* DELETE users for admin only */
router.delete('/', checkIfAuthorized, isAdmin, jsonParser, async function(req, res, next) {
  let id = req.body.id;
  await userService.deleteUser(id);
  res.end()
});

module.exports = router;
