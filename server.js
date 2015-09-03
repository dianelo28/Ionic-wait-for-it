var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	yelp = require('node-yelp'),
	mongoose = require('mongoose');

var User = require("./models/user.js"),
	Comment = require("./models/comment.js"),
	Business = require("./models/business.js");

require('dotenv').load();

//connect to mongodb

mongoose.connect(
	process.env.MONGOLAB_URI ||
	process.env.MONGOHQ_URL ||
	'mongodb://localhost/wait'
);

//configure body-parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Request API access: http://www.yelp.com/developers/getting_started/api_access 
var client = yelp.createClient({
  oauth: {
    "consumer_key": "gvjfYaKyGq4oyYi4okZcEQ",
    "consumer_secret": "VsJ84wbtvPzFil2crodvww2MA4w",
    "token": "7NjtvVmufl24YsGtdxdea-Rf1oheC3hA",
    "token_secret": "-RQ_cdjn_Nthsn8gpE-qNimOdyM"
  }
});
 
// See http://www.yelp.com/developers/documentation/v2/search_api 

app.get('/api/search', function (req,res) {
	client.search({
	  terms: "Café de la presse",
	  location: "BELGIUM"
	}).then(function (data) {
	  var businesses = data.businesses;
	  var location = data.region;
	  res.json(businesses);
	  // ...  
	});
});

app.get("/testing", function(req, res) {
	res.send("working");
});

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('server started on localhost 3000');
});

// set location for static files
app.use(express.static(__dirname + '/www'));

// load public/index.html file (angular app)
app.get('*', function (req, res) {
  res.sendFile(__dirname + '/www/index.html');
});
