
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB",
  { useNewUrlParser: true });

const itemSchema = {
  name: String
};
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "Welcome to your to do list!"
});
const item2 = new Item({
  name: "Hit the + button to add a new item."
});
const item3 = new Item({
  name: "<-- Hit this to delete an item."
});
const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemSchema]
};

const List = mongoose.model("list", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, results) {
    if (results.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        }
        else {
          console.log("Entries added");
          res.redirect("/");
        }
      });
    }
    res.render("list", { listTitle: "Today", newListItems: results }
    );
  });
});

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }

});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      }
      else {
        console.log("I will be deleting" + checkedItemId);
      }
      res.redirect("/")
    });
  }
  else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});


app.get("/:customlist", function (req, res) {
  const customlistname = req.params.customlist;
  List.findOne({ name: customlistname }, function (err, foundone) {
    if (!err) {
      if (!foundone) {
        //Create a new list
        const list = new List({
          name: customlistname,
          items: defaultItems
        });
        list.save();
        res.redirect("/" + customlistname);
      } else {
        //show an existing list
        res.render("list", { listTitle: foundone.name, newListItems: foundone.items });
      }
    }


  })
});
app.listen(3000, function () {
  console.log("Server started on port 3000");
});
