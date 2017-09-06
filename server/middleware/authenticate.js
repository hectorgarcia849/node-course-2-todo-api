var {User} = require('./../models/user');

var authenticate = (req, res, next) => {

    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if(!user){
            return Promise.reject();
        }
        //using this authenticate method as middleware we can change/modify the req object that gets passed through for authentication
        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        res.status(401).send();//401 auth required
    });
};

module.exports = {authenticate};