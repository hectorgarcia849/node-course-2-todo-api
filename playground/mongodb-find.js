const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

//     db.collection('Todos').find({_id: new ObjectID('59ac9cfd876b2d269824a31e')}).toArray().then((docs) => {
//         console.log('Todos');
//         console.log(JSON.stringify(docs, undefined, 2));
//     }).catch((err) => console.log('Unable to fetch todos', err)); //find() gets a pointer to the db
//
//     //db.close();
// });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log(`Todos count: ${count}`);
    // }).catch((err) => console.log('Unable to fetch todos', err)); //find() gets a Cursor object which is essentially a pointer to the db

    // db.collection('Todos')
    //     .find({text: "Something to do"})
    //     .toArray()
    //     .then((docs) => console.log(docs))
    //     .catch((err)=> console.log('Unable to fetch todos', err));


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