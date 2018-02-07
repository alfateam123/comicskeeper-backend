var sqlite3 = require("sqlite3").verbose();
var path = require("path");
var fs = require("fs");
var gm = require("gm").subClass({imageMagick: true});

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
        gm(imagePath)
          .resize(3, 3)
          .colors(1)
          .toBuffer("JPEG", function(error, buffer) {
            const b64Buffer = buffer.toString('base64');
            resolve("data:image/jpeg;base64,"+b64Buffer);
          });
      });
      dominantColorPromise.then((b64DominantColor) => {
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
