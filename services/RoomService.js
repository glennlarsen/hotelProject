const { sequelize } = require("../models");

class RoomService {
  constructor(db) {
    this.client = db.sequelize;
    this.Room = db.Room;
    this.User = db.User;
    this.Hotel = db.Hotel;
    this.Reservation = db.Reservation;
    console.log(db);
  }

  async create(capacity, pricePerDay, hotelId) {
    return this.Room.create({
      Capacity: capacity,
      PricePerDay: pricePerDay,
      HotelId: hotelId,
    });
  }

  async get() {
    return this.Room.findAll({
      where: {},
      include: [
        {
          model: this.User,
          through: {
            attributes: ["StartDate", "EndDate"],
          }
        },
        {
          model: this.Hotel
        },
      ],
    });
  }

  async getHotelRooms(hotelId) {
    return this.Room.findAll({
      where: {
        HotelId: hotelId,
      },
      include: [
        {
          model: this.User,
          through: {
            attributes: ["StartDate", "EndDate"],
          },
        },
        {
          model: this.Hotel
        },
      ],
    });
  }

  async deleteRoom(roomId) {
    return this.Room.destroy({
      where: { id: roomId },
    });
  }

  async rentARoom(userId, roomId, startDate, endDate) {
    sequelize
      .query(
        "CALL insert_reservation(:UserId, :RoomId, :StartDate, :EndDate)",
        {
          replacements: {
            RoomId: roomId,
            UserId: userId,
            StartDate: startDate,
            EndDate: endDate,
          },
        }
      )
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }
}
module.exports = RoomService;
