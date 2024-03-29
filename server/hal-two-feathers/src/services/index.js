'use strict';

const patterns = require('./patterns');

const events = require('./events');

const devices = require('./devices');
const rooms = require('./rooms');
const authentication = require('./authentication');
const user = require('./user');

const path = require('path');
const fs = require('fs-extra');
const Sequelize = require('sequelize');

module.exports = function() {
  const app = this;

  fs.ensureDirSync( path.dirname(app.get('sqlite')) );
  const sequelize = new Sequelize('feathers', null, null, {
    dialect: 'sqlite',
    storage: app.get('sqlite'),
    logging: false
  });
  app.set('sequelize', sequelize);

  app.configure(authentication);
  app.configure(user);
  app.configure(devices);
  app.configure(rooms);

  const models = sequelize.models;
  Object.keys(models)
    .map(name => models[name])
    .filter(model => model.associate)
    .forEach(model => model.associate(models));

  sequelize.sync();

  app.configure(events);
  app.configure(patterns);
};
