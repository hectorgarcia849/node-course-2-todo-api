const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((result) => {
//     console.log(result);
// });

// Todo.findOneAndRemove({})
//     .then((result) => {
//
// });

Todo.findByIdAndRemove('59ae03001cd3a0c506bd5315')
    .then((todo) => {
        console.log(todo);
});