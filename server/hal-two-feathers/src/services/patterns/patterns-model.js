'use strict';

// patterns-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const patterns = sequelize.define('patterns', {
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
    pattern_text:{
      type: Sequelize.STRING,
      allowNull : false
    },
    pattern_rule:{
      type: Sequelize.STRING,
      allowNull : false
    },
    status:{
      type: Sequelize.INTEGER,
      allowNull : false
    }
  }, {
    freezeTableName: true,
    classMethods: {
      associate(models) {
        patterns.belongsTo(models.devices);
      },
    }
  });

  patterns.sync();

  return patterns;
};
