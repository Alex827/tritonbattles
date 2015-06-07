//===================  GOOGLE KEYS TO LET US DO SIGN IN THROUGH GOOGLE ===========================
var GOOGLE_CLIENT_ID = "257166383774-omnmd5uc94n3fel4qi4e376oui3d1476.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "QypgHj0Jwip86ILEtr0QhRp2";
//================================================================================================

//===================  FACEBOOK KEYS TO LET US DO SIGN IN THROUGH GOOGLE ===========================
var FACEBOOK_APP_ID = "904610006269381";
var FACEBOOK_APP_SECRET = "e191aa2754a1a612dd9eb944f9d6168f";
//================================================================================================

//=================== MONGO LAB KEYS TO LET US USE MONGODB WITHOUT INSTALLING =====================
//var MONGODB_CONNECTION_URL = "mongodb://goldteam:integratedkorean@ds037617.mongolab.com:37617/tritonbattles"
//================================================================================================

//===========================================CONSTANTS============================================
var LEADERBOARD_SLOTS = 35;
var REPORT_LIMIT = 10;
//================================================================================================

//====================================  PACKAGE REQUIRES  ========================================
var	express        = require('express'),
    cookieParser   = require('cookie-parser'),
    session        = require('express-session'),
    mongoose       = require('mongoose'),
    //routes       = require('./routes'),
    morgan         = require('morgan'),
    models         = require('./models/models.js'),
    http           = require('http'),
    html           = require('html'),
    bodyParser     = require('body-parser'),
    methodOverride = require('method-override'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local').Strategy,
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    FacebookStrategy = require('passport-facebook').Strategy,
    flash          = require('connect-flash'),
    bcrypt         = require('bcrypt-nodejs'),
    path           = require('path'),
    exec           = require('child_process').exec,
    fs             = require('fs'),
    port           = 9097;
//================================================================================================


//connect to mongolab database
/*mongoose.connect(MONGODB_CONNECTION_URL);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("Database connected succesfully.");
});
*/

//Use express
var app = express();

// Tell Express what port to use
app.set('port', process.env.PORT || port);
//app.set('view engine', 'html');

//Serve static content from the public directory
app.use(express.static(path.join(__dirname, 'public'), {index: 'List_Of_Links.html'}));

//Link relative path names to their static server directories
app.use("/routes", express.static(path.join(__dirname, 'routes')));
app.use("/views", express.static(path.join(__dirname, 'views')));
app.use("/node_modules", express.static(path.join(__dirname, 'node_modules')));

//Add http request logging
//Before milestone 1 we should change this to log to a rotation of files
app.use(morgan('dev'));

// Allow express to handle JSON stuff properly (Including nested objects)
app.use(bodyParser.urlencoded({'extended': 'true'}));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Allow express to use PUT, DELETE when it is not officially supported
app.use(methodOverride());

//Allows use of login/authentication through passportjs
app.use(cookieParser());
app.use(session({secret: 'anything'}));
app.use(passport.initialize());
app.use(passport.session());

//Allow flash messages to be passed to pages
app.use(flash());

//Passport configuration
//=====================

//Local login strategy
passport.use(new LocalStrategy(
    function(username, password, done){
        //Look for a user with the provided username
        models.User.findOne({username: username}, function(err, user){
            if(err){
                console.log(err);
                return done(null, false, {message: err.toString()});
            }
            if(!user){
                //No user with that username
                return done(null, false, {message: 'Incorrect username.'});
            }
            //No password passed
            if(password.length < 1) return done(null, false, {message: 'Incorrect password.'});
            return bcrypt.compare(password, user.password, function(err, res){
                if(err){
                    console.log(err);
                    return done(null, false, {message: err.toString()});
                }
                if(res === false)
                    //Password doesn't match user
                    return done(null, false, {message: 'Incorrect password.'});
                else
                    //Success
                    return done(null, user);
            });
        });
    }
));

//Google login strategy
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://tritonbattles.herokuapp.com/auth/google/callback"
}, function(acccessToken, refreshToken, profile, done){
    //Find a user with the same primary email on the google account
    models.User.findOne({email: profile.emails[0].value}, function(err, user){
        if(err){
            console.log(err);
            return done(err);
        }
        if(!user){
            //No user exists with that email, create a new user
            user = new models.User({
                email: profile.emails[0].value,
                username: profile.displayName
            });
            //Save new user
            user.save(function(err){
                if(err) console.log(err);
                return done(err, user);
            });
        }else{
            //Successfully found user
            return done(err,user);
        }
    });
}));

