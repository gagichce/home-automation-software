var express = require('express');
var router = express.Router();
var state = require('../services/StateService');

/* GET users listing. */
router.get('/heartbeat', function(req, res, next) {
  res.json(true);
});

/* GET users listing. */
router.get('/:device/:relay/:state', function(req, res, next) {
	state.updateState(
	{
		id: parseInt(req.params.device),
		relay: req.params.relay,
		state: parseInt(req.params.state)
	});
	console.log("test");
  res.json(true);
});

router.get('/current-state', function(req, res, next) {
  res.json(state.getDevices());
});

module.exports = router;
