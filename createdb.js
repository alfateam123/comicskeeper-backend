var sqlite3 = require("sqlite3").verbose();
var path = require("path");
var fs = require("fs");

function main() {
  fs.unlinkSync("comicskeeper.db");
  var db = new sqlite3.Database("comicskeeper.db");

  var content = fs.readFileSync("comicskeeper.json");
  var doc = JSON.parse(content);

  db.serialize(function(){
    db.run("CREATE TABLE books (series TEXT, volume_number INTEGER, image TEXT)");

    var stmt = db.prepare("INSERT INTO books VALUES ($series, $number, $url)");

    doc.forEach(book => {
      stmt.run({
        $series: book.series,
        $number: book.number,
        $url: "/images/"+book.image
      });
    });

    stmt.finalize();
  });
}

main();
