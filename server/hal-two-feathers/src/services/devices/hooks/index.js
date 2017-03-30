'use strict';

const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');
const netcan = require('../../../service/NetcanService');
const netcanHook = options => {
  return hook => {
    return new Promise(function(resolve, reject) {
      netcan.update({state: hook.data.state, id : hook.id});
      return resolve(hook);
    });
  };
};
const myHook = options => { // always wrap in a function so you can pass options and for consistency.
  return hook => {

    //netcan.update({state: hook.data.state, id : hook.id});
    
    if(hook.app.get('development_mode')){
      if(hook.data.state == 2){
        var service = hook.app.service('/devices');
        //service.emit('updated', { status: 'updated' });
        return new Promise(function(resolve, reject) {
            setTimeout(function(){
              console.log("waited 2 seconds for this device: ", hook.id);
              if(Math.random() > 0.9){
                service.patch(hook.id, {state: 3});
              } else {
                service.patch(hook.id, {state: 1});
              }
           }, 750);
          return resolve(hook);
        });
      }
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
  patch: [netcanHook(), myHook()],
  remove: []
};
