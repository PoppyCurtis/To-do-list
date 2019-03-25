const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.get("/", function(req, res) {
    var today = new Date();
    if (today.getDay() === 3) {
        res.write("<h1>It's Monday!</h1>");
        res.write("<p>Hello World</p>");
    }
    else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});