
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://todolist-db:eo4gPt2xqy4qaXdTmo9KMyhlJTErHhBa3Pj2HMrP0xNZThv4ffU4Byu9pTFeoxYhS5hvB6mrMMB3eUidFD6bwA%3D%3D@todolist-db.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@todolist-db@/todolistDB");

const itemsSchema = {
  name: String
};

const Item = mongoose.model("Item",itemsSchema);

const item1 = new Item({
  name:"Welcome to todolist"
});

const item2 = new Item({
  name:"Hit + to add new item"
});

const item3 = new Item({
  name:"tick the checkbox to delete that item"
});

const defaultitems=[item1,item2,item3];

app.get("/",function(req,res){

  var today  = new Date();
  var options = { weekday: 'long', day: 'numeric',month: 'long' };
  var day = today.toLocaleDateString("en-US", options);

  Item.find({},function(err,items){

    if (items.length===0){
      Item.insertMany(defaultitems,function(err){
          if (err){
            console.log(err);
          }else{
              console.log("Successfully added default items");
          }
          res.redirect("/");
      });
    }
    else{
      res.render("list",{kindofday:day,ListItems:items});
    }
  });

});

app.post("/",function(req,res){
  const item = req.body.newItem
  const additem = new Item({
    name: item
  });
  additem.save();
  res.redirect("/");

});

app.post("/delete",function(req,res){
  const checkbox_id = req.body.checkbox
  Item.deleteOne({_id:checkbox_id},function(err){
    if(err){
      console.log(err);
    }else{
      console.log("successfully deleted");
    }
  })
  res.redirect("/")
});

app.listen(8080,function(){
  console.log("Server started on port 8080");
});
