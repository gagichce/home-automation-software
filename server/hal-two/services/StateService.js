var EventEmitter = require('events').EventEmitter;
var evt = new EventEmitter();
var _ = require('underscore');

var devices = [{id:1, relay_one: 0, relay_two:0 }, {id:2, relay_one: 0, relay_two:0 }];

module.exports = {
  getDevices: function(){
  	return devices;
  },
  updateState: function(data) {
    
    console.log("updating state: " + JSON.stringify(data))

    var device = _.find(devices, function(item) { return item.id === data.id});

    if(data.relay == "1")
    	device.relay_one = data.state;
    else if (data.relay == "2")
    	device.relay_two = data.state;

    evt.emit('myEvent', data);
  },
  onStateChange: function(handler) {
  	console.log(JSON.stringify(devices));
    evt.on('myEvent', handler);
  }
};