const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const News = sequelize.define('News', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'Update'
    },
    author: {
        type: DataTypes.STRING,
        defaultValue: 'Admin'
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = News;
