var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var RoomService = require("../services/RoomService");
var db = require("../models");
const user = require("../models/user");
var roomService = new RoomService(db);
var { checkIfAuthorized } = require("./authMiddlewares");

/* GET rooms listing. */
/* GET rooms listing. */
router.get("/:hotelId", async function (req, res, next) {
  try {
    const rooms = await roomService.getHotelRooms(req.params.hotelId);

    if (!rooms || rooms.length === 0) {
      // No rooms found for the hotel, render an error page or redirect
      return res.status(404).render("error", {
        message: "No rooms found for this hotel",
        error: { status: 404 }
      });
    }

    const userId = req.user?.id ?? 0;
    rooms.map(room => room.Users = room.Users.filter(user => user.id == userId).length > 0);
    const username = req.user?.username ?? 0;
    const isAdmin = req.user?.role === "Admin";

    res.render("rooms", {
      rooms: rooms,
      userId,
      username,
      isAdmin,
      hotelId: req.params.hotelId,
    });
  } catch (error) {
    // Handle other errors here
    next(error); // Pass the error to the global error handler
  }
});


router.get("/", async function (req, res, next) {
  const rooms = await roomService.get();
  const userId = req.user?.id ?? 0;
  rooms.map(room => room.Users = room.Users.filter(user => user.id == userId).length > 0);
  const username = req.user?.username ?? 0;
  const isAdmin = req.user?.role === "Admin";
  res.render("rooms", {
    rooms: rooms,
    userId,
    username,
    isAdmin,
    hotelId: null,
  });
});

router.post(
  "/",
  checkIfAuthorized,
  jsonParser,
  async function (req, res, next) {
    let Capacity = req.body.Capacity;
    let PricePerDay = req.body.PricePerDay;
    let HotelId = req.body.HotelId;
    await roomService.create(Capacity, PricePerDay, HotelId);
    res.end();
  }
);

router.post(
  "/reservation",
  checkIfAuthorized,
  jsonParser,
  async function (req, res, next) {
    let userId = req.body.UserId;
    let roomId = req.body.RoomId;
    let startDate = req.body.StartDate;
    let endDate = req.body.EndDate;
    await roomService.rentARoom(userId, roomId, startDate, endDate);
    res.end();
  }
);

router.delete(
  "/",
  checkIfAuthorized,
  jsonParser,
  async function (req, res, next) {
    let id = req.body.id;
    await roomService.deleteRoom(id);
    res.end();
  }
);

module.exports = router;
