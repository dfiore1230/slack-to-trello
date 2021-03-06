var express = require('express');
var bodyParser = require('body-parser');
var Trello = require('node-trello');
var trello = new Trello(process.env.TRELLO_KEY, process.env.TRELLO_TOKEN);

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

var card_data;
var list_id;
var listName;

function postToTrello(listId, command, text, user_name, cb) {
  if (text == undefined || text == null || text == "") {
    throw new Error('Format is ' + command + ' name | description(optional) | list name');
  }

  var name_and_desc = text.split('|');

	card_data = {
		'name' : name_and_desc.shift() + ' (@' + user_name + ')',
		'desc' : name_and_desc.shift(),
    'list_name' : name_and_desc.shift()
	};

  //throw new Error('List name is ' + card_data.list_name + 'something');

  if (card_data.list_name == undefined) {
    // If none set, default to blog
    listName = '5670696fa98d9db94c818c5a';
  }
  else if (card_data.list_name == blog) {
    listName = '5670696fa98d9db94c818c5a';
  }
  else if (card_data.list_name == done ) {
    listName = '5670696d37e05b451fe05482';
  }

  throw new Error('List name is ' + listName);

	trello.post('/1/lists/' + listId + '/cards', card_data, cb);
}

app.post('/*', function(req, res, next) {
  var listId = req.params[0];
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
