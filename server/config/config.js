var env = process.env.NODE_ENV || 'development'; //allows us to define our environment variables. If in node, process.env.NODE_ENV will be set.  If in test, it will also be set, done in package.json in test.
console.log('env *****', env);

if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if( env === 'test'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}