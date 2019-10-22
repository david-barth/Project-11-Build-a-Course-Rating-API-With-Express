'use strict';

//Project 11: Course Rating API 


// load modules
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const jsonParser = require('body-parser').json;
const app = express();
const router = require('./routes/routes'); 


//Morgan and JSON Parsing Middleware: 

app.use(morgan('dev'));
app.use(jsonParser());



//Setting up Mongoose and db conneciton: 

mongoose.connect('mongodb://localhost:27017/course-api')

const db = mongoose.connection; 

db.on('error', (err) => {
  console.error('Sorry an error happened during connection', error)
});

db.once('open', () => {
  console.log('Successful database connection');
}); 


//Setting HTTP Headers: 

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); 
  res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
  if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE'); 
      return res.status(200).json({});
  }
  next();
});


// Set our port
app.set('port', process.env.PORT || 5000);



// Routes Middleware

app.use('/api', router); 


// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found'
  })
})

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message,
    error: {}
  });
});

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