//Facebook Login Strategy
passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://tritonbattles.herokuapp.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    //Look for user with the email address from facebook
    User.User.findOne({email: profile.emails[0].value}, function(err, user) {
        if(err){
            console.log(err);
            return done(err);
        }
        if(!user){
            //No user exists, create one
            user = new models.User({
                email: profile.emails[0].value,
                username: profile.displayName
            });
            //Save new user
            user.save(function(err){
                if(err) console.log(err);
                return done(err, user);
            });
        }else{
            //Found user
            return done(err,user);
        }
    });
}));



//Serialize user by their unique ids
passport.serializeUser(function(user, done){
    done(null, user._id);
});

//Deserialize users by their unique ids
passport.deserializeUser(function(id, done){
    models.User.findById(id, function(err,user){
        done(err, user);
    });
});


//Helper middleware function to restrict parts of the site to logged in users
//This is not necessary, but will remain here for convenience (for now)
function loggedIn(req,resp,next){
    if(req.user){
        next();
    }else{
        resp.redirect('/login');
    }
}


//CONTENT SERVING
//===================================================================

//Serve login page through /login using GET
/*app.get('/login', function(req,resp){
    if(req.user){
        //Already logged in, send to main page
        resp.redirect('/');
    }
    else{
        resp.send("Not logged in will fix this page later.");
        //Render the login.jade and pass in flash messages
        //resp.render('login.jade', {message: req.flash('error')});
    }
});*/

//Serve register page through /register GET request
/*app.get('/register', function(req, resp){
    if(req.user){
        resp.redirect('/');
    }else{
        resp.sendfile('register.html');
        //Render register.jade and pass in flash messages
        //resp.render('register.html', {message: req.flash('error')});
    }
});*/

//====================================================================



//USER INFORMATION VALIDATORS -- THESE CAN BE IMPLEMENTED CLIENTSIDE TOO
//=============================================================================

