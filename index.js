var express = require("express");
var sqlite3 = require("sqlite3").verbose();

// db setup
var db = new sqlite3.Database(':memory:');
db.serialize(function(){
  db.run("CREATE TABLE books (title TEXT, series TEXT, volume_number INTEGER)");

  var stmt = db.prepare("INSERT INTO books VALUES ($title, $series, $number)");

  stmt.run({$title: "Knights of Sidonia #1", $series: "Knigths of Sidonia", $number: 1});
  stmt.run({$title: "Knights of Sidonia #2", $series: "Knigths of Sidonia", $number: 2});
  stmt.run({$title: "Serenity Rose - Kickstarter edition",
            $series: "Serenity Rose", $number: 0});
  stmt.run({$title: "Spice and Wolf #1", $series: "Spice and Wolf", $number: 1});
  stmt.run({$title: "Spice and Wolf #2", $series: "Spice and Wolf", $number: 2});

  stmt.finalize();
});

// app configuration
var app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/", (req, res) => res.send("Hello World"));

app.get("/books", (req, res) => {
  db.all("SELECT * FROM books", (err, data) => {
    res.send(data);
  });
});

app.listen(3500, () => console.log("example app listening on port 3500!"));
