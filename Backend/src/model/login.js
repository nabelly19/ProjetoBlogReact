const mongoose = require('mongoose');
const { authorSchema } = require('./authorSchema');
const Login = mongoose.model('Login',
new mongoose.Schema({
author: {
type: authorSchema,
required: true
},
login: {
type: String,
required: true,
minlength: 3
},
password: {
type: String,
required: true,
minlength: 6
},
email: {
type: String,
required: true,
minlength: 6
},
createdAt: {
type: Date,
required: true
},
updatedAt: {
type: Date,
required: false
},
removedAt: {
type: Date,
required: false
},
})
)
module.exports = Login