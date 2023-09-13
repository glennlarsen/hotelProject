var express = require("express");
var router = express.Router();
var HotelService = require("../services/HotelService");
var db = require("../models");
var hotelService = new HotelService(db);
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var { checkIfAuthorized, isAdmin } = require("./authMiddlewares")

/* GET hotels listings. */
router.get("/", async function (req, res, next) {
  const userId = req.user?.id ?? 0;
  const isAdmin = req.user?.role === "Admin";
  const username = req.user?.username ?? 0;
  let hotels = await hotelService.get();
  /* Filter hotel by location using query strings */
  if(req.query.location != null) {
    hotels = hotels.filter(hotel => hotel.Location.toLowerCase() == req.query.location.toLowerCase());
  }
  res.render("hotels", { title: "Hotels", hotels: hotels, userId, user: req.user, username, isAdmin});
});

/* GET hotel details */
router.get('/:hotelId', async function(req, res, next) {
  const userId = req.user?.id ?? 0;
  const username = req.user?.username ?? 0;
  const isAdmin = req.user?.role === "Admin";
  
  try {
    const hotel = await hotelService.getHotelDetails(req.params.hotelId, userId);
    res.render('hotelDetails', { hotel: hotel, userId, user: req.user, username, isAdmin });
  } catch (error) {
    if (error.status === 404) {
      // Render the error view with the custom message and status
      res.status(404).render('error', {
        message: 'Hotel not found',
        error: error
      });
    } else {
      // Handle other errors accordingly
      next(error);
    }
  }
});


/* Rate a hotel */
router.post('/:hotelId/rate', checkIfAuthorized, jsonParser, async function(req, res, next) {
  let value = req.body.Value;
  let userId = req.body.UserId;
  await hotelService.makeARate(userId, req.params.hotelId, value);
  res.end()
});

/* POST new hotels listing. */
router.post("/", checkIfAuthorized, isAdmin, jsonParser, async function (req, res, next) {
  let Name = req.body.Name;
  let Location = req.body.Location;
  await hotelService.create(Name, Location);
  res.end();
});


/* Delete hotels listing. */
router.delete("/", checkIfAuthorized, jsonParser, async function (req, res, next) {
  let id = req.body.id;
  await hotelService.deleteHotel(id);
  res.end();
});

router.delete('/:id', checkIfAuthorized, jsonParser, async function(req, res, next) {
  await hotelService.deleteHotel(req.params.id);
  res.end()
});

module.exports = router;
