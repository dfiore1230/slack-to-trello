var express = require('express');
var bodyParser = require('body-parser');
var Trello = require('node-trello');
var trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

function postToTrello(listId, command, text, user_name, cb) {
  if (text == undefined || text == null || text == "") {
    throw new Error('Format is ' + command + ' name | description(optional)');
  }

  var name_and_desc = text.split('|');

	var card_data = {
		'name' : name_and_desc.shift() + ' (@' + user_name + ')',
		'desc' : name_and_desc.shift(),
    'list_name' : name_and_desc.shift()
	};

	trello.post('/1/lists/' + listId + '/cards', card_data, cb);
}

var list_id = null;

function list_check() {
  if (list_name == blog) {
      var list_id = '5670696fa98d9db94c818c5a';
      alert('list id set to 5670696fa98d9db94c818c5a');
    }
  else if (list_name == done) {
      var list_id = '5670696d37e05b451fe05482';
      alert('list id set to 5670696d37e05b451fe05482');
    }
}

app.post('/*', function(req, res, next) {
  //var listId = req.params[0];
  var listId = list_id;
  var command = req.body.command,
  text = req.body.text,
  user_name = req.body.user_name;

  postToTrello(listId, command, text, user_name, function(err, data) {
    if (err) throw err;
    console.log(data);

    var name = data.name;
    var url = data.shortUrl;

    res.status(200).send('Card "' + name + '" created here: <' + url + '>');
  });
});

// test route
app.get('/', function (req, res) { res.status(200).send('SupportKit.io loves Slack and Trello!') });

// error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(400).send('Error: ' + err.message);
});

app.listen(port, function () {
  console.log('Started Slack-To-Trello ' + port);
});
