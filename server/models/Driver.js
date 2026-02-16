const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Driver = sequelize.define('Driver', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    experience: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    rating: {
        type: DataTypes.FLOAT,
        defaultValue: 5.0
    },
    languages: {
        type: DataTypes.STRING,
        defaultValue: 'Azerbaijani'
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    isBlacklisted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    rides: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    specialties: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Driver;
