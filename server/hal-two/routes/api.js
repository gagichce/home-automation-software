var express = require('express');
var router = express.Router();
var state = require('../services/StateService');
var runtime = require('../helpers/RuntimeHelper');

/* GET users listing. */
router.get('/heartbeat', function(req, res, next) {
  res.json(true);
});

/* GET users listing. */
router.get('/:device/:relay/:state', function(req, res, next) {
	var newState = {
		id: parseInt(req.params.device),
		relay: req.params.relay,
		state: parseInt(req.params.state)
	};
    if(runtime.DEVELOP){
		console.log("API CALL WITH DATA: device: " + newState.id + ", relay: " + newState.relay + ", state: " + newState.state + ".");
	}
	state.updateState(newState);
  res.json(true);
});

router.get('/current-state', function(req, res, next) {
  res.json(state.getDevices());
});

module.exports = router;
