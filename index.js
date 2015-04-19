require('dotenv').load();
require('babel/register')({
  stage: 0
});
var app = require('./server');

// Database Configuration
var Waterline = require('waterline');
var User = require('./models/User');
var Token = require('./models/Token');
var Project = require('./models/Project');
var Tag = require('./models/Tag');
var config = require('./config');

var ORM = new Waterline();

ORM.loadCollection(User);
ORM.loadCollection(Token);
ORM.loadCollection(Project);
ORM.loadCollection(Tag);

ORM.initialize(config, function (err, models) {
  if (err) throw err;

  app.models = models.collections;
  app.connections = models.connections;

  app.listen(8000);
  console.log('Server is listening on http://localhost:8000');
});
