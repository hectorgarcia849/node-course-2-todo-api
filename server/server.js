require('./config/config');

//external modules
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');


//local modules
const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

//start configuring express
var app = express();
const port = process.env.PORT || 3000;

//middle-ware
app.use(bodyParser.json()); //allows us to send jsons through requests to our express application

app.post('/todos', authenticate, (req, res) =>{
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save()
        .then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos', authenticate, (req, res) => {
    Todo.find({_creator: req.user._id})
        .then((todos) => {
            res.send({todos}); //sending back an object as opposed to an array makes things more flexible
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findOne({_id:id, _creator: req.user._id}).then(
        (todo) => {
            if(!todo){
                return res.status(404).send(); //object id is valid but not in the collection
            }
            res.send({todo});},
        (e) => {
            res.status(400).send()
        });
});

app.delete('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findOneAndRemove({_id:id, _creator: req.user._id})
        .then(
            (todo) => {
                if (!todo) { //check if we get null todo is necessary because a valid id that is not found will just return a null doc
                  res.status(404).send();
                }
                res.status(200).send({todo});
        })
        .catch(
            (e) => {
                res.status(400).send();
            });
});

//patch route is used to update todo items

app.patch('/todos/:id', authenticate, (req, res) => {
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']); //using lodash, takes an array of properties you want to pull off from the body, this is for security.  It ensures users can only update text and complete

    //checks if valid id
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    //given id is valid, checks body from req object if completed is type boolean (i.e. not null) and if it is true, if so, set completedAt else set completed to false.
    if(_.isBoolean(body.completed) && body.completed) { //if completed is a boolean and completed
        body.completedAt = new Date().getTime();
    } else {
        //if not a boolean and not true
        body.completed = false;
        body.completedAt = null;
    }

    //With body updated, now can update db
    Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set:body}, {new: true}).then((todo) => { //$set is a mongoDB operator, new set to true ensures we get the updated document back
            if(!todo) {
                return res.status(404).send();
            }
            console.log(todo);
            res.send({todo});
        }).catch((e) => {
            res.status(400).send();
    });

});


//POST /users
app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);

    user.save()
        .then(() => {
            return user.generateAuthToken()})
        .then((token) => {
            res.header('x-auth', token).send(user);})
        .catch((e) => {
            res.status(400).send(e);});
});

app.get('/users/me', authenticate, (req, res) => { //req.user gets decoded by authenticate middleware
    res.send(req.user);
});

app.post('/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    User.findByCredentials(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
            res.header('x-auth', token).send(user);
        });
    }).catch((e) => {
        res.status(400).send();
    });
});

//logout
app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }, () => {
        res.status(400).send();
    });
});



//create localhost for express application

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
