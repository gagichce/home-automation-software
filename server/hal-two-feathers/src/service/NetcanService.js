const feathers = require('feathers');
const configuration = require('feathers-configuration')
const path = require('path');
const app = feathers()
  .configure(configuration(path.join(__dirname, '../..')));



var net = require('net');
var DEVELOP = app.get('development_mode');
var TEST = app.get('test_mode');
var _ = require('underscore');

var client = new net.Socket();
var counter = 0;
//generates the message which would be sent to the NETCAN device
var generateStateChangeMessage = function(device){
  var value = device.state;

  var command = "t0013" + decimalToHex(device.id, 4) + "0" + value.toString();

  return command + "\r";
};

var start = function(handleData){
  if(!DEVELOP){
    client.connect(2001, app.get('remote_ip_address'), function() {
    	console.log('Connected');

    });

    client.on('data', function(data) {
      handleData(data);
    });

    client.on('close', function() {
    	console.log('Connection closed');
    });
  }

  if(TEST){ //setup test loop
    // setInterval(function(){
    //   // var newDeviceState = state.getDevices();

    //   // if(counter < 100) {
    //   //   if((counter >> 4) % 2) {
    //   //     newDeviceState[0].relay_one = counter % 2;
    //   //     newDeviceState[0].relay_two = counter % 2;
    //   //     newDeviceState[1].relay_one = counter % 2;
    //   //     newDeviceState[1].relay_two = counter % 2;
    //   //   } else {
    //   //     newDeviceState[0].relay_one = (counter >> 0) % 2;
    //   //     newDeviceState[0].relay_two = (counter >> 1) % 2;
    //   //     newDeviceState[1].relay_one = (counter >> 2) % 2;
    //   //     newDeviceState[1].relay_two = (counter >> 3) % 2;
    //   //   }
    //   //   counter++;
    //   //   state.setDevices(newDeviceState);
    //   //}
    // }, 500);
  }
}
var update = function(device){
  command = generateStateChangeMessage(device);
  console.log(command);
  if(!DEVELOP){
    // console.log('writing: ' + command);
    client.write(command);
  }
};

function decimalToHex(d, padding) {
    var hex = Number(d).toString(16);
    padding = typeof (padding) === "undefined" || padding === null ? padding = 2 : padding;

    while (hex.length < padding) {
        hex = "0" + hex;
    }

    return hex;
}

module.exports.start = start;
module.exports.update = update;