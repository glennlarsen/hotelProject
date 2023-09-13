var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const userId = req.user?.id ?? 0;
  const username = req.user?.username ?? 0;
  const isAdmin = req.user?.role === "Admin";
  res.render("index", { title: "Your travel", username, userId, isAdmin });
});

module.exports = router;
