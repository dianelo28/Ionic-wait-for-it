var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	yelp = require('node-yelp'),
	mongoose = require('mongoose'),
	bcrypt = require('bcryptjs'),
	cors = require('cors'),
	jwt = require('jwt-simple'),
	moment = require('moment'),
	path = require('path'),
	request = require('request');

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
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//creating JWT token
function createToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    sub: user._id
  };

  return jwt.encode(payload, "tokenSecret");
}

function isAuthenticated(req, res, next) {
  if (!(req.headers.authorization)) {
    return res.status(400).send({ message: 'You did not provide a JSON Web Token in the Authorization header.' });
  }

  var header = req.headers.authorization.split(' ');
  var token = header[1];
  console.log(token)
  
  var payload = null;
  try{
  	payload = jwt.decode(token, "tokenSecret");
  }
  catch (err){
  	return res.status(401).send({message: err.message});
  }
  console.log(payload)
  var now = moment().unix();

  if (payload.exp <= now) {
    return res.status(401).send({ message: 'Token has expired.' });
  }

  User.findById(payload.sub, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User no longer exists.' });
    }

    req.user = payload.sub;
    next();
  })
}

app.get('/protected', isAuthenticated, function(req, res) {
  // Prints currently signed-in user object
  console.log(req.user);
});

app.post('/auth/login', function(req, res) {
  User.findOne({ email: req.body.email }, '+password', function(err, user) {
    if (!user) {
      return res.status(401).send({ message: { email: 'Incorrect email' } });
    }

    bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
      if (!isMatch) {
        return res.status(401).send({ message: { password: 'Incorrect password' } });
      }

      user = user.toObject();
      delete user.password;

      var token = createToken(user);
      res.send({ token: token, user: user });
    });
  });
});

app.post('/auth/signup', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, existingUser) {
    if (existingUser) {
      return res.status(409).send({ message: 'Email is already taken.' });
    }

    var user = new User({
      email: req.body.email,
      password: req.body.password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(user.password, salt, function(err, hash) {
        user.password = hash;

        user.save(function() {
          var token = createToken(user);
          res.send({ token: token, user: user });
        });
      });
    });
  });
});

app.post('/auth/facebook', function(req, res) {
  var accessTokenUrl = 'https://graph.facebook.com/v2.3/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.3/me';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: "3d3329ef0e76d9c989b3483874c322bd",
    redirect_uri: req.body.redirectUri
  };

  // Step 1. Exchange authorization code for access token.
  request.get({ url: accessTokenUrl, qs: params, json: true }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({ message: accessToken.error.message });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: graphApiUrl, qs: accessToken, json: true }, function(err, response, profile) {
      if (response.statusCode !== 200) {
        return res.status(500).send({ message: profile.error.message });
      }
      if (req.headers.authorization) {
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a Facebook account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, "tokenSecret");
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.facebook = profile.id;
            user.picture = user.picture || 'https://graph.facebook.com/v2.3/' + profile.id + '/picture?type=large';
            user.displayName = user.displayName || profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ facebook: profile.id }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({ token: token });
          }
          var user = new User();
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({ token: token });
          });
        });
      }
    });
  });
});

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

app.post('/api/search/:s', function (req,res) {
	client.search({
	  term: req.body.term,
	  location: "San Francisco",
	}).then(function (data) {
	  var businesses = data.businesses;
	  var location = data.region;
	  res.json(businesses);
	  // ...  
	});
});

app.get('/api/business/:id', function (req,res) {
	console.log(req.params.id)
	// client.search({
	//   term: req.params.id,
	//   location: "San Francisco",
	// }).then(function (data) {
	//   var businesses = data.businesses;
	//   var location = data.region;
	//   res.json(businesses);
	//   // ...  
	// });

  client.business(req.params.id, {
    cc: "US"
  }).then(function(data) {
    res.json(data);
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
