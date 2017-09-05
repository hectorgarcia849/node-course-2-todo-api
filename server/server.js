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

//start configuring express
var app = express();
const port = process.env.PORT || 3000;

//middle-ware
app.use(bodyParser.json()); //allows us to send jsons through requests to our express application

app.post('/todos', (req, res) =>{
    console.log(req.body);
    var todo = new Todo({
        text: req.body.text
    });

    todo.save()
        .then((doc) => {
            res.send(doc);
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos', (req, res) => {
    Todo.find()
        .then((todos) => {
            res.send({todos}); //sending back an object as opposed to an array makes things more flexible
        }, (e) => {
            res.status(400).send(e);
        });
});

app.get('/todos/:id', (req, res) => {
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        return res.status(404).send();
    }
    Todo.findById(id).then(
        (todo) => {
            if(!todo){
                return res.status(404).send(); //object id is valid but not in the collection
            }
            res.send({todo});},
        (e) => {
            res.status(400).send()
        });
});

app.delete('/todos/:id', (req, res) => {
    var id = req.params.id;

    if (!ObjectID.isValid(id)) {
        res.status(404).send();
    }

    Todo.findByIdAndRemove(id)
        .then(
            (todo) => {
                if (!todo) { //if we get no response check is necessary because a valid id that is not found will just return a null doc
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

app.patch('/todos/:id', (req, res) => {
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
    Todo.findByIdAndUpdate(id, {$set:body}, {new: true}).then((todo) => { //$set is a mongoDB operator, new set to true ensures we get the updated document back
            if(!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        }).catch((e) => {
            res.status(400).send();
    });

});



//create localhost for express application

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
});

module.exports = {app};
