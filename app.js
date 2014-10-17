var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongo       = require('mongodb'),
    host        = "127.0.0.1",
    port        = mongo.Connection.DEFAULT_PORT,
    db          = mongo.Db("crud-operation", new mongo.Server(host, port, {}));
var app = express();

db.open(function (error) {
  console.log("We are connected! " + host + ":" + port);
  db.collection("people", function (error, collection) {
    people = collection;
  });  
})


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/", function (req, res) {
  people.find().toArray(function (error, data) {
    res.render("index.jade", {people: data})
  });  
});

app.post("/", function (req, res) {
  people.insert({name: req.body.name, job: req.body.job})
  res.redirect("/");
});

app.get("/update/:id", function (req, res) {
  people.findOne({_id: new mongo.ObjectID(req.params.id)}, function (err, data) {
    if (err) throw err;
    res.render("update.jade", {person: data})
  });
});

app.post("/update/:id", function (req, res) {
  people.update({_id: new mongo.ObjectID(req.params.id)},
                {name: req.body.name, job: req.body.job},
                function (err, data) {
                  if (err) throw err;
                  res.redirect("/");
                }
                )
});

app.get("/delete/:id", function (req, res) {
  people.remove({_id: new mongo.ObjectID(req.params.id)}, function (err, data) {
    if (err) throw err;
    res.redirect("/");
  });
});



module.exports = app;
