//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// ---------> databaseCode
mongoose.connect("mongodb://localhost:27017/todolistdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your ToDoList"
});

const item2 = new Item({
  name: "Hit the + button to add a new item"
});

const item3 = new Item({
  name: "Hit this to delete an item"
});

const defaultItem = [item1, item2, item3];
//

// --------->

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItem, function(err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Work successful");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {
        newListItems: foundItems,
        listTitle: "toDoList"
      });
    }
  });
});

app.get("/work", function(req, res) {
  res.render("list", {
    listTitle: "Work List",
    newListItems: workItems
  });
});

app.get("/about", function(req, res) {
  res.render("about");
});


app.post("/", function(req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req, res) {
  const checkedItem = req.body.checkBox;
  Item.findByIdAndRemove(checkedItem, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("successfully removed");
      res.redirect("/");
    }
  });
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
