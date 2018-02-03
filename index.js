var express = require("express");
var sqlite3 = require("sqlite3").verbose();

// config
const LOCALHOST_IP = "localhost";
const PORT = 3500;

// startup checks
var isEnvProduction = process.env.NODE_ENV === "production";

// db setup
// hint: to create the database, follow db setup instructions in the README
var db = new sqlite3.Database("comicskeeper.db");
var app = express();

if(!isEnvProduction){
  // if NODE_ENV is not production, enable CORS
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  // use express.static to serve images - in production it'll be handled by nginx
  app.use("/images", express.static("images"));
}

if(isEnvProduction){
  app.get("/api/books", (req, res) => {
    db.all("SELECT * FROM books", (err, data) => {
      res.send(data);
    });
  });
}
else {
  app.get("/api/books", (req, res) => {
    db.all("SELECT * FROM books", (err, data) => {
      data.forEach(d => d.image = "http://"+LOCALHOST_IP+":"+PORT+d.image);
      res.send(data);
    });
  });
}

app.listen(PORT, () => console.log("app listening on port "+PORT));
