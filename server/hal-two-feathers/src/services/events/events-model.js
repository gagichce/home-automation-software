'use strict';

// events-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const events = sequelize.define('events', {
    id :{
      type: Sequelize.INTEGER,
      allowNull : false,
      primaryKey: true
    },
    deviceId:{
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
          model: 'devices',
          key : 'id'
        }
    },
    currentStatus:{
      type: Sequelize.INTEGER,
      allowNull : false
    },
    previousStatus:{
      type: Sequelize.INTEGER,
      allowNull : false
    },
    flags:{
      type: Sequelize.INTEGER,
      allowNull : false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        events.belongsTo(models.devices);
      },
    }
  });

  events.sync();

  return events;
};
