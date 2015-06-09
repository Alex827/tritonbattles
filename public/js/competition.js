// get cards from database
var cards = getSet();
// parses the database into JSON
var obj = JSON.parse(cards);

var index = 0;
var choices = document.getElementsByClassName("choice");
// max card index for set
var maxIndex = obj.length;
// number correct
var numCorrect = 0;
// number wrong
var numWrong = 0;
// percentage correct
var percCorrect = 0;
// time it took
var endTime = 0;
// score to send
var score = 0;


// starts the competition
function start() {
    // gets the start button
    var startButton = document.getElementById("startBtn");

    // reset indexes and counters
    index = 0;
    numCorrect = 0;
    numWrong = 0;

    // change the start button text
    startButton.innerHTML = "Start";
    // change the last button to default action
    choices[3].setAttribute("onclick", "choiceClick(this)");
    // grabs the first card
    nextCard();
    // starts the timer
    startTimer();
}

// ends the competition
function end() {
    // tags to be passed into send score function
    var tags = GetURLParameter("tags");
    var deckid = GetURLParameter("deck");
    
    if( tags == undefined ) {
        var jsonObjects;
        getById(deckid, function(e) {
            jsonObjects = JSON.parse(e.substr(8));
        }, false);
        tags = jsonObjects.tags;
//        tags = obj.tags;
//        console.log(tags);
    }

    // reset choice backgrounds
    document.getElementById("choice1").style.background = 'transparent';
    document.getElementById("choice2").style.background = 'transparent';
    document.getElementById("choice3").style.background = 'transparent';
    document.getElementById("choice4").style.background = 'transparent';

    // changes the percentage bar
    getPerc();

    // get DOM elements
    var question = document.getElementById("question");
    var startButton = document.getElementById("startBtn");
    var leaderButton = document.getElementById("leaderBtn");

    // calculate the percentage correct
    percCorrect = Math.ceil((numCorrect/maxIndex)*100);

    //stop timer
    stopTimer();
//    console.log("called stop timer");
    endTime = document.getElementById("theTime").children[0].innerHTML;
    endTime = parseTime(endTime);
    score = endTime/maxIndex;
//        console.log("score sent " + score);
    sendScore(score, tags, function(e){
    }, false);
    score = Math.ceil(score);

    // shows the results
    question.innerHTML = "<strong>Your Score is: " + score + "</strong>";
    choices[0].style.background = '#BCED91'
    choices[0].innerHTML = "Number Correct: " + numCorrect;
    choices[1].style.background = '#E3170D'
    choices[1].innerHTML = "Number Wrong: " + numWrong;
    choices[2].innerHTML = "Percentage Correct: "+ percCorrect+"%";
    // goes to the study page
    choices[3].innerHTML = "Study this set";
    choices[3].setAttribute("onclick", "goStudy()");
    // replay
    startButton.innerHTML = "Retry?";
    // leaderboard button
    leaderButton.removeAttribute("hidden");
    leaderButton.setAttribute("onclick", "goLeaderB()");
}

// moves onto the next card
function nextCard() {
    // if there are cards left
	if( index < maxIndex ) {
        // DOM variables
        var numOfChoices = obj[index].answers.length;
        var question = document.getElementById("question");

        // popluates the question
        question.innerHTML = "<strong>"+obj[index].question+"</strong>";
        // populates the choices
        for(i = 0; i < numOfChoices; i++) {
            choices[i].removeAttribute("hidden");
            choices[i].innerHTML = obj[index].answers[i];
            choices[i].innerHTML = choices[i].innerHTML.trim();
        }

        //Prevents extra showing of previous options
        // also keeps it to only 4 multiple choices options
        for(a = numOfChoices; a < 4; a++){
            choices[a].setAttribute("hidden", true);
        }

        // reset choice backgrounds
        document.getElementById("choice1").style.background = 'transparent';
        document.getElementById("choice2").style.background = 'transparent';
        document.getElementById("choice3").style.background = 'transparent';
        document.getElementById("choice4").style.background = 'transparent';

        // changes percentage bar
        getPerc();
	}
    else { // no more cards => end game
        end();
    }
}

// get the tags from the URL
function GetURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

