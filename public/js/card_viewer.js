// get cards from database
var cards = getSet();
// parses the database into JSON
var obj = JSON.parse(cards);
var index = 0;
// max card index for set
var maxIndex = obj.length;
var spacebarKey = 32;
var leftArrowKey = 37;
var rightArrowKey = 39;
var fKey = 70;
var jKey = 74;
var kKey = 75;
var answers;// = document.getElementById("answers");
var choices;// = document.getElementsByClassName("choice");
var flipButton;// = document.getElementById("flipButton");
var solution;// = document.getElementById("solution");
var lastButton;// = document.getElementById("lastButton");
var nextButton;// = document.getElementById("nextButton");
var question;// = document.getElementById("question");
var tags;// = document.getElementById("tagsArea");

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
    /*---------Set up vars---------*/
    answers = document.getElementById("answers");
    choices = document.getElementsByClassName("choice");
    flipButton = document.getElementById("flipButton");
    solution = document.getElementById("solution");
    lastButton = document.getElementById("lastButton");
	nextButton = document.getElementById("nextButton");
	question = document.getElementById("question");
    tags = document.getElementById("tagsArea");
    
    // immediately load up card
    nextCard();
    console.log(choices);
});


function getDeckTitle(){
    var deckTitleField = document.getElementById("deckTitle");
    var deckid = GetURLParameter("deck");
    if( deckid ) {
        var deckTitle = 
        deckTitleField.removeAttribute("hidden");
        deckTitleField.innerHTML
    }
    
}
// shows the solution
//function showSolution() {
//	solution.style.visibility = "visible";
//}

// handles the choice buttons
function choiceClick(choiceNum){
	// trims trailing spaces in front/back of solution
	var solutionTrimmed = solution.innerHTML.trim();

    // if correct, turn green
	if( choiceNum.innerHTML == solutionTrimmed )
	{
		choiceNum.style.background = '#BCED91'
	}
    // else turn red
	else
	{
		choiceNum.style.background = '#E3170D'
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

// moves onto the next card
function nextCard() {
	if( index < maxIndex ) {
    $("#solution").css("visibility","hidden");
	// DOM variables
	var numOfChoices = obj[index].answers.length;
//	var lastButton = document.getElementById("lastButton");
//	var nextButton = document.getElementById("nextButton");
//	var question = document.getElementById("question");
//    var tags = document.getElementById("tagsArea");
//	var solution = document.getElementById("solution");

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
	// shows the solution after the flipping animation
//	setTimeout(showSolution, 300);

	// popluates the question
	question.innerHTML = "<strong>"+obj[index].question+"</strong>";
    console.log(choices);
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
    // populates the solution
	solution.innerHTML = obj[index].solution;

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

	//console.log(index);
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
function getSet()
{
	var http = new XMLHttpRequest();
    var tags = GetURLParameter('tags');
    var deckid = GetURLParameter('deck');
    //console.log(tags);
    if((tags && tags.length > 0) || !deckid)
        http.open('GET', '/api/searchcards?tags='+tags, false);
	else
        http.open('GET', '/api/getcardsindeck?id=' + deckid, false);
    http.send();
	var jsonObjects = http.responseText;
	// console.log(jsonObjects);
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
function linkChallenge(){
    var tags = GetURLParameter("tags");
    var deckid = GetURLParameter("deck");
    var $challengeLink = $("#challengeBtn").attr("href");
    if((tags && tags.length > 0) || !deckid)
        $("#challengeBtn").attr("href", $challengeLink+"tags="+ tags);
    else
        $("#challengeBtn").attr("href", $challengeLink+"deck="+ deckid);
}




