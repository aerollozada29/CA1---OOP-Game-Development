console.log('Server-side code running');

const express = require('express');
const bodyparser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const app = express();

// serve files from the public directory
app.use(express.static('public'));

app.use(bodyparser.json());

// connect to the db and start the express server
let db;

// ***Replace the URL below with the URL for your database***
// const url =  'mongodb://user:password@mongo_address:mongo_port/clicks';
// E.g. for option 2) above this will be:
const url =  'mongodb://localhost:27017/score';

MongoClient.connect(url, (err, database) => {
  if(err) {
    return console.log(err);
  }
  db = database;
  // start the express web server listening on 8080
  app.listen(8080, () => {
    console.log('listening on 8080');
  });
});

// serve the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// add a document to the DB collection recording the click event
app.post('/score', (req, res) => {
  const score = {score: req.body.score};
  console.log(db);

  db.collection('score').save(score, (err, result) => {
    if (err) {
      return console.log(err);
    }
    console.log('score added to db');
    res.sendStatus(201);
  });
});

// app.put('/score', (req, res) => {
//   console.log('Data received: ' + JSON.stringify(req.body));
//   db.collection('score').update({}, req.body, {upsert: true}, (err, result) => {
//     if (err) {
//       return console.log(err);
//     }
//   });
//   res.sendStatus(200);
// });

app.get('/score', (req, res) => {
  db.collection('score').findOne({}, (err, result) => {
    if(err) return console.log(err);
    if(!result) return res.send({score:0});
    res.send(result);
  });
});

// get the click data from the database
app.get('/clicks', (req, res) => {

  db.collection('clicks').find().toArray((err, result) => {
    if (err) return console.log(err);
    res.send(result);
  });
});