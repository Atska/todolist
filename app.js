const express = require("express");
const bodyParser = require("body-parser");
const getDate = require(__dirname + "/getDate.js");
const mongoose = require("mongoose");

// Settings - mongoose, EJS, body-parser, Express
mongoose.connect('mongodb://localhost:27017/listdb', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

// mongoDB Schemas - creating the Item class 
const todolistSchema = {
    text: String
};

const Item = mongoose.model("Item", todolistSchema);

// Initialize items for the database
const Item1 = Item({
    text: "Frühstücken"
});

const Item2 = Item({
    text: "Musik hören"
});

const StartItems = [Item1, Item2];

// Route "/"
app.get("/", function (req, res) {
    let day = getDate();
    // {} will find everythingg in Items
    Item.find({}, function (error, foundItems) {
        if (foundItems.length === 0) {
            Item.insertMany(StartItems, function (error) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Success. Saved items!");
                }
            });
            // Inserts the main items and redirects 
            res.redirect("/");
        } else {
            res.render("layout", {
                title: day,
                task: foundItems,
                header: "To Do List"
            });
        }
    });
});

// Adds items when push the submit button
app.post("/", function (req, res) {
    const itemName = req.body.NewTasks;

    const item = new Item({
        text: itemName
    });

    if (item.text === "") {
        res.redirect("/error");
    } else {
        item.save()
        res.redirect("/");
    }
});

// deletes item when you click on the checkbox
app.post("/delete", function (req, res) {
    const check = req.body.check;

    Item.findByIdAndRemove(check, function(error){
        if (error) {
            console.log(error);
        } else {
            console.log("Deleted successfully!")
            res.redirect("/");
        }
    });
});

/// Route Error
app.get("/error", function (req, res) {
    res.render("error");
});

// Listen
app.listen(3000, function () {
    console.log("App listening on port 3000.");
});