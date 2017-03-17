'use strict';

// rooms-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
var devices = require('../devices/devices-model');

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const rooms = sequelize.define('rooms', {
    id :{
      type: Sequelize.INTEGER,
      allowNull : false,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        rooms.hasMany(models.devices, {foreignKey : 'roomId'});
      },
    }
  });

  // Country.hasMany(City, {foreignKey : 'countryId', as: 'Cities'});
  // console.log(sequelize.model);
  rooms.sync();

  return rooms;
};
