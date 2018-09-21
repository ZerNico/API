const cors = require('cors');
const bodyParser = require('body-parser');
const recipes = require('../routes/recipes');
const builds = require('../routes/builds');
const devices = require('../routes/devices');
const versions = require('../routes/versions');
const auth = require('../routes/auth');
const error = require('../middleware/error');

module.exports = function(app) {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use('/api/recipes', recipes);
  app.use('/api/builds', builds);
  app.use('/api/devices', devices);
  app.use('/api/versions', versions);
  app.use('/api/auth', auth);
  app.use(error);
};