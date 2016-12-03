// Main starting point of the application
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const path = require('path');
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

var jsonParser       = bodyParser.json({limit:1024*1024*20, type:'application/json'});
var urlencodedParser = bodyParser.urlencoded({ extended:true,limit:1024*1024*20,type:'application/x-www-form-urlencoding' })

app.use(jsonParser);
app.use(urlencodedParser);
app.use(express.static(path.join(__dirname, 'assets')));
// Server Setup
const port = process.env.PORT || 3000;
const server = http.createServer(app);

var io = require('socket.io')(server);

// DB Setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/specker');

// App Setup
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json({ type: '*/*' }));
router(app, io);


server.listen(port);
console.log('Server listening on:', port);
