const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/ToDoApp', (err, db) => {
    if(err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    // db.collection('Todos')
    //     .findOneAndUpdate(
    //         {_id: new ObjectID("59accec2ee41409b835a1de7")},
    //         {$set:{completed:false}},
    //         {returnOriginal: false}) //update operators can be found at mongodb site as opposed to the mongodb for node github docs.  You pass an object with the operator, in this example $set is used
    //     .then((result) => {
    //         console.log(result);
    //     });

    // db.collection('Todos')
    //     .insertOne({text:"Walk cat", completed: false})
    //     .then((result) => {console.log(result)});

    db.collection('Todos')
        .findOneAndUpdate(
            {_id: new ObjectID('59ace6b0aee61b26e0556e70')},
            {$set: {text: "Walk doggie"}},
            {returnOriginal: false})
        .then((result) => console.log(result));

    //db.close();
});