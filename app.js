const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://rhriday:poke@rhriday.2u5wv.mongodb.net/tuitionAtt", {useNewUrlParser: true,  useUnifiedTopology: true, useFindAndModify: false});

//database structure -->
const tuitionSchema = {
  name: String,
  date: String,
  payment: String
};
const Att = mongoose.model("Att", tuitionSchema);

// getting root page data
app.get("/", function(req, res){
  Att.find({}).sort({date:-1}).exec(function(err, data){
    res.render("home", {data: data});
  });
});

//entry deletion -->
app.get("/action", function(req, res){
  if(req.query.validation === process.env.VALID){
    console.log('Deleted this record:');
    const id = req.query.objId;
    Att.findByIdAndRemove(id, function(err, ent){
      if(err){
        console.log(err);
      }else{
        console.log(ent);
      }
    });
    res.redirect("/");
  }else{
    console.log(req.query.validation+" Tried Deleting a record");
    res.redirect("/");
  }
});

app.get("/:stdName", function(req, res){
  const stdName = req.params.stdName;
  const payDates = [];
  const startDate = [];
  Att.find({name:stdName}, function(err, found){
    found.forEach(function(item){
      if (item.payment === "ok") {
        payDates.push(item.date);
      }else if (item.payment === "start") {
        startDate.push(item.date);
      }
    });
    res.render("students", {
      name: stdName,
      info: found,
      startDate: startDate,
      payDates: payDates
    });
  });
});

//database entry -->
app.post("/", function(req, res){
  if(req.body.validation === process.env.VALID){
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
      }
    });
    res.redirect("/");
  }else{
    res.redirect("/");
  }
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 2000;
}
app.listen(port, function() {
  console.log("Server started");
});
