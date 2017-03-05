'use strict';

const service = require('feathers-sequelize');
const devices = require('./devices-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: devices(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/devices', service(options));

  // Get our initialize service to that we can bind hooks
  const devicesService = app.service('/devices');

  // Set up our before hooks
  devicesService.before(hooks.before);

  // Set up our after hooks
  devicesService.after(hooks.after);
};
