const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true, //checks if email is unique in db
        validate:{
            validator: (value) => {
                //uses the validator npm package
                return validator.isEmail(value);
            },
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type:  String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

//define instance methods, note can't use () => arrow function, they don't bind to 'this'
UserSchema.methods.generateAuthToken = function() {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();

    user.tokens.push({access, token});
    return user.save()
        .then(() => {return token});
};

UserSchema.methods.toJSON = function() { //overrides the default toJSON method to remove sensitive information
    var user = this;
    var userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.statics.findByToken = function(token){
    var User = this; //model method
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
    } catch(e) {
        return Promise.reject();
    }

    return User.findOne({'_id':decoded._id, 'tokens.token': token, 'tokens.access': 'auth'});
};

UserSchema.pre('save', function (next) { //pre runs code before an event, in this case we are defining code to run before the save event if the password is modified
    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
                });
            });

    } else {
        next();
    }
});

var User = mongoose.model('User', UserSchema);

module.exports = {
    User
};