var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var FlashCard = mongoose.model('FlashCard', {
    id: ObjectId,
    question: String,//Cards main question
    solution: String,//Cards final solution
    type: String,//Type of card, multiple choice
    answers: [String],//Cards possible answers to choose from
    tags: [String],//Cards tags to aid in search
    reports: Number,
    reporters: [String]
    //source: [String] //Id of the user that created the card
});

var Deck = mongoose.model('Deck', {
    id: ObjectId,
    title: String,//Title of the deck
    cards: [String],//List of card IDs in string format
    tags: [String],//Can be used to place decks in certain classes/searches.
    owner: String//Username of the owner of this deck

    //Unclear whether or not it would be best to store the size of the
    //deck (will there be a limit as to how many cards per deck?) or if
    //you just have to get the cards property and query the number of
    //Strings it contains
});

var User = mongoose.model('User', {
    id: ObjectId,
    username: String,
    password: String,//Hashing or encryption should be used before storing!
    email: String,
    hidden: Boolean,//Whether or not they are shown on leaderboards(?)
    cards: [String],//Ids of the cards created by the user
    myDecks: [String],//Ids of the decks created by the user
    classes: [String],//Classes a user is enrolled in (class tags)
    //decks: [Deck]//Decks saved by the user
    decks: [String],//IDs of the decks saved by the user
    scores: [{
        tags: [String],
        score: Number
    }]
    //Second option ([String]) implicitly makes all user created decks public
    //(but unsearchable without tags) whereas the first option makes user
    //decks personal to them

    //scores may be stored here depending on how we decide to implement
    //leaderboards and scoring
});

var Leaderboard = mongoose.model('Leaderboard', {
    id: ObjectId,
    tags: [String],
    scores: [{
        user: String,
        score: Number
    }]
});

mongoose.connect('mongodb://localhost:27017/goldDB');
var FlashCard = mongoose.model('FlashCard', FlashCard);
var Deck = mongoose.model('Deck', Deck);
var User = mongoose.model('User', User);
var Leaderboard = mongoose.model('Leaderboard', Leaderboard);
exports.FlashCard = FlashCard;
exports.Deck = Deck;
exports.User = User;
exports.Leaderboard = Leaderboard;
