const {MongoClient, ObjectID} = require('mongodb'); //identical to : const MongoClient = require('mongodb').MongoClient; uses object destructuring

//can create own ObjectIDs with ObjectID module
// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if(err){
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').insertOne({
        text: "Something to do",
        completed: "false"
    }, (err, result) =>{
        if(err){
            return console.log('Unable to insert todo', err);
        }
        console.log(result.ops); //ops contains all the documents inserted
        //console.log(result.ops[0]._id.getTimestamp()); //time stamp encoded in id means we don't need an object creation property

    });

    db.close();
});
