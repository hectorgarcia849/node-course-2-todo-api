var  mongoose = require('mongoose');
var {dbUser} = require('./../../dbInfo');
var {dbPassword} = require('./../../dbInfo');


mongoose.Promise = global.Promise; //need to let mongoose know that you want to use default promises that come with es6
mongoose.connect(`mongodb://${dbUser}:${dbPassword}@ds123124.mlab.com:23124/node-course-todo` || 'mongodb://localhost:27017/TodoApp', {useMongoClient: true});

module.exports = { mongoose };
