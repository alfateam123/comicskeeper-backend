var sqlite3 = require("sqlite3").verbose();
var path = require("path");
var fs = require("fs");
var colorThief = require("color-thief");

function main() {
  fs.unlinkSync("comicskeeper.db");
  var db = new sqlite3.Database("comicskeeper.db");

  var content = fs.readFileSync("comicskeeper.json");
  var doc = JSON.parse(content);

  db.serialize(function(){
    db.run("CREATE TABLE books (series TEXT, volume_number INTEGER, image TEXT, placeholder TEXT)");

    var stmt = db.prepare("INSERT INTO books VALUES ($series, $number, $url, $b64Placeholder)");

    doc.forEach(book => {
      var dominantColorPromise = new Promise(function(resolve, reject){
        var imagePath = "images/"+book.image;
        fs.readFile(imagePath, function(err, content){
          let ct = new colorThief();
          const result = ct.getColor(content);
          console.log("calculated dominant color for", imagePath);
          resolve(`rgb(${result[0]},${result[1]},${result[2]})`);
        });
      });
      dominantColorPromise.then((b64DominantColor) => {
        console.log("saving data for ", book.series, book.number, " in the database");
        stmt.run({
          $series: book.series,
          $number: book.number,
          $url: "/images/"+book.image,
          $b64Placeholder: b64DominantColor
        });
      });
    });
  });
}

main();
