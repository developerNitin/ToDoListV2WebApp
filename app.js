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

const item = mongoose.model("item", itemsSchema);

const item1 = new item({
  name: "Welcome to your ToDoList"
});

const item2 = new item({
  name: "Hit the + button to add a new item"
});

const item3 = new item({
  name: "Hit this to delete an item"
});

const defaultItem = [item1, item2, item3];

// item.insertMany(defaultItem, function(err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("Work successful");
//   }
// });
// --------->

app.get("/", function(req, res) {

  res.render("list", {
    listTitle: day,
    newListItems: items
  });
});


app.post("/", function(req, res) {
  const item = req.body.newItem;

  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    res.redirect("/");
  }
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

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
