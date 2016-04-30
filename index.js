var express = require('express');
var app = express();
var request = require('request');
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
var accessKey = '';

app.get("/", function(req, res) {
	var consumerKey = '6oYlhphzgPhm04dkaAMvS5QtK';
  var consumerSecret = 'iiHIQE6y0uvSSTLs2Hi3JIQrGVLItCsqFNOqeSX3ZFkspE29bo';
	var bearerToken = 'Basic ' + new Buffer(consumerKey + ':' + consumerSecret).toString('base64');

	// rest api example
	var headerObject = {
		"Authorization" : bearerToken,
		"Content-Type" : 'application/x-www-form-urlencoded;charset=UTF-8'
	};

	var requestParams = {
		url : 'https://api.twitter.com/oauth2/token',
		qs: {
			grant_type: 'client_credentials'
		},
		headers: headerObject,
		method: 'POST',
	};

	request(requestParams, function(error, response, body) {
		accessKey = JSON.parse(body)['access_token']; }
	);

	res.render('index');
});

app.get('/search', function(req, res) {
	// var text = req['query']['text'];
	// var
	// var requestParams = {
	// 	url : 'https://api.twitter.com/1.1/search/tweets.json',
	// 	qs : {
	//
	// 	}.
	// 	headers:
	// }
});

app.listen(3000, function() {
	console.log('started server at htpp://localhost:3000');
});
