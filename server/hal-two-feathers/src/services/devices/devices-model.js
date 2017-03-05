'use strict';

// devices-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const devices = sequelize.define('devices', {
    id :{
      type: Sequelize.UUID,
      allowNull : false,
      primaryKey: true
    },
    relay_one:{
      type: Sequelize.INTEGER,
      allowNull : false
    },
    relay_two:{
      type: Sequelize.INTEGER,
      allowNull : false
    }
  }, {
    freezeTableName: true
  });

  devices.sync();

  return devices;
};