//Checks a string against a regular expression for valid email addresses
function validateEmail(email){
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
//Allows any password 6-20 characters in length and that only contains:
// 1) Upper or lowercase English characters
// 2) Numbers
// 3) Any of the following: !@#%*._-
function validatePassword(password){
    var re = /^[a-zA-Z0-9!@#%*._-]{6,20}$/g;
    return re.test(password);
}
//Usernames must be between 3 and 20 characters and can only consist of
//lower and uppercase English characters, hyphens, and underscores
function validateUsername(username){
    var re = /^[a-zA-Z0-9-_]{3,20}$/;
    return re.test(username);
}
//=============================================================================



//=================================USER========================================

//POST for passport authentication using login forms
app.post('/api/login', passport.authenticate('local', {
    successRedirect: '/'
    //failureRedirect: '/'
    //failureFlash: true})
  }));

//Let users logout
app.get('/logout', function(req, resp){
    if(req.user){
        //If logged in, log them out and send them to main page
        req.logout();
        resp.redirect('/');
    }else{
        //User isn't logged in
        resp.send("Not logged in.");
    }
});

//Send requests to /auth/google off to get authenticated with google
app.get('/auth/google', passport.authenticate('google', {
    scope: [
        'email',//get access to their email address
        'profile'//get access to their display name and other basic info
    ]
}));

//Provide a callback for google to send users back to
app.get('/auth/google/callback', passport.authenticate('google', {
    //failureRedirect: '/'//if login failed, go back to login screen
}), function(req, resp){
    resp.redirect('/');//login succeeded, send to main page
})

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
//Create new user
app.post('/api/register', function(req, resp){
    //Set up some initial variables to be used
    var newuser = new models.User();
    var error = "";
    //Check if a username was passed and that it passes our validation test
    if(req.body.username === undefined || req.body.username.length < 1 || !validateUsername(req.body.username)){
        error += "Missing or bad username. ";
    }
    //Check if a password was passed
    if(req.body.password === undefined || req.body.password.length < 1){
        error += "Missing or bad password. ";
    }
    //Check if an email was passed and that it passes our validation test
    if(req.body.email === undefined || req.body.email.length < 1 || !validateEmail(req.body.email)){
        error += "Missing or bad email. ";
    }
    //If any of the 3 checks failed, simply pass back the error(s) and return
    if(error.length > 0) {
        resp.send("An error occurred: " + error);
        return;
    }
    //Check if username is already taken
    models.User.findOne({username: req.body.username}, function(err,user){
        if(err){
            console.log(err);
            return;
        }
        //No user exists with that username, now we check if email is in use
        if(!user){
            //Check if a user exists with that email
            models.User.findOne({email: req.body.email}, function(err, user){
                if(err){
                    console.log(err);
                    return;
                }
                //No user exists with the passed username or email, make new user
                if(!user){
                    //Create new user with the passed in information
                    newuser.username = req.body.username;
                    //Hash the password and store the hash
                    bcrypt.hash(req.body.password, null, null, function(err, hash){
                        newuser.password = hash;
                    });
                    newuser.email    = req.body.email;
                    //Check if the privacy option was checked
                    newuser.hidden   = (req.body.hidden === 'on' ? true : false);
                    //Try to save new user in the database
                    newuser.save(function(err){
                        if(err){
                            console.log("Failed to create user: " + err);
                            resp.send("An error occurred.");
                        }else{
                            console.log("User created with ID: " + newuser._id);
                            resp.redirect('/');
                        }
                    });
                //Email already in use
                }else{
                    resp.send("Email in use by another account.");
                    return;
                }
            });
        //Username already in use
        }else{
            resp.send("Username taken.");
            return;
        }
    });
});

//Use POST to update a user's privacy options and username - UNTESTED
app.post('/api/updateuser', function(req,resp){
    //Not logged in as any user
    if(!req.user){
        resp.send("Must be logged in.");
        return;
    //User is logged in
    }else{
        var newUsername = req.user.username;
        //Check if the new username (if any) passes our tests
        if(req.body.username !== 'undefined' && validateUsername(req.body.username))
           newUsername = req.body.username;
        //Find the user by his username
        models.User.findOne({username: req.user.username}, function(err, user){
            //Change the privacy option if a new one was passed
            user.hidden = (req.body.hidden !== 'undefined' ? req.body.hidden : user.hidden);
            user.username = newUsername;
            models.User.findOne({username: newUsername}, function(err, user2){
                if(err){
                    console.log(err);
                    resp.send("An error occurred. Unable to update user.");
                    return;
                }else{
                    if(user2 && req.user.username !== newUsername){
                        resp.send("Username taken.");
                    }else{
                        user.save(function(err){
                            if(err){
                                console.log("Error updating " + req.user.username);
                                resp.send("An error occurred. Unable to update user.");
                            }else{
                                console.log(req.user.username + "Updated successfully.");
                                resp.send("Success!");
                            }
                        });
                    }
                }
            });
        });
    }
});

//GET user info
app.get('/api/getuserinfo', function(req, resp){
    if(!req.user){
        resp.send("Must be logged in.");   
    }else{
        //Only pass back specific information
        var ret = {};
        ret.username = req.user.username;
        ret.hidden = req.user.hidden;
        ret.cards = req.user.cards;
        ret.decks = req.user.decks;
        ret.myDecks = req.user.myDecks;
        ret.classes = req.user.classes;
        ret.scores = req.user.scores;
        resp.send(ret);   
    }
});

//POST to add new favorite deck
app.post('/api/favoritedeck', function(req, resp){
    if(!req.user){
        resp.send("Must be logged in.");
    }else{
        var newDeckId;
        //Check if a deckid was passed
        if(req.body.deckid && req.body.deckid !== undefined && req.body.deckid.length > 0){
            newDeckId = req.body.deckid;
        }else{
            resp.send("Please provide a deck ID.");
            return;
        }
        //Get the current user
        models.User.findOne({username: req.user.username}, function(err, user){
            if(err){
                console.log(err);
                resp.send("An error occurred.");
            }else{
                if(user){
                    //Look for deck with id passed
                    models.Deck.findOne({_id:newDeckId}, function(err, deck){
                         if(err){
                             console.log(err);
                            resp.send("Problem finding deck.");
                             return;
                         }else{
                            if(deck){
                                //Found deck, save deckid to user
                    user.decks.push(newDeckId);
                    user.save(function(err){
                        if(err){
                            console.log(err);
                            resp.send("Failed to update user after finding user.");
                            return;
                        }else{
                            //Success, we are done
                            resp.send(user.decks);
                            return;
                        }
                    });   
                            }else{
                                //No deck found
                                resp.send("No deck with that ID exists.");
                                return;
                            }
                         }
                    });
                }else{
                    //Couldn't find current user (shouldn't happen)
                    console.log("Couldn't find logged in user, should never happen. Examine favoritedeck logic and logins immediately.");
                    resp.send("Failed to find current user. This shouldn't happen.");
                    return;
                }
            }
        });
    }
});

//GET to check if user is logged in
app.get('/api/isloggedin', function(req, resp){
    if(req.user){
        resp.send("true");
        return;
    }else{
        resp.send("false");
        return;
    }
});

//=================================/USER=======================================




//=================================CARDS=======================================

//Use GET to get individual card by id
app.get('/api/getbyid', function(req, resp){
    //Try to get the id from the query
    var id = req.query.id;
    //Check if an id was passed
    if(id === 'undefined' || id.length < 1){
        resp.send("Please provide an ID.");
        return;
    }
    //Look for a flash card with that ID
    models.FlashCard.findOne({_id : id}, function(err, flashcard){
        if(err){
            console.log(err);
            resp.send("An error occurred.");
            return;
        }
        if(flashcard)
            //We found it!
            resp.send(flashcard);
        else{
            //No flashcard, find a deck with that ID
            models.Deck.findOne({_id : id}, function(err, deck){
                if(err){
                    console.log(err);
                    resp.send("An error occurred.");
                    return;
                }
                if(deck){
                    //We found it!
                    resp.send(deck);
                    return;
                }else{
                    //No deck or card with that ID exists in the DB
                    resp.send("No card or decks with that Id.");
                    return;
                }
            });
        }
    });
});

//Use GET to find an existing flashcard in the database
app.get('/api/searchcards', function(req, resp){
    //Get all of the params passed in and validate them
    var searchParams = {};
    if(req.query.question !== undefined && req.query.question.length > 0)
        searchParams.question = req.query.question;
    if(req.query.solution !== undefined && req.query.solution.length > 0)
        searchParams.solution = req.query.solution;
    if(req.query.type !== undefined && req.query.type.length > 0)
        searchParams.type = req.query.type;
    if(req.query.answers !== undefined && req.query.answers.length > 0)
        searchParams.answers = req.query.answers.replace(/\s*[,\s]\s*/g, ',').split(',');
    if(req.query.tags !== undefined && req.query.tags.length > 0)
        searchParams.tags = req.query.tags.replace(/\s*[,\s]\s*/g, ',').split(',');
    //Search for any and all cards that match the criteria
    models.FlashCard.find(searchParams, function(err, flashcards){
        if(err){
            console.log(err);
            resp.send("An error occurred while searching.");
            return;
        }
        //Put all the flashcards into a nice array and pass them back
        var flashcardlist = [];
        flashcards.forEach(function(flashcard){
            flashcardlist.push(flashcard);
        });
        resp.send(flashcardlist);
    });
});

//Use POST to create a new flashcard in the database
app.post('/api/newflashcard', function(req, resp){
    var answers = req.body.answers.split(",");//create array of answers
    var tags = req.body.tags.replace(/\s*[,\s]\s*/g, ',').split(",");//create array of tags
    if(tags.length === 0){
        console.log("Attempt to create card with no tags.");
        resp.send(
            "An error occurred: At least one tag is required.");
    }
    var nfc = new models.FlashCard();//make our new flashcard object
    //Now we update each field using the request information
    //We are assuming the page checked the info before making request
    nfc.question	= req.body.question;
    nfc.solution	= req.body.solution;
    nfc.type		= req.body.type;
    nfc.answers		= answers;
    nfc.tags		= tags;
    nfc.reports     = 0;
    //Try to save the flashcard in the database
    nfc.save(function(err){
        if(err){
            console.log("Error creating new flash card: " + err);
            resp.send("An error occurred: " + err);
        }
        else {
            console.log("New Flash Card created with id: " + nfc._id);
            resp.send(nfc);
        }
    });
});

//Use POST to update an existing flashcard
app.post('/api/editcard', function(req,resp){
    if(!req.user){
        resp.send("Must be logged in.");
        return;
    }
    var id;
    if(!req.body.cardid || req.body.cardid === undefined || req.body.cardid.length < 1){
        resp.send("Please provide a valid ID." + req.body.cardid);
        return;
    }
    id = req.body.cardid;
    models.FlashCard.findOne({_id:id}, function(err, flashcard){
        if(err){
            console.log(err);
            resp.send("An error occurred while searching the database.");
            return;
        }
        if(flashcard){
            if(req.body.question !== undefined && req.body.question.length > 0)
                flashcard.question = req.body.question;
            if(req.body.solution !== undefined && req.body.solution.length > 0)
                flashcard.solution = req.body.solution;
            if(req.body.type !== undefined && req.body.type.length > 0)
                flashcard.type = req.body.type;
            if(req.body.answers !== undefined && req.body.answers.length > 0)
                flashcard.answers = req.body.answers.replace(/\s*[,\s]\s*/g, ',').split(',');
            if(req.body.tags !== undefined && req.body.tags.length > 0)
                flashcard.tags = req.body.tags.replace(/\s*[,\s]\s*/g, ',').split(',');
            flashcard.save(function(err){
                if(err){
                    console.log(err);
                    resp.send("An error occurred updating the flashcard.");
                    return;
                }else{
                    resp.send(flashcard);
                    return;
                }
            });
        }else{
            resp.send("No flashcard found with that ID.");
            return;
        }
    });
});


//Use POST to report card
app.post('/api/reportcard', function(req, resp){
    if(!req.user){
        resp.send("Must be logged in.");
        return;
    }else{
        //validate and get id of card to report
        var cardId;
        if(req.body.cardid && req.body.cardid !== 'undefined' && req.body.cardid.length > 0){
            cardId = req.body.cardid;
        }else{
            resp.send("Please provide a card id.");
            return;
        }
        //Find a card with that id
        models.FlashCard.findOne({_id:cardId}, function(err, card){
            if(err){
                console.log(err);
                resp.send("An error occurred finding the flashcard.");
                return;
            }else{
                if(card){
                    //Found the card, report it
                    if(card.reporters.indexOf(req.user.username >= 0)){
                        resp.send("Can't report the same card twice.");
                        return;
                    }
                    card.reports = card.reports + 1;
                    card.reporters.push(req.user.username);
                    if(reports >= REPORT_LIMIT){
                        models.FlashCard.remove({_id:card._id}, function(err){
                           if(err){
                                console.log(err);
                                resp.send("An error occurred updating the card.");
                                return;
                           }else{
                               console.log("Card deleted with id : " + card._id);
                                resp.send("Card reported successfully.");
                                return;
                           }
                        });
                    }else{
                        card.save(function(err){
                            if(err){
                                console.log(err);
                                resp.send("An error occurred updating the card.");
                                return;
                            }else{
                                resp.send("Card reported successfully.");
                                return;
                            }
                        });
                    }
                }else{
                    resp.send("No card exists with that id.");
                    return;
                }
            }
        });
    }
});



//Use POST to determine if the provided C code produces equivalent output as the card
app.post('/api/testpcard', function(req, resp){
    if(!req.user){
        resp.send("Must be logged in to use programming cards.");
        return;
    }
    var id = req.body.cardid;
    if(id === 'undefined' || id.length < 1){
        resp.send("Please provide a valid id.");
        return;
    }
    var lang = req.body.lang;
    if(lang === 'undefined' || lang.length < 1){
        if(lang !== 'c' || lang !== 'j'){
            resp.send("Please provide a valid language.");
            return;
        }
    }
    models.FlashCard.findOne({_id:id}, function(err, flashcard){
        if(err){
            console.log(err);
            resp.send("An error occurred searching for that card.");
            return;
        }
        if(!flashcard){
            resp.send("No flashcard found with that id.");
            return;
        }else{
            var dirName = path.join(__dirname, "tmp/" + req.user.username + "/");
            var fileName = "";
            var compiler = "";
            var param = "";
            var ex = "";
            switch(lang){
                case 'c':
                    compiler = "g++ ";
                    param = "-o " + dirName + "a.out ";
                    ex = dirName + "a.out";
                    fileName = dirName + "test.c";
                    break;
                case 'j':
                    compiler = "javac ";
                    param = "-d " + dirName + " ";
                    ex = "java -cp " + dirName + " Program";
                    fileName = dirName + "test.java";
                    break;
            }
            console.log("FILENAME: " + fileName);
            //Write code to file
            fs.writeFileSync(fileName, req.body.code);
            //Compile code
            console.log("EXECUTING: " + compiler + param + fileName);
            exec(compiler + param + fileName, function(err, stdout, stderr){
                if(err){
                    console.log(err);
                    resp.send("There was an error attempting to compile the code.");
                    return;
                }
                if(stderr){
                    resp.send("Compilation error");
                }else{
                    //Run code and validate response
                    console.log("EXECUTING: " + ex);
                    exec(ex, function(err, stdout, stderr){
                        if(err){
                            console.log(err);
                            resp.send("Error running code.");
                            return;
                        }
                        //May need to strip whitespace or something to help
                        if(stdout === flashcard.solution || stdout === flashcard.solution + "\n"){
                            resp.send("Correct!");
                        }else{
                            resp.send("Incorrect!");   
                        }
                    });
                }
            });
            
            
            
        }
    });
});

//Use POST to determine if the provided Java code produces equivalent output as the card
app.post('/api/testjcard', function(req, resp){
    if(!req.user){
        resp.send("Must be logged in to use programming cards.");
        return;
    }
    var id = req.body.cardid;
    if(id === 'undefined' || id.length < 1){
        resp.send("Please provide a valid id.");
        return;
    }
    models.FlashCard.findOne({_id:id}, function(err, flashcard){
        if(err){
            console.log(err);
            resp.send("An error occurred searching for that card.");
            return;
        }
        if(!flashcard){
            resp.send("No flashcard found with that id.");
            return;
        }else{
            var dirName = path.join(__dirname, "tmp/" + req.user.username + "/");
            var fileName = dirName + "test.java";
            console.log("FILENAME: " + fileName);
            //Write code to file
            fs.writeFileSync(fileName, req.body.code);
            //Compile code
            console.log("Executing: " + "g++ " + fileName + " -o " + dirName + "a.out");
            exec("g++ " + fileName + " -o " + dirName + "a.out", function(err, stdout, stderr){
                if(err){
                    console.log(err);
                    resp.send("There was an error attempting to compile the code.");
                    return;
                }
                if(stderr){
                    resp.send("Compilation error");
                }else{
                    //Run code and validate response
                    exec(dirName + "a.out", function(err, stdout, stderr){
                        if(err){
                            console.log(err);
                            resp.send("Error running code.");
                            return;
                        }
                        //May need to strip whitespace or something to help
                        if(stdout === flashcard.solution){
                            resp.send("Correct!");
                        }else{
                            resp.send("Incorrect!");   
                        }
                    });
                }
            });
            
            
            
        }
    });
});


//=================================/CARDS======================================



//=================================DECKS=======================================

//Use GET to search existing decks
app.get('/api/searchdecks', function(req, resp){
    //Get the passed in parameters
    var searchParams = {};
    if(req.query.title && req.query.title !== 'undefined' && req.query.length > 0)
        searchParams.title = req.query.title;
    if(req.query.cards && req.query.cards && req.query.cards !== 'undefined' && req.query.cards.length > 0)
        searchParams.cards = req.query.cards.replace(/\s*[,\s]\s*/g, ',').split(',', 1);
    if(req.query.tags && req.query.tags && req.query.tags !== 'undefined' && req.query.tags.length > 0)
        searchParams.tags = req.query.tags.replace(/\s*[,\s]\s*/g, ',').split(',', 1);
    //Search for any and all decks matching the criteria
    models.Deck.find(searchParams, function(err, decks){
        if(err){
            console.log(err);
            resp.send("An error occurred while searching.");
            return;
        }
        var decklist = [];
        decks.forEach(function(deck){
            decklist.push(deck);
        });
        resp.send(decklist);
    });
});

//GET request to send a list of deck IDs for a user
app.get('/api/getuserdecks', function(req, resp){
    if(!req.user){
        resp.send("Must be logged in.");
        return;
    }else{
        resp.send(req.user.decks);
    }
});

//Use GET to download all cards in the deck provided -- completely UNTESTED
app.get('/api/getcardsindeck', function(req, resp){
    //Make sure we have an ID to use
    var id = req.query.id;
    if(id === 'undefined' || id.length < 1){
        resp.send("Please provide an Id.");
        return;
    }
    //Get the deck with the right ID
    models.Deck.findOne({_id : id}, function(err, deck){
        if(err){
            console.log(err);
            return;
        }
        if(!deck){
             resp.send("That Id does not correspond to a deck.");
         }else{
            //We found the deck
            var ret = [];
            var i;
             var remaining = deck.cards.length;
             if(remaining === 0){
                resp.send([]);
                 return;
             }
            //Loop through the IDs in the deck and add each card to the response
             var flag = 0;
            for(i = 0; i < deck.cards.length; ++i){
                models.FlashCard.findOne({_id: deck.cards[i]}, function(err, flashcard){
                    if(err){
                        console.log(err);
                        flag++;
                        remaining = remaining - 1;
                        return;
                    }
                    if(flashcard){
                        ret.push(flashcard);
                        remaining = remaining - 1;
                        if(remaining === 0){
                            if(flag > 0){
                                resp.send("Failed to retrieve " + flag + " card(s) from the deck:" + ret);
                            }else{
                                resp.send(ret);
                            }
                        }
                    }else{
                        flag++;
                        remaining = remaining - 1;
                        return;
                    }
                });
            }
         }
     });
});

//Use POST to create a new deck in the database
app.post('/api/newdeck', function(req,resp){
    //
    //Check if cards is json object or strings, make cards if json
    //
    if(!req.user){
        resp.send("Must be logged in.");
        return;   
    }
    var nd = new models.Deck();
    if(req.body.title && req.body.title !== 'undefined' && req.body.title.length > 0)
        nd.title = req.body.title;
    if(req.body.cards && req.body.cards !== 'undefined' && req.body.cards.length > 0)
        nd.cards = req.body.cards.split(',');
    if(req.body.tags && req.body.tags !== 'undefined' && req.body.tags.length > 0)
        nd.tags = req.body.tags.split(',');
    nd.owner = req.user.username;
    nd.save(function(err){
       if(err){
            console.log("Error creating new deck: " + err);
            resp.send("An error occurred: " + err);
       }else{
            req.user.myDecks.push(nd._id);
            req.user.save(function(err){
                if(err){
                    console.log(err);
                    return;
                }else{
                    
                }
            });
            console.log("New Deck created with id: " + nd._id);
            resp.send(nd);
       }
    });
});

//Use POST to add card(s) to deck
app.post('/api/updatedeck', function(req, resp){
    if(!req.user){
        resp.send("Must be logged in to edit decks.")
        return;
    }
    //Validate and get all parameters
    var searchParams = {}
    var cards;
    if(req.body.title && req.body.title !== 'undefined' && req.body.title.length > 0)
        searchParams.title = req.body.title;
    if(req.body.id && req.body.id !== 'undefined' && req.body.id.length > 0)
        searchParams['_id'] = req.body.id;
    if(req.body.cards && req.body.cards !== 'undefined' && req.body.cards.length > 0)
        cards = req.body.cards.replace(/\s*[,\s]\s*/g, ',').split(',');
    if((!req.body.title || req.body.title.length < 1) && (!req.body.id || req.body.id.length < 1)){
        resp.send("Please provide a title or id of the deck to update.");
        return;
    }
    if(!cards || cards.length < 1){
        resp.send("Please provide cards to add to the deck.");
        return;
    }
    console.log(searchParams);
    //Look for the deck based on provided criteria
    models.Deck.findOne(searchParams, function(err, deck){
        if(err){
            console.log(err);
            resp.send("An error occurred.");
            return;
        }else{
            //Check if deck exists
            if(!deck){
                resp.send("That deck doesn't exist.");
                return;
            }else{
                //Check if the logged in user owns the deck
                if(!deck.owner || deck.owner === req.user.username){
                    //update the deck
                    deck.cards = deck.cards.concat(cards);
                    deck.save(function(err){
                        if(err){
                            console.log(err);
                            resp.send("An error occurred. Failed to update deck.");
                            return;
                        }else{
                            resp.send("Success!");
                            return;
                        }
                    });
                }else{
                    resp.send("You do not have permissions to edit this deck.");
                    return;
                }
            }
        }
    });
});
//=================================/DECKS======================================



//=================================LEADERBOARDS================================

//Use GET to get a leaderboard
app.get('/api/getleaderboard', function(req, resp){
    //Try to get the tags from the query
    var searchParams = {};
    //Check if an tags were passed
    if(req.query.tags && req.query.tags !== 'undefined' && req.query.tags.length > 0){
        searchParams.tags = req.query.tags;
    }else{
        resp.send("Please provide tags.");
        return;
    }
    //Look for a leaderboard with those tags
    models.Leaderboard.findOne(searchParams, function(err, leaderboard){
        if(err){
            console.log(err);
            resp.send(err);
            return;
        }
        if(leaderboard){
            //We found it!
            resp.send(leaderboard.scores);
        }else{
            resp.send("No leaderboard found for this combination of tags.");
        }
    });
});

//Use POST to submit a score
app.post('/api/sendscore', function(req, resp){
    if(!req.user){
        resp.send("Must be logged in.");
        return;
    }
    if(!req.body.score || req.body.score === 'undefined' || req.body.score === 0){
        resp.send("Please provide a valid score.");
        return;
    }
    //Try to get the tags from the query
    var searchParams = {};
    //Check if tags w passed
    if(req.body.tags && req.body.tags !== 'undefined' && req.body.tags.length > 0){
        searchParams.tags = req.body.tags.replace(/\s*[,\s]\s*/g, ',').split(',', 1);   
    }else{
        resp.send("Please provide tags.");
        return;
    }
    //Look for a leaderboard with those tags
    models.Leaderboard.findOne(searchParams, function(err, leaderboard){
        if(err){
            console.log(err);
            resp.send("Server error.");
            return;
        }
        var newScore = {};
        newScore.user = req.user.username;
        newScore.score = req.body.score;
        if(leaderboard){
            //We found it!
            leaderboard.scores.push(newScore);
            leaderboard.scores.sort(function(a,b){return a.score - b.score;});
            leaderboard.scores = leaderboard.scores.splice(0,LEADERBOARD_SLOTS);
            leaderboard.save(function(err){
                if(err){
                    console.log(err);
                    resp.send("Failed to update leaderboard.");
                    return;
                }
                else{
                    //update user scores
                    req.user.scores.push({tags:searchParams.tags, score:req.body.score});
                    req.user.save(function(err){
                        if(err){
                            console.log("Failed to update user's scores: " + err);
                            resp.send("Failed to update user's scores.");
                            return;
                        }
                    });
                    resp.send(leaderboard.scores);
                    return;
                }
            });
        }else{
            //No leaderboard, create and update one
            leaderboard = new models.Leaderboard({
                tags: searchParams.tags,
                scores: []
            });
            leaderboard.scores.push(newScore);
            leaderboard.save(function(err){
                if(err){
                    console.log(err);
                    resp.send("Failed to create leaderboard.");
                    return;
                }else{
                    //update user scores
                    req.user.scores.push({tags:searchParams.tags, score:req.body.score});
                    req.user.save(function(err){
                        if(err){
                            console.log("Failed to update user's scores: " + err);
                            resp.send("Failed to update user's scores.");
                            return;
                        }
                    });
                    resp.send(leaderboard.scores);
                    return;
                }
            });
        }
    });
});

//================================/LEADERBOARDS================================



// Initialize the server on port
http.createServer(app).listen(app.get('port'), function() {
  console.log("App started on port " + app.get('port'));
}).listen(port, "0.0.0.0");
console.log("Server running on port " + port);


