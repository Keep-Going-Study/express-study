var express = require('express');
var router = express.Router();

/* GET practice page. */
router.get('/', function(req, res, next) {
  res.render('prac', {time:Date()});
});

module.exports = router;
