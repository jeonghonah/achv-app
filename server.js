var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
var redis = require('redis');

app.get('/', function(req, res){
  getRootpage(req, res);
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
  var username = req.params.username;
  if (!username)
    username = "나정호";

  var client = redis.createClient(6379, '127.0.0.1');
  client.on('connect', function() {
    console.log('redis connected');
  });

  client.get(username, function(err, reply) {
    /* Step1: get index.html */

    /* Step2: parse and process index.html */

    /* Step3: send the processed html */
		res.render('pages/index', {
			attend: reply 
		});
    //res.send(reply);
  });

  client.quit();
}
