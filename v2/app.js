
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", 
{useNewUrlParser: true});

const itemSchema = {
  name: String
};
const Item = mongoose.model("Item", itemSchema );
const item1 = new Item ({
 name: "Welcome to your to do list!"
});
const item2 = new Item ({
 name: "Hit the + button to add a new item."
});
const item3 = new Item ({
 name: "<-- Hit this to delete an item."
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("list", listSchema);

app.get("/", function(req, res) {
  Item.find({}, function (err, results) {
    if (results.length === 0) {
      Item.insertMany(defaultItems, function(err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Entries added");
          res.redirect("/");
        }
      });
    }
    res.render("list", {listTitle: "Today", newListItems: results}
    );
  });
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item ({
    name: itemName
  })
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err) {
    if (err) {
      console.log(err);
    }
    else {
      console.log("I will be deleting" + checkedItemId);
    }
    res.redirect("/")
  });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.get("/:customlist", function(req, res) {
  const customlistname = req.params.customlist;
  const list = new List ({
    name: customlistname,
    items: defaultItems
  });
  list.save();
});
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
