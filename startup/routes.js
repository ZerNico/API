const error = require('../middleware/error');
const auth = require('../routes/auth');
const builds = require('../routes/builds');
const devices = require('../routes/devices');
const recipes = require('../routes/recipes');
const versions = require('../routes/versions');

const bodyParser = require('body-parser');
const cors = require('cors');

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