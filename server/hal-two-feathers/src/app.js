'use strict';

const path = require('path');
const serveStatic = require('feathers').static;
const favicon = require('serve-favicon');
const compress = require('compression');
const cors = require('cors');
const feathers = require('feathers');
const configuration = require('feathers-configuration');
const hooks = require('feathers-hooks');
const rest = require('feathers-rest');
const bodyParser = require('body-parser');
const socketio = require('feathers-socketio');
const middleware = require('./middleware');
const services = require('./services');
const app = feathers();
var _ = require('underscore');
var counter = 0;

app.configure(configuration(path.join(__dirname, '..')));

app.use(compress())
  .options('*', cors())
  .use(cors())
  .use(favicon( path.join(app.get('public'), 'favicon.ico') ))
  .use('/', serveStatic( app.get('public') ))
  .use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .configure(hooks())
  .configure(rest())
  .configure(socketio())
  .configure(services)
  .configure(middleware);

module.exports = app;

const netcan = require('./service/NetcanService');

netcan.start(data => {
  if(data.indexOf("t101") == -1)
    console.log('Received: ' + data);
    if(data.indexOf("t0023") == 0){
      var service = app.service('devices');
      console.log(parseInt(data.toString().substring(5, 9), 16));
      service.get(parseInt(data.toString().substring(5, 9), 16)).then(result =>{
          if(result.state == 2 && parseInt(data.toString().substring(10,11), 16) == 1){
            service.patch(result.id, {state: 1});
          }
      });
    }
});

if(app.get("test_mode")){
  var devices = app.service("devices");
  setInterval(function(){
    devices.find({}).then(results =>{
      //console.log(results.data.length);
        for (var i = 0; i < results.data.length; i++){
          var device = results.data[i];
          var ON_OFF = 0;

          if(counter < 200){
              ON_OFF = (counter >> i) % 2;
            //}
          }


          console.log((counter >> i) % 2);
          if((counter >> i) % 2 != ((counter - 1) >> i) % 2)
            devices.patch(device.id, {state: (ON_OFF ? 2: 0)});
          //console.log("Device: " + device.id + " state: " + (ON_OFF ? 2: 0).toString());
        }
        counter++;
        console.log(counter);
      });
    }, 40);
}