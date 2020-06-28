const express = require('express');

var app = express();
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function(req, res){
  res.render("index");
});

app.listen(8000, function(){
  console.log("サーバを起動しました");
})