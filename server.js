var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	yelp = require('yelp'),
	mongoose = require('mongoose');

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
 
yelp.createClient({
  consumer_key: 'gvjfYaKyGq4oyYi4okZcEQ', 
  consumer_secret: 'VsJ84wbtvPzFil2crodvww2MA4w',
  token: '9nOouMy-sbOd2vlN15LLy_vf-i4X7ogd',
  token_secret: 'sqdtansnrG6p-WYwdLfh_73AnFI'
});
 
// See http://www.yelp.com/developers/documentation/v2/search_api 
app.get('http://localhost3000/search', function (req,res){
	yelp.search({term: 'food', location: 'Montreal'}, function (error, data) {
	  res.json(data.businesses)
	  console.log(error);
	  console.log(data.businesses);
	});
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
