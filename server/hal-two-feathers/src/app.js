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