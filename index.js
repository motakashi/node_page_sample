const express = require('express');
const util = require('util');
// const bodypaser = require('body-paser');
//const session = require('express-session');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const session = require('express-session');
// const moment = require('moment');
// const uuid = require('uuid');

const SALT_ROUNDS = 10;

// DBの接続情報
const db = mysql.createConnection({
  connectionLimit: 10,
  host: 'localhost',
  port: 3306,
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
    res.render("regist-successed");
    console.log("NewUser: { mail: " + req.body.mail+ ", password: " + hash + "}");
  } catch(err) {
    var errMessage;
    if (err.code === "ER_DUP_ENTRY"){
      errMessage = {error: "既に登録されているメールアドレスです"};
      console.log("既に登録されているメールアドレスが登録されようとしました");
    }else{
      errMessage = {error: "システムエラーにより登録に失敗しました"};
      console.log("【システムエラー】アドレス登録に失敗しました");
    }
    res.render("regist", {error: "既に登録されているメールアドレスです"});
    console.log(err);
  };
});

app.get('/login', function(req, res){
  res.render('login');
})

app.post('/login', function(req, res){
  try {
      var passwordGetSql = "select password from users where mail = '" + req.body.mail +"'";
      db.query(passwordGetSql, async function (err, result, fields) {
      if (err){throw err};

      // パスワードチェック
      var loginOK = false;
      if (result[0].password) {
        loginOK = await bcrypt.compare(req.body.password, result[0].password);
      };

      // マイページへ
      if (loginOK) {
        req.session.user_id = result._id;
        res.redirect("/");
      }
      else {
        var errMessage;
        errMessage = {
          error: "メールアドレスもしくはパスワードに誤りがあります"
        };
        res.render('login', errMessage);
      }
    });
  } catch(err){
    var errMessage;
    errMessage = {
      error: "システムエラーがありました"
    };
    res.render('login', errMessage);
    console.log('【システムエラー】ログインシステムにエラーがありました')
  }
})

// DBセッションの接続
db.connect(function(err) {
	if (err) {
    console.log('DBの接続に失敗しました');
    throw err;
  };
	console.log('DBが接続されました');
  app.listen(3000, function(){
    console.log("サーバを起動しました");
  })
});

