//external modules
var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

//local modules
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

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


//create localhost for express application
app.listen(port, () => {
    console.log(`Started on port ${port}`)
});

module.exports = {app};
