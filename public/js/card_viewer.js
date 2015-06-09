// get cards from database
var cards;
// parses the database into JSON
var obj;
var index = 0;
// max card index for set
var maxIndex;
var spacebarKey = 32;
var leftArrowKey = 37;
var rightArrowKey = 39;
var fKey = 70;
var jKey = 74;
var kKey = 75;
// initalize global DOM avrs
var answers;
var choices;
var flipButton;
var solution;
var lastButton;
var nextButton;
var question;
var tags;
var deckTitle;
var deckid;
var tagsURL;

$(document).ready( function() {
    // allows for keyboard to control the card
    if( $('body').hasClass( "useKeyboard" ) ) {
   		$(document).keyup( function(e) {
       	// spacebar flips the card
    	if( e.keyCode == spacebarKey ) {
        	e.preventDefault();
        	flipCard();
    	}
    	// left arrow key goes to next card
    	if( e.which == leftArrowKey || e.which == jKey) {
        	lastCard();
    	}
    	// right arrow key goes to prev card
    	if( e.which == rightArrowKey || e.which == kKey) {
        	nextCard();
    	}
   		});
	}
    
    /*---------Assign DOM vars---------*/
    answers = document.getElementById("answers");
    choices = document.getElementsByClassName("choice");
    flipButton = document.getElementById("flipButton");
    solution = document.getElementById("solution");
    lastButton = document.getElementById("lastButton");
	nextButton = document.getElementById("nextButton");
	question = document.getElementById("question");
    tags = document.getElementById("tagsArea");
    deckTitle = document.getElementById("deckTitle");
    
    /*---------URL Parameters---------*/
    deckid = GetURLParameter("deck");
    tagsURL = GetURLParameter("tags");
    
    // get cards
    cards = getSet();
    obj = JSON.parse(cards);
    maxIndex = obj.length;
    // immediately load up card
    nextCard();
    // gets the deck title
    getDeckTitle();
});

// populates the deck title if it is there
function getDeckTitle(){
    var strong = document.createElement("STRONG");
    // if there is a deck id
    if( deckid ) {
        // show the test
        deckTitle.removeAttribute("hidden");
        // get the deck title
        var title = JSON.parse(getById(deckid, function(e){}, false)).title;
        // make title strong
        title = document.createTextNode(title);
        strong.appendChild(title);
        // add it to page
        deckTitle.innerHTML = "Title of Deck: "
        deckTitle.appendChild(strong);
    }
    
}

// handles the choice buttons
function choiceClick(choiceNum){
	// trims trailing spaces in front/back of solution
	var solutionTrimmed = solution.innerHTML.trim();

    // if correct, turn green
	if( choiceNum.innerHTML == solutionTrimmed )
		choiceNum.style.background = '#BCED91'
    // else turn red
	else
		choiceNum.style.background = '#E3170D'
}

// gets the percentage for the progress bar
function getPerc() {
	var perc = Math.ceil((index/maxIndex)*100);
	$(".progress-bar").attr("aria-valuenow", perc);
	$(".progress-bar").html(perc+"%");
	$(".progress-bar").css("width", perc+"%");
}

// moves onto the next card
function nextCard() {
	if( index < maxIndex ) {
        // hide solution
        $("#solution").css("visibility","hidden");
        
        // DOM variables
        var numOfChoices = obj[index].answers.length;

        // initially set both buttons to disabled
        lastButton.disabled = true;
        nextButton.disabled = true;

        //If at 1 then will be at 2 after this method performs
        if(index > 0){
            lastButton.disabled = false;
        }
        if(index < maxIndex) {
            nextButton.disabled = false;
        }

        // hides solution until card has loaded/flipped
        solution.style.visibility = "hidden";

        // if on the back of the card when next is clicked, flip back to front
        if( $('.back').hasClass('active') ) {
            $('.flipper').css( {transform: "rotateY(0deg)"});
            $('.back').removeClass('active');
            $('.front').addClass('active');
        }

        // popluates the question
        question.innerHTML = "<strong>"+obj[index].question+"</strong>";
        // populates the choices
        for(i = 0; i < numOfChoices; i++) {
            choices[i].removeAttribute("hidden");
            choices[i].innerHTML = obj[index].answers[i];
            choices[i].innerHTML = choices[i].innerHTML.trim();
        }

        // keeps it to only 4 multiple choices options
        for(a = numOfChoices; a < 4; a++){
            choices[a].setAttribute("hidden", true);
        }
        // populates the solution
        solution.innerHTML = obj[index].solution;
        // populates the tags
        tags.innerHTML = "Tags: "+obj[index].tags;
        // reset choice backgrounds
        document.getElementById("choice1").style.background = 'transparent';
        document.getElementById("choice2").style.background = 'transparent';
        document.getElementById("choice3").style.background = 'transparent';
        document.getElementById("choice4").style.background = 'transparent';

        //Disable next or last buttons if at the beginning or end of set
        if(index >= maxIndex)
            document.getElementById("nextButton").disabled = true;
        if(index < 0)
            document.getElementById("lastButton").disabled = true;

        // increases the card index
        if(index < maxIndex) {
            index++;
        }
        // update the percentage bar
        getPerc();
	}
}

// goes to prev card
function lastCard(){
	//call next card to reduce code << good stuff using DRY :D
	index -= 2; //subtract two
	if(index < 0) {
		index = 0;
	}
	nextCard(); //nextCard
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
function getSet(){
	var http = new XMLHttpRequest();
    // check URL parameters for tags or deck ID
    if((tagsURL && tagsURL.length > 0) || !deckid)
        http.open('GET', '/api/searchcards?tags='+tagsURL, false);
	else
        http.open('GET', '/api/getcardsindeck?id=' + deckid, false);
    http.send();
	var jsonObjects = http.responseText;
	return jsonObjects;
}

// flips the card
function flipCard() {
	// active means it is being shown
	if( $('.front').hasClass('active') ) {
		// rotate the card to show back
		$(".flipper").css( {transform: "rotateY(180deg)"} );
		// remove the active class and give it to the back card
		$('.front').removeClass('active');
		$('.back').addClass('active');
        $("#solution").css("visibility","visible");
	}
	else { // if the back is being shown
		// rotate the card to show front
        $("#solution").css("visibility","hidden");
		$('.flipper').css( {transform: "rotateY(0deg)"});
		$('.back').removeClass('active');
		$('.front').addClass('active');
	}
}

// link challenge button
function linkChallenge() {
    var $challengeLink = $("#challengeBtn").attr("href");
    if((tagsURL && tagsURL.length > 0) || !deckid)
        $("#challengeBtn").attr("href", $challengeLink+"tags="+ tagsURL);
    else
        $("#challengeBtn").attr("href", $challengeLink+"deck="+ deckid);
}




