const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'hector@example.com',
    password:'user1pass',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'abc123').toString()
    }]},
    {
        _id: userTwoId,
        email: 'hektor@example.com',
        password:'user2pass',
        tokens: [{
            access: 'auth',
            token: jwt.sign({_id: userTwoId, access: 'auth'}, 'abc123').toString()
        }]
    }
];

const todos = [
    {_id: new ObjectID(), text: "First test todo", _creator: userOneId},
    {_id: new ObjectID(), text: "Second test todo", completed: true, completedAt: new Date().getTime(), _creator: userTwoId}];

const populateTodos = (done) => { //adds the todos for each test, but when test is done clears the database
    Todo.remove({})
        .then(() => Todo.insertMany(todos))
        .then(() => done())
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        //add users in a way that hashes passwords
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        //to make sure both save promises succeed before proceeding
        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};