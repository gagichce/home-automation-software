'use strict';

// devices-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
var rooms = require('../rooms/rooms-model');
const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const devices = sequelize.define('devices', {
    id :{
      type: Sequelize.UUID,
      allowNull : false,
      primaryKey: true
    },
    state:{
      type: Sequelize.INTEGER,
      allowNull : false
    },
    roomId:{
      type: Sequelize.UUID,
        references: {
          model: 'rooms',
          key : 'id'
        }
    },
    name:{
      type: Sequelize.STRING,
      allowNull : false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        devices.belongsTo(models.rooms);
      },
    }
  });
  devices.sync();

  return devices;
};
