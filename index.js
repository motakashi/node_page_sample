const express = require('express');
// const bodypaser = require('body-paser');
// const session = require('express-session');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const session = require('express-session');
// const moment = require('moment');
// const uuid = require('uuid');

// const SALT_ROUNDS = 10;

// DBの接続情報
const port = 8000
const db = mysql.createConnection({
  host: 'localhost',
  user: 'nodesample',
  password: 'Node-007',
  database: 'nodesample'
});

var app = express();
app.use(express.static('./static'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({secret:'abcdefgh', resave:false, saveUnintialized:false}));

app.set('view engine', 'ejs');
app.set('views', './views');

// トップページ
app.get('/', function(req, res){
  res.render("index");
});

// ユーザ登録画面
app.get('/regist', function(req, res){
  res.render("regist");
});

// DBセッションの接続
db.connect(function(err) {
	if (err) {
    console.log('DBの接続に失敗しました');
    throw err;
  };
	console.log('DBが接続されました');
  app.listen(8000, function(){
    console.log("サーバを起動しました");
  })
});

