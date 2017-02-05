var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/heartbeat', function(req, res, next) {
  res.json(true);
});

/* GET users listing. */
router.get('/:device/:relay/:state', function(req, res, next) {
	var command = "t00180" + req.params.device + "0000000000000"; 
	"2\r";

  res.json(true);
});

module.exports = router;