// gets the cards from the database
function getSet()
{
	var http = new XMLHttpRequest();
    var tags = GetURLParameter('tags');
    var deckid = GetURLParameter('deck');
//    console.log(deckid);
//    console.log(tags);
    if( tags != undefined ) {
        http.open('GET', '/api/searchcards?tags='+tags, false);
        http.send();
        var jsonObjects = http.responseText;
//    	console.log(jsonObjects);
//        console.log(typeof jsonObjects);
//        jsonObjects = JSON.parse(jsonObjects);
        return jsonObjects;
    }
    else {
        http.open('GET', '/api/getcardsindeck?id='+deckid, false);
        http.send();
        var jsonObjects = http.responseText;
        return jsonObjects;
        /*
        var cardArr = [];
//        console.log(jsonObjects);
        jsonObjects = JSON.parse(jsonObjects);
    	console.log(jsonObjects[0].cards);
        for( var i = 0; i < jsonObjects[0].cards.length; i++) {
            cardArr[i] = getById(jsonObjects[0].cards[i], function(e){}, false);
            console.log("["+cardArr.toString()+"]");
        }
        return "["+cardArr.toString()+"]";*/
    }
}

// gets the percentage for the progress bar
function getPerc() {
	var perc = Math.ceil((index/maxIndex)*100);
	//console.log(perc);
	$(".progress-bar").attr("aria-valuenow", perc);
	$(".progress-bar").html(perc+"%");
	$(".progress-bar").css("width", perc+"%");
}

// handles the choice buttons
function choiceClick(choiceNum){
    // only allow if there are cards left
    if( index < maxIndex ) {
        // trims trailing spaces in front/back of solution
        var solutionTrimmed = obj[index].solution.trim();
        // if correct, turn green and increment counter for correct
        if( choiceNum.innerHTML == solutionTrimmed ) {
            choiceNum.style.background = '#BCED91'
            numCorrect = numCorrect + 1;
        }
        // else turn red and increment counter for wrong
        else {
            choiceNum.style.background = '#E3170D'
            numWrong = numWrong + 1;
            addMillis(5000);
//            console.log("time added");
        }

        // increases the card index
        if(index < maxIndex) {
            index++;
        }
        // goes to next card
        nextCard();

    }
    else { // calls nextCard() for checking
        nextCard();
    }
}

// goes to the study page for this set
function goStudy() {
    var tags = GetURLParameter('tags');
    var deckid = GetURLParameter('deck');
    
    if( tags != undefined ) {
        window.location = "../Study_Card.html?tags=" + tags;
    }
    else {
            window.location = "../Study_Card.html?deck=" + deckid;
    }
}

// goes to the leaderboard for this set
function goLeaderB() {
    var http = new XMLHttpRequest();
    var tags = GetURLParameter('tags');
    var deckid = GetURLParameter('deck');
    
    if( tags != undefined ) {
        window.location = "../Leaderboard.html?tags=" + tags;
    }
    else {
//        var jsonObjects = JSON.parse(http.responseText);
//        console.log(jsonObjects);
//        http.open('GET', '/api/searchdecks?id='+deckid, false);
//        http.send();
//        console.log(tags);
        var jsonObjects;
        getById(deckid, function(e) {
            jsonObjects = JSON.parse(e.substr(8));
        }, false);
        tags = jsonObjects.tags;
        window.location = "../Leaderboard.html?tags=" + tags;
    }
}

// starts timer
function startTimer() {
    document.getElementsByTagName('timer')[0].start();
}

// stops timer
function stopTimer() {
    //console.log("stopped");
    document.getElementsByTagName('timer')[0].stop();
}

function addMillis(millis) {
    document.getElementsByTagName('timer')[0].addMillis(millis);
}


// gets the time by adding up the minutes and seconds
function parseTime(time) {
    var toRet = 0;
    var bufArray = time.split(":");
    toRet += Number(bufArray[0] * 60000);
    toRet += Number(bufArray[1] * 1000);
    toRet += Number(bufArray[2]);

    return toRet;
}

//id = String
//callback = function(String)
function getById(id, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/getbyid?id=" + id;
    http.open('GET', url, async);
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback("Success:" + http.responseText);
            }else{
                //failure
                console.log("Error searching by ID: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send();
    if(!async){
        return http.responseText;   
    }
}

//function resumeTimer(){
//    document.getElementsByTagName('timer')[0].resume();
//}
