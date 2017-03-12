'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');

const myHook = options => { // always wrap in a function so you can pass options and for consistency.
  return hook => {
    if(hook.data.relay_one == 2){
      var service = hook.app.service('/devices');
      //service.emit('updated', { status: 'updated' });
      return new Promise(function(resolve, reject) {
          setTimeout(function(){
            console.log("waited 2 seconds for this device: ", hook.id);
            if(Math.random() > 0.9){
              service.update(hook.id, {relay_one: 3, relay_two: hook.data.relay_two});
            } else {
              service.update(hook.id, {relay_one: 1, relay_two: hook.data.relay_two});
            }
         }, 2500);
        return resolve(hook);
      });
    }

    return Promise.resolve(hook); // A good convention is to always return a promise.
  };
};

exports.before = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [],
  get: [],
  create: [],
  update: [myHook()],
  patch: [],
  remove: []
};
