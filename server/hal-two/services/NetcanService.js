var net = require('net');
var state = require('./StateService');
var runtime = require('../helpers/RuntimeHelper');
var _ = require('underscore');

var client = new net.Socket();
var counter = 0;
//generates the message which would be sent to the NETCAN device
var generateStateChangeMessage = function(device){
    var value = 0;
  if(device.relay_one) value ++;
  if(device.relay_two) value += 2;

  var command = "t00180" + device.id.toString() + "0000000000000" + value.toString();

  return command + "\r";
};

var start = function(){
  if(!runtime.DEVELOP){
    client.connect(2001, process.env.npm_package_config_remote_ip_address, function() {
    	console.log('Connected');

    });

    client.on('data', function(data) {
    	//console.log('Received: ' + data);
    });

    client.on('close', function() {
    	console.log('Connection closed');
    });
  }

  if(runtime.TEST){ //setup test loop
    setInterval(function(){
      var newDevices = state.getDevices();

      if(counter < 100) {
        if((counter >> 4) % 2) {
          newDevices[0].relay_one = counter % 2;
          newDevices[0].relay_two = counter % 2;
          newDevices[1].relay_one = counter % 2;
          newDevices[1].relay_two = counter % 2;
        } else {
          newDevices[0].relay_one = (counter >> 0) % 2;
          newDevices[0].relay_two = (counter >> 1) % 2;
          newDevices[1].relay_one = (counter >> 2) % 2;
          newDevices[1].relay_two = (counter >> 3) % 2;
        }
        counter++;
        state.setDevices(newDevices);
      }
    }, 500);
  }

  state.onStateChange(function(e, data){
  	var devices = state.getDevices();
    console.log("=======\ncurrent state: " + JSON.stringify(devices) + "\n=======");
    	_.each(devices, function(device){

        command = generateStateChangeMessage(device);

        if(!runtime.DEVELOP){
          // console.log('writing: ' + command);
    		  client.write(command);
        }

    	})
  });
}

module.exports.start = start;