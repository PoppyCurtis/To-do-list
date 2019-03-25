const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs')

app.get("/", function(req, res) {
    var today = new Date();
    var day = "";
    var weekdays= ["Sunday", "Monday", "Tuesday", "Wednesday",
    "Thursday", "Friday", "Saturday"];
    day = weekdays[today.getDay()];
    res.render("list", {dayOfTheWeek: day});
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});