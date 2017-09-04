var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',
    {
        text: {
            type: String,
            required: true,
            minlength: 1,
            trim: true//trims off any leading or trailing whitespace
        },
        completed: {
            type: Boolean,
            default: false
        },
        completedAt: { //only filled if completed, we should expected completedAt to be null on creation
            type: Number,
            default: null
        }
    }
);

module.exports = {
    Todo
}