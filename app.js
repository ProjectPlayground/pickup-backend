const express = require('express');
const path = require('path');
//var favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const qs = require('querystring');
const http = require('http');
//const unirest = require('unirest');

const async = require('async');
const bcrypt = require('bcryptjs');
const colors = require('colors');
const cors = require('cors');
const jwt = require('jwt-simple');
const moment = require('moment');
const mongoose = require('mongoose');
const request = require('request');
const schemaForEvent = require('./public/schemas/eventSchema');
//mongo
const mongo = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/pickup';
const config = require('./config');

mongo.connect(url, (err, db) => {
  if (err) {
    console.log('error connecting');
  } else {
    console.log('Connected Successfully to PickUp');
  }

});
const app = express();
//gonna need cors
app.use(cors());
app.options('/auth/facebook', cors());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(cookieParser());

//var eventSchema =  schemaForEvent;

var allEventSchema = new mongoose.Schema({
  events: Array,
  userEvents: Array,
});
var userEventSchema = new mongoose.Schema({
  userEvents: mongoose.Schema.Types.Mixed,
});


var userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    select: false
  },
  displayName: String,
  lastName: String,
  firstName: String,
  link: String,
  friends: Array,
  sports: String,
  gender: String,
  profile: String,
  picture: String,
  bitbucket: String,
  facebook: String,
  foursquare: String,
  google: String,
  github: String,
  instagram: String,
  linkedin: String,
  live: String,
  yahoo: String,
  twitter: String,
  twitch: String,
  spotify: String
});

userSchema.pre('save', (next) => {
  // if (!this.isModified('password')) {
  //   return next();
  // }

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(this.password, salt, function(err, hash) {
      this.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(password, done) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    done(err, isMatch);
  });
};

var User = mongoose.model('User', userSchema);
var Event = mongoose.model('Event',  new mongoose.Schema({
  "utc_offset": {
    "type": Number
  },
  "venue": {
    "type": Object,

    "zip": {
      "type": String
    },
    "country": {
      "type": String
    },
    "localized_country_name": {
      "type": String
    },
    "city": {
      "type": String
    },
    "address_1": {
      "type": String
    },
    "name": {
      "type": String
    },
    "lon": {
      "type": Number
    },
    "id": {
      "type": Number
    },
    "state": {
      "type": String
    },
    "lat": {
      "type": Number
    },
    "repinned": {
      "type": Boolean
    }

  },
  "headcount": {
    "type": Number
  },
  "distance": {
    "type": Number
  },
  "visibility": {
    "type": String
  },
  "waitlist_count": {
    "type": Number
  },
  "created": {
    "type": Number
  },
  "maybe_rsvp_count": {
    "type": Number
  },
  "description": {
    "type": String
  },
  "how_to_find_us": {
    "type": String
  },
  "event_url": {
    "type": String
  },
  "yes_rsvp_count": {
    "type": Number
  },
  "duration": {
    "type": Number
  },
  "rsvp_sample": {
    "type": Array,
    "items": {
      "type": Object,
      "member": {
        "type": Object,

        "member_id": {
          "type": Number
        },
        "name": {
          "type": String
        },
        "self": {
          "type": Object,

          "friend": {
            "type": Boolean
          }

        }

      },
      "rsvp_id": {
        "type": Number
      },
      "mtime": {
        "type": Number
      },
      "created": {
        "type": Number
      },
      "member_photo": {
        "type": Object,

        "highres_link": {
          "type": String
        },
        "photo_id": {
          "type": Number
        },
        "base_url": {
          "type": String
        },
        "type": {
          "type": String
        },
        "photo_link": {
          "type": String
        },
        "thumb_link": {
          "type": String
        }

      }

    }
  },
  "name": {
    "type": String
  },
  "id": {
    "type": String
  },
  "time": {
    "type": Number
  },
  "updated": {
    "type": Number
  },
  "group": {
    "type": Object,

    "join_mode": {
      "type": String
    },
    "created": {
      "type": Number
    },
    "name": {
      "type": String
    },
    "group_lon": {
      "type": Number
    },
    "id": {
      "type": Number
    },
    "urlname": {
      "type": String
    },
    "group_photo": {
      "type": Object,

      "highres_link": {
        "type": String
      },
      "photo_id": {
        "type": Number
      },
      "base_url": {
        "type": String
      },
      "type": {
        "type": String
      },
      "photo_link": {
        "type": String
      },
      "thumb_link": {
        "type": String
      }

    },
    "group_lat": {
      "type": Number
    },
    "who": {
      "type": String
    }

  },
  "status": {
    "type": String
  }


}));
var UserEvent = mongoose.model('UserEvent', userSchema);
var AllEvent = mongoose.model('AllEvent', userEventSchema);

mongoose.connect(url);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

//var routes = require('./routes/index');
//var users = require('./routes/user');
var updateEvents = () => {

request.get({
  url:'https://api.meetup.com/2/open_events?and_text=False&offset=0&city=Nashville&format=json&lon=-86.77878&limited_events=True&state=tn&photo-host=secure&page=150&time=0%2C1w&radius=25&fields=rsvp_sample%2C+rsvp_limit%2Cgroup_photo%2C+event_hosts&category=9%2C32%2C3%2C23%2C5&lat=36.160338&status=upcoming&desc=False&sig_id=104949862&sig=30904a98804562f3a145265b06ed8ce77afb06a3',
  json: true
}, (err, res, body) => {
    if (!err && res.statusCode == 200) {
   console.log("events recieved to meetup"); // Show the HTML for the Google homepage.
 }

 Event.find({'group':{'join_mode': "approval" || "open"}}).remove((err) =>{
   if (err) {
   return console.log(err);
   }
  Event.insertMany(body.results, (err, events) => {
if (err) {
  console.error(err);
}
//console.log(JSON.stringify(body.results[0]));

//console.log(events[0]);
});

   console.log("successfully updated meetup events server!");

 });
});
};
  //  updateEvents();


/*
 |--------------------------------------------------------------------------
 | GET /api/events * /api/events/
 |--------------------------------------------------------------------------
 */

app.get('/api/events', (req, res) => {
  Event.find({}, (err, events) => {
    if (err) {
      console.error("couldn't get event data");
      console.log(events);

    }
    console.log(events);
    console.log('Sending Events to User');
    res.send(events);
  });
});

app.get('/api/events/:id', (req, res) => {
  Event.find({"group":{'id':req.params.id}},(err, events) => {
    if (err) {
      console.error("couldn't get event data");
    }
    console.log('Sending User Profile Events');
    res.send(events);
  });
});


/*
 |--------------------------------------------------------------------------
 | PUT /api/events
 |--------------------------------------------------------------------------
 */
app.put('/api/events', (req, res) => {
  Events.findOneAndUpdate({id : req.body.id}, req.body, {upsert:true}, (err, event) => {
    if (err) {
      res.status(400).send({
        message: 'User not found' + err
      });
    }
     res.status(200).send("updated user event!");
  });
});
/*
 |--------------------------------------------------------------------------
 | POST /api/events
 |--------------------------------------------------------------------------
 */
app.post('/api/events', (req, res) => {
  Events.save(req.body, (err, event) => {
    if (err) {
      res.status(400).send({
        message: 'Failed to save new Event' + err
      });
    }
      res.status(200).send("created user event!");
  });
});

app.post('/auth/facebook', cors(), function(req, res) {
  var fields = ['id', 'email', 'first_name', 'last_name', 'link', 'name',
    'friends'
  ];
  var accessTokenUrl = 'https://graph.facebook.com/v2.5/oauth/access_token';
  var graphApiUrl = 'https://graph.facebook.com/v2.5/me?fields=' + fields.join(',');
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.FACEBOOK_SECRET,
    redirect_uri: req.body.redirectUri,

  };


  // Step 1. Exchange authorization code for access token.
  request.get({
    url: accessTokenUrl,
    qs: params,
    json: true
  }, function(err, response, accessToken) {
    if (response.statusCode !== 200) {
      return res.status(500).send({
        message: accessToken.error.message
      });
    }

    // Step 2. Retrieve profile information about the current user.
    request.get({
      url: graphApiUrl,
      qs: accessToken,
      json: true
    }, function(err, response, profile) {
      if (profile.id) {
        profile.picture = 'https://graph.facebook.com/v2.8' + profile.id + '/picture?type=small';
        profile.bigPicture = 'https://graph.facebook.com/v2.8' + profile.id + '/picture?type=normal';
      }

      if (response.statusCode !== 200) {
        return res.status(500).send({
          message: profile.error.message
        });
      }
      console.log(profile);

      if (req.header('Authorization')) {
        User.findOne({
          facebook: profile.id
        }, function(err, existingUser) {
          if (existingUser) {
            return res.status(200).send(existingUser);
          }
          var token = req.header('Authorization').split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({
                message: 'User not found'
              });
            }
            console.log(user);

            user.lastName = profile.last_name;
            user.firstName = profile.first_name;
            user.link = profile.link;
            user.email = profile.email;
            user.friends = profile.friends;
            user.facebook = profile.id;
            user.picture = 'https://graph.facebook.com/v2.8' + profile.id + '/picture?type=small';
            user.bigPicture = 'https://graph.facebook.com/v2.8' + profile.id + '/picture?type=normal';
            user.displayName = profile.name;
            user.save(function() {
              var token = createJWT(user);
              res.send({
                token: token,
                facebook: profile
              });
            });
          });
        });
      } else {
        // Step 3. Create a new user account or return an existing one.
        User.findOne({
          facebook: profile.id
        }, function(err, existingUser) {
          if (existingUser) {
            var token = createJWT(existingUser);
            return res.send({
              token: token,
              facebook: profile
            });
          }
          var user = new User();
          //user.sports = profile.sports;
          //user.locale = profile.locale;
          //user.athletes = profile.favorite_athletes;
          //user.teams = profile.favorite_teams;
          //user.gender = profile.gender;
          user.lastName = profile.last_name;
          user.firstName = profile.first_name;
          user.link = profile.link;
          user.email = profile.email;
          user.friends = profile.friends;
          user.facebook = profile.id;
          user.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=small';
          user.bigPicture = 'https://graph.facebook.com/' + profile.id + '/picture?type=normal';
          user.displayName = profile.name;
          user.save(function() {
            var token = createJWT(user);
            res.send({
              facebook: profile,
              token: token
            });
          });
        });
      }
    });
  });
});

function ensureAuthenticated(req, res, next) {
  if (!req.header('Authorization')) {
    return res.status(401).send({
      message: 'Please make sure your request has an Authorization header'
    });
  }
  var token = req.header('Authorization').split(' ')[1];

  var payload = null;
  try {
    payload = jwt.decode(token, config.TOKEN_SECRET);
  } catch (err) {
    return res.status(401).send({
      message: err.message
    });
  }

  if (payload.exp <= moment().unix()) {
    return res.status(401).send({
      message: 'Token has expired'
    });
  }
  req.user = payload.sub;
  next();
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */
function createJWT(user) {
  var payload = {
    sub: user._id,
    iat: moment().unix(),
    exp: moment().add(2, 'days').unix()
  };
  return jwt.encode(payload, config.TOKEN_SECRET);
}

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
app.get('/api/me', function(req, res) {
  User.find({facebook: req.query.id}, function(err, user) {
    if (err){
      res.send(err)
      console.log('error sending use info');
    }
    console.log('user info send');
    res.send(user);
  });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
app.put('/api/me', function(req, res) {
  User.findById({facebook: req.query.id}, function(err, user) {
    if (!user) {
      return res.status(400).send({
        message: 'User not found'
      });
    }
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.save(function(err) {
      res.status(200).end();
    });
  });
});


/*
 |--------------------------------------------------------------------------
 | Unlink Provider
 |--------------------------------------------------------------------------
 */
app.post('/auth/unlink', ensureAuthenticated, function(req, res) {
  var provider = req.body.provider;
  var providers = ['facebook', 'foursquare', 'google', 'github', 'instagram',
    'linkedin', 'live', 'twitter', 'twitch', 'yahoo', 'bitbucket', 'spotify'
  ];

  if (providers.indexOf(provider) === -1) {
    return res.status(400).send({
      message: 'Unknown OAuth Provider'
    });
  }

  User.findById(req.user, function(err, user) {
    if (!user) {
      return res.status(400).send({
        message: 'User Not Found'
      });
    }
    user[provider] = undefined;
    user.save(function() {
      res.status(200).end();
    });
  });
});




var env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup


// app.use(favicon(__dirname + '/public/img/favicon.ico'));

//app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', routes);
//app.use('/users', users);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
      title: 'error'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {},
    title: 'error'
  });
});


module.exports = app;
