const express = require('express');
const util = require('util');
// const bodypaser = require('body-paser');
// const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
// const moment = require('moment');
// const uuid = require('uuid');

const SALT_ROUNDS = 10;

// DBの接続情報
const port = 8000
const db = mysql.createConnection({
  connectionLimit: 10,
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

app.post('/regist', async function(req, res){
  try{
    // パスワードのハッシュ化
    var hash = await bcrypt.hash(req.body.password, SALT_ROUNDS);
    
    // データの挿入
    db.query = util.promisify(db.query);
    const addNewUserSql = "INSERT INTO users SET ?";
    await db.query(addNewUserSql, { mail: req.body.mail, password: hash });
    db.end();
    res.render("regist");
    console.log("NewUser: { mail: " + req.body.mail+ ", password: " + hash + "}");
  } catch(err) {
    if (err.code === "ER_DUP_ENTRY"){
      res.render("regist", {error: "既に登録されているメールアドレスです"});
    }
    console.log("既に登録されているメールアドレス");
  };
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

