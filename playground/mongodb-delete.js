const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //deleteMany
    // db.collection('Todos')
    //     .deleteMany({text: 'Eat Lunch'})
    //     .then((result) => console.log(result));
    // //deleteOne, deletes first item that meets the criteria
    db.collection('Todos')
        .deleteOne({text: "Something to do"})
        .then((result) => console.log(result));


    //findOneAndDelete, return the object that will be deleted then delete it
    db.collection('Todos')
        .findOneAndDelete({text: "Something else"})
        .then((result) => console.log(result, result.documents));


    //db.close();
});