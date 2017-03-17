'use strict';

const service = require('feathers-sequelize');
const patterns = require('./patterns-model');
const hooks = require('./hooks');

module.exports = function(){
  const app = this;

  const options = {
    Model: patterns(app.get('sequelize')),
    paginate: {
      default: 5,
      max: 25
    }
  };

  // Initialize our service with any options it requires
  app.use('/patterns', service(options));

  // Get our initialize service to that we can bind hooks
  const patternsService = app.service('/patterns');

  // Set up our before hooks
  patternsService.before(hooks.before);

  // Set up our after hooks
  patternsService.after(hooks.after);
};
