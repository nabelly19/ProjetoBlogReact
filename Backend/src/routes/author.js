const express = require('express');
const AuthorController = require('../controller/AuthorController');
const route = express.Router();
route
.post('/author', AuthorController.create)
.get('/author')
module.exports = route;