const winston = require('winston');

/* eslint-disable */
module.exports = function(err, req, res, next){
/* eslint-enable */
  winston.error(err.message, err);
  res.status(500).send(err.message);
};