class HotelService {
  constructor(db) {
    this.client = db.sequelize;
    this.Hotel = db.Hotel;
    this.Rate = db.Rate;
    this.User = db.User;
    console.log(db);
  }

  async create(name, location) {
    return this.Hotel.create({
      Name: name,
      Location: location,
    });
  }

  async get() {
    return this.Hotel.findAll({
      where: {},
    })
  }

  async getHotelDetails(hotelId, userId) {
    const hotel =  await this.Hotel.findOne({
        where: {
            id: hotelId
        },
        include: {
            model: this.User,
            through: {
                attributes: ['Value']
            }
        },
    });

    if (!hotel) {
      const notFoundError = new Error('Hotel not found');
      notFoundError.status = 404;
      throw notFoundError;
    }

    hotel.avg = hotel.Users.map(x => x.Rate.dataValues.Value)
                           .reduce((a, b) => a + b, 0) / hotel.Users.length;
    hotel.rated = hotel.Users.filter(x=> x.dataValues.id == userId).length > 0;
    return hotel
}

async makeARate(userId, hotelId, value) {
  try {
    const rate = await this.Rate.create({
      UserId: userId,
      HotelId: hotelId,
      Value: value,
    });

    return rate;
  } catch (error) {
    // Handle error, throw custom error if necessary
    throw new Error('Failed to create rate');
  }
}

async getBestRate() {
  return await this.Rate.findOne({
    order: [
      ['value', 'Desc']
    ]
  })
}

  async deleteHotel(hotelId) {
    return this.Hotel.destroy({
      where: { id: hotelId },
    });
  }
}
module.exports = HotelService;
