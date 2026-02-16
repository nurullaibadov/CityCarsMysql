const User = require('./User');
const Car = require('./Car');
const Driver = require('./Driver');
const Booking = require('./Booking');
const Contact = require('./Contact');
const News = require('./News');

// Define associations
User.hasMany(Booking, { foreignKey: 'userId' });
Booking.belongsTo(User, { foreignKey: 'userId' });

Car.hasMany(Booking, { foreignKey: 'carId' });
Booking.belongsTo(Car, { foreignKey: 'carId' });

Driver.hasMany(Booking, { foreignKey: 'driverId' });
Booking.belongsTo(Driver, { foreignKey: 'driverId' });

module.exports = {
    User,
    Car,
    Driver,
    Booking,
    Contact,
    News
};
