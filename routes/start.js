var express = require("express");
var router = express.Router();
var db = require("../models");
var UserService = require("../services/UserService");
var userService = new UserService(db);
var HotelService = require("../services/HotelService");
var hotelService = new HotelService(db);

/* GET start page. */
router.get("/", async function (req, res, next) {
  if (req.user) {
    const user = await userService.getOne(req.user.id);
    const userId = req.user?.id ?? 0;
    const username = req.user?.username ?? 0;
    const isAdmin = req.user?.role === "Admin";

    try {
      if (user === null) {
        throw createError(404);
      }

      res.render("userDetails", { user: user, username, userId, isAdmin });
    } catch (error) {
      if (error.status === 404) {
        // Render the error view with the custom message and status
        res.status(404).render("error", {
          message: "User not found",
          error: error,
        });
      } else {
        // Handle other errors accordingly
        next(error);
      }
    }
  } else {
    const rate = await hotelService.getBestRate();
    const userId = req.user?.id ?? 0;
    const username = req.user?.username ?? 0;
    const isAdmin = req.user?.role === "Admin";

    try {
      if (rate === null) {
        throw createError(404);
      }

      const hotel = await hotelService.getHotelDetails(rate.HotelId, null);

      if (hotel === null) {
        throw createError(404);
      }

      res.render("hotelDetails", {
        hotel,
        userId,
        user: req.user,
        username,
        isAdmin,
      });
    } catch (error) {
      if (error.status === 404) {
        // Render the error view with the custom message and status
        res.status(404).render("error", {
          message: "Hotel not found",
          error: error,
        });
      } else {
        // Handle other errors accordingly
        next(error);
      }
    }
  }
});

module.exports = router;
