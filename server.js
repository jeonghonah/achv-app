var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
})); 
var cookieParser = require('cookie-parser')
app.use(cookieParser())

var redis = require('redis');

app.get('/', function(req, res){
  getRootpage(req, res);
});

app.get('/user', function(req, res){
  getUserpage(req, res);
});

app.get('/hof', function(req, res){
  getHallpage(req, res);
});

app.get('/about', function(req, res){
  res.render('pages/about', {
  });
});

app.post('/_action', function(req, res){
  var year = 60 * 1000 * 60 * 24 * 365;
  if (req.body.username) res.cookie('username', req.body.username, { maxAge: year });
  res.redirect('back');
});

/* istanbul ignore next */
if (!module.parent) {
  app.listen(7700);
  console.log('Express started on port 7700');
}

///////////////////////////////////////////////////////////////////////////////
// root page template
///////////////////////////////////////////////////////////////////////////////
function getRootpage(req, res)
{
  var username = req.cookies.username;
  if (!username)
    username = "set your name";

  var client = redis.createClient(6379, '127.0.0.1');
  client.on('connect', function() {
    console.log('redis connected');
  });

  client.mget(["weekly_news", "notice"], function(err, vals) {

    var news = JSON.parse(vals[0]);
    var news_cnt = news.length;
    var notice = JSON.parse(vals[1]);
    var notice_cnt = notice.length;

    res.render('pages/index', {
      username: username, 
      news: news,
      news_cnt: news_cnt,
      notice: notice,
      notice_cnt: notice_cnt,
    });
  });

  client.quit();
}

///////////////////////////////////////////////////////////////////////////////
// user page template
///////////////////////////////////////////////////////////////////////////////
function getUserpage(req, res)
{
  var username = req.cookies.username;
  console.log("username:" + username);
  if (!username)
    username = "set your name";

  var client = redis.createClient(6379, '127.0.0.1');
  client.on('connect', function() {
    console.log('redis connected');
  });

  client.get(username, function(err, reply) {
		res.render('pages/user', {
			username: username, 
			attend: reply
		});
  });

  client.quit();
}

///////////////////////////////////////////////////////////////////////////////
// Hall of Fame page template
///////////////////////////////////////////////////////////////////////////////
function getHallpage(req, res)
{
  var username = req.cookies.username;
  console.log("username:" + username);
  if (!username)
    username = "set your name";

  var client = redis.createClient(6379, '127.0.0.1');
  client.on('connect', function() {
    console.log('redis connected');
  });

  client.get("halloffame", function(err, reply) {
		res.render('pages/hof', {
			username: username, 
			notice: reply /* html variable */
		});
  });

  client.quit();
}
