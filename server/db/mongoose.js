var  mongoose = require('mongoose');

mongoose.Promise = global.Promise; //need to let mongoose know that you want to use default promises that come with es6
mongoose.connect('mongodb://localhost:27017/TodoApp', {useMongoClient: true});

module.exports = { mongoose };
