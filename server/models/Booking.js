const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Booking = sequelize.define('Booking', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    carId: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    driverId: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    startDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    totalPrice: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'pending' // pending, confirmed, completed, cancelled
    },
    pickupLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    returnLocation: {
        type: DataTypes.STRING,
        allowNull: true
    },
    insurance: {
        type: DataTypes.STRING,
        defaultValue: 'basic'
    },
    gps: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    childSeat: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    additionalDriver: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pickupDate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    pickupTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    returnDate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    returnTime: {
        type: DataTypes.STRING,
        allowNull: true
    },
    paymentMethod: {
        type: DataTypes.STRING,
        defaultValue: 'card'
    }
});

module.exports = Booking;
