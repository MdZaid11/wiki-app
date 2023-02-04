//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
mongoose.set('strictQuery', true)

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));
mongoose.connect('mongodb://127.0.0.1/wikiDB');
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Article = new mongoose.model('Article', articleSchema)
//////////////////////////request targetting all articles/////////
app.route('/articles')
  .get(function(req, res) {
    Article.find({}, function(err, foundItem) {
      if (!err) {
        res.send(foundItem)
      } else {
        res.send(err)
      }
    })
  })
  .post(function(req, res) {
    const userTitle = req.body.title
    const userContent1 = req.body.content
    const article = new Article({
      title: userTitle,
      content: userContent1
    })
    article.save(function(err) {
      if (!err) {
        res.send("succesfully data is added")
      } else {
        res.send('try again')
      }
    })
  })
  .delete(function(req, res) {
    Article.deleteMany({}, function(err) {
      if (!err) {
        res.send('successfully deleted all the items')
      } else {
        res.send(err)
      }
    })
  });
/////////////////////////////requets targetting a specific articles/////////
app.route('/articles/:customParam')
  .get(function(req, res) {
    const customParam = req.params.customParam
    console.log(customParam)
    Article.findOne({
      title: customParam
    }, function(err, foundItems) {
      if (!err) {
        if (foundItems) {
          res.send(foundItems)
        } else {
          res.send("Articles not found")
        }
      } else {
        res.send(err)
      }
    })
  })
  .put(function(req, res) {
    Article.updateOne(
      {
        title: req.params.customParam
      },
      {
        title:req.body.title,
        content:req.body.content
      },


      function(err) {
        if (!err) {
          res.send('succesfully updated')
         
        }
      }
    );
  })
  .patch(function(req,res){
    Article.update({title:req.params.customParam},{$set:req.body},
    function(err,rawResponse){
      if (!err){
        console.log(rawResponse)
       res.send("succesfully updated")

      }
    })
  })
  .delete(function(req,res){
    Article.deleteOne({title:req.params.customParam},function(err){
      if (!err){
        res.send("succesfully deleted articles")
      }
    })
  });
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
