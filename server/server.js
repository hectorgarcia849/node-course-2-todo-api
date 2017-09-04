//external modules
var express = require('express');
var bodyParser = require('body-parser');

//local modules
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

//start configuring express
var app = express();

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



//create localhost for express application
app.listen(3000, () => {
    console.log('Started on port 3000')
});


//mongoose model for storing data


// var newTodo = new Todo({
//     text: 'Cook dinner',
//     completed: true,
//     completedAt: new Date().getMilliseconds()
// });
//
// newTodo.save() //saves to database and returns a promise
//     .then((doc) => { console.log('Saved:', doc)})
//     .catch((err) => console.log('Unable to save'));


var newUser = new User({
    email: 'hectorgarcia849@gmail.com'
});

newUser.save()
    .then((doc) => console.log('Saved User: ', doc))
    .catch((err) => console.log('Unable to save', err));
