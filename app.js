const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://rhriday:poke@rhriday.2u5wv.mongodb.net/tuitionAtt", {useNewUrlParser: true});

//database structure -->
const tuitionSchema = {
  name: String,
  date: String,
  payment: String
};
//database entry -->
const Att = mongoose.model("Att", tuitionSchema);

// getting root page data
app.get("/", function(req, res){
  Att.find({}).sort({date:-1}).exec(function(err, data){
    res.render("home", {data: data});
  });
});

app.get("/:stdName", function(req, res){
  const stdName = req.params.stdName;
  Att.find({name:stdName}, function(err, found){
    res.render("students", {
      name: stdName,
      info: found
    });
  });
})

app.post("/", function(req, res){
  const dataName = req.body.name;
  const dataDD = req.body.date;
  const dataPay = req.body.payment;
  const data = {
    name: dataName,
    date: dataDD,
    payment: dataPay
  }
  Att.create(data, function(err){
    if (err) {
      console.log(err);
    }else{
      console.log("Input success");
    }
  });
  res.redirect("/");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started");
});
