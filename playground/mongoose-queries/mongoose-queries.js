const {ObjectID} = require('mongodb');

const {mongoose} = require('./../../server/db/mongoose');
const {Todo} = require('./../../server/models/todo');
const {User} = require('./../../server/models/user')

var id = '59adc667241d9a35a4af1fe6';

if(!ObjectID.isValid(id)){
    console.log('ID not valid');
}

Todo.find({
    _id: id
}).then((todos) => {
    console.log('Todos', todos);
}); //mongoose automatically creates a new ObjectID object with the id.  find() returns an array objects

Todo.findOne({ //recommended for finding one document by other than ID
    _id: id
}).then((todo) => {
    console.log('Todo', todo);
}); //find one finds first instance that matches query

Todo.findById(id) //recommended for finding one document by ID
    .then((todo) => {
    if(!todo){
        return console.log('Id not found'); //handling when no object with the queried id is found
    }
    console.log('Todo', todo);
}).catch((e) => console.log(e));

var uid = '59ada5fdba69240f4c567e61';

User.findById(uid)
    .then((user) => {
        if(!user){
            return console.log('User not found');
        }
        console.log('User', user);
    }).catch((e) => console.log(e));