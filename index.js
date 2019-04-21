var express = require('express');
var path = require('path');
var app = express();
app.use(express.static('public'));
var request = require('request');
// app.set('views', __dirname + '/views');
// app.set('view engine', 'jade');
var accessKey = '';
var port = process.env.PORT || 3000;
require('dotenv').config();

app.get("/", function(req, res) {
	var consumerKey = process.env.key;
  	var consumerSecret = process.env.secret;
	var bearerToken = 'Basic ' + new Buffer(consumerKey + ':' + consumerSecret).toString('base64');

	// rest api example
	var headerObject = {
		"Authorization": bearerToken,
		"Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'
	};

	var requestParams = {
		url: 'https://api.twitter.com/oauth2/token',
		qs: {
			grant_type: 'client_credentials'
		},
		headers: headerObject,
		method: 'POST',
	};

	request(requestParams, function(error, response, body) {
		accessKey = JSON.parse(body)['access_token']; }
	);

	res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.get('/search', function(req, res) {
	var text = req['query']['text'] + ' -filter:retweets exclude:replies';
	var data = [];
	var requestParams = {
		url: 'https://api.twitter.com/1.1/search/tweets.json',
		qs: { q: text, count : '100', lang: 'en' },
		headers: { "Authorization" : "Bearer " + accessKey },
		method: 'GET'
	};
	request(requestParams, function(error, response, body) {
		var tweets = JSON.parse(body)['statuses'];
		for (var i = 0; i < tweets.length; i++) {
			var URL;
			if (tweets[i]['entities']['urls'][0]) {
				URL = tweets[i]['entities']['urls'][0]['url'];
			} else {
				URL = undefined;
				var expression = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
				var regex = new RegExp(expression);
				var t = tweets[i]['text'];
				if (t.match(regex)) {
					URL = t.match(regex);
				} else {
					// console.log("No match");
				}
			}
			data.push({
				url : URL,
				text : tweets[i]['text'],
				name: "@" + tweets[i]['user']['screen_name'],
				followers : tweets[i]['user']['followers_count'],
				favorites : tweets[i]['favorite_count'],
				retweets: tweets[i]['retweet_count']
				});
		}
		res.json(data);
	});
});

app.listen(port, function() {
  console.log('listening on: ' + port);
});
