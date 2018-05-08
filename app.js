var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var cors = require('cors');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/multiChat');

var index = require('./routes/index');
var chats = require('./routes/chats');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

app.use('/', index);
app.use('/chats', chats);


var port = 3001;
app.listen(port, ()=>
{console.log("server start at port:", port)})
module.exports = app;
