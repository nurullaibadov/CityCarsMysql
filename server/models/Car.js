const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Car = sequelize.define('Car', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 5.0
    },
    fuel: {
        type: DataTypes.STRING,
        defaultValue: 'Petrol'
    },
    transmission: {
        type: DataTypes.STRING,
        defaultValue: 'Automatic'
    },
    seats: {
        type: DataTypes.INTEGER,
        defaultValue: 4
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = Car;
