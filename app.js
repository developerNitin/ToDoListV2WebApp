//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

// ---------> databaseCode
mongoose.connect("mongodb+srv://nitinbirdi:nitin12345@cluster0-ac5mj.mongodb.net/todolistdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//     ---------> itemsSchema
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
//     ---------> listSchema
const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);
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
        listTitle: "ToDoList"
      });
    }
  });
});

app.get("/:customListName", function(req, res) {
  const listName = _.capitalize(req.params.customListName);

  List.findOne({
    name: listName
  }, function(err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: listName,
          items: defaultItem,
        });
        list.save();
        console.log("newOneCreated");
        res.redirect("/" + listName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items
        });
      }
    }
  });
});

app.post("/", function(req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });
  if (listName == "ToDoList") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({
      name: listName
    }, function(err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function(req, res) {
  const checkedItem = req.body.checkBox;
  const listName = req.body.listName;

  if (listName === "ToDoList") {
    Item.findByIdAndRemove(checkedItem, function(err) {
      if (!err) {
        console.log("successfully removed");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({
      name: listName
    }, {
      $pull: {
        items: {
          _id: checkedItem
        }
      }
    }, function(err, foundList) {
      if (!err) {
        res.redirect("/" + listName);
      }
    });
  }
});

const port = process.env.PORT;
app.listen(port || 3000, function() {
  console.log("Server started on port 3000");
});
