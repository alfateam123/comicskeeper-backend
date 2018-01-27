var express = require("express");
var sqlite3 = require("sqlite3").verbose();
var path = require("path");

// startup checks
var isEnvProduction = process.env.NODE_ENV === "production";

// db setup
var db = null;
if(isEnvProduction){
  db = new sqlite3.Database("comicskeeper.db");
}
else {
  db = new sqlite3.Database(':memory:');
  db.serialize(function(){
    db.run("CREATE TABLE books (title TEXT, series TEXT, volume_number INTEGER, image TEXT)");

    var stmt = db.prepare("INSERT INTO books VALUES ($title, $series, $number, $url)");

    stmt.run({$title: "Knights of Sidonia #1", $series: "Knigths of Sidonia",
              $number: 1, $url: "/images/mpv-shot0001.jpg"});
    stmt.run({$title: "Knights of Sidonia #2", $series: "Knigths of Sidonia",
              $number: 2, $url: "/images/mpv-shot0002.jpg"});
    stmt.run({$title: "Serenity Rose - Kickstarter edition",
              $series: "Serenity Rose", $number: 0, $url: "/images/mpv-shot0003.jpg"});
    stmt.run({$title: "Spice and Wolf #1", $series: "Spice and Wolf",
              $number: 1, $url: "/images/mpv-shot0004.jpg"});
    stmt.run({$title: "Spice and Wolf #2", $series: "Spice and Wolf",
              $number: 2, $url: "/images/mpv-shot0005.jpg"});

    stmt.finalize();
  });
}

// app configuration
var app = express();


if(!isEnvProduction){
  // if NODE_ENV is not production, enable CORS
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  app.use("/images", express.static("images"));
}

app.get("/api/books", (req, res) => {
  db.all("SELECT * FROM books", (err, data) => {
    res.send(data);
  });
});


app.listen(3500, () => console.log("app listening on port 3500!"));
