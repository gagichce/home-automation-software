'use strict';

const service = require('feathers-sequelize');
const rooms = require('./rooms-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: rooms(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/rooms', service(options));

  // Get our initialize service to that we can bind hooks
  const roomsService = app.service('/rooms');

  // Set up our before hooks
  roomsService.before(hooks.before);

  // Set up our after hooks
  roomsService.after(hooks.after);
};
