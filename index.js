var express = require("express");

var app = express();

app.use(function(req, res, next) {
	  res.header("Access-Control-Allow-Origin", "*");
	  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	  next();
});


app.get("/", (req, res) => res.send("Hello World"));

app.get("/books", (req, res) => {
  res.send([
		{title: "The Man in the High Castle"},
		{title: "The Man in the Medium Castle"},
		{title: "The Man in the Low Castle"},
		{title: "The Man in the High Castle"},
		{title: "The Man in the Medium Castle"},
		{title: "The Man in the Low Castle"},
		{title: "The Man in the High Castle"},
		{title: "The Man in the Medium Castle"}
	]);
});

app.listen(3500, () => console.log("example app listening on port 3500!"));
