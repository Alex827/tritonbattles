var obj;
var flag = null;
var deckid;
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
function loadCards(){
	document.getElementById("card_set").innerHTML = "";

	var http = new XMLHttpRequest();
	deckid = GetURLParameter('deck');
	http.open('GET', '/api/getcardsindeck?id=' + deckid, false);
	http.send();
	var cards = http.responseText;
	obj = JSON.parse(cards);
	var wrapper = $('#card_set'), container;
	for (i=0; i < obj.length; i++){
		var numOfChoices = obj[i].answers.length;
		container = $('<div id="flash_card'+ i + '" class="container"></div>');
		wrapper.append(container);
		container.append('<div id="question' + i + '" class="question' + i + '">' + obj[i].question + '</div>');
		for (j=0; j < obj[i].answers.length; j++){
			container.append('<div class="answer">' + obj[i].answers[j] + '</div>');	

		}
		document.getElementById("flash_card"+i).addEventListener("click", displayCardInfo);
	}
}
$('document').ready(function() {
	loadCards();
});

function displayCardInfo(){
	var num = this.id.substr(10);
	flag = obj[num];
	document.getElementById("question-field").value=obj[num].question;
	document.getElementById("question").innerHTML = obj[num].question;
	document.getElementById("tag-field").value=obj[num].tags;
	document.getElementById("solution").innerHTML = obj[num].solution;
	var numAns = obj[num].answers.length;
	for(b=0; b < numAns; b++){
		var h = b+1;
		document.getElementById("answer"+h).value=obj[num].answers[b];
		document.getElementById("choice"+h).innerHTML = obj[num].answers[b];

		if(obj[num].solution == obj[num].answers[b]){
			document.getElementById("butt"+b).checked = true;
		}

	}
	document.body.scrollTop = document.documentElement.scrollTop = 0;
}

function newCard(){
	flag = null;
	document.getElementById("question-field").value=null;
	document.getElementById("question").innerHTML = "Question";
	document.getElementById("tag-field").value=null;
	for(r=0; r < 4; r++){
		var h = r+1;
		document.getElementById("answer"+h).value=null;
		document.getElementById("choice"+h).innerHTML = "Choice " + h;
		document.getElementById("butt"+r).checked = false;
	}
}

function addEditCard(){
	// getting the answer choices from the user
    var answerFromField = document.getElementsByClassName('answer-field');
    // getting the solution from the user
    var solutionFromField = document.getElementsByClassName("correctSolution");
    // getting the question
    var questionFromField = document.getElementById('question-field').value;
    // getting the tags
    var tagsFromField = document.getElementById('tag-field').value;
	// to store the answer choices
    var answerArray = [];
    // type of card :: NOT IMPLEMENTED YET
    var type = "";
    // storing the solution
    var solution = "";
    // the status message
    var $statusM = $("#statusMessage");

    // if no question is inputted then give user error
    if( questionFromField == "" ) {
        errStatusMessage("Please enter a question", $('#question-field') );
        return;
    }
    else { // else return to normal status
        normStatusMessage( $('#question-field') );
    }

    // if no tags then give user error
    if( tagsFromField == "" ) {
        errStatusMessage("Please enter at least one tag", $('#tag-field') );
        return;
    }
    else { // else return to normal status
        normStatusMessage( $('#tag-field') );
    }

    // fills in the answer array to send into the database
	for(i = 0; i < answerFromField.length; i++) {
        // if not all four choices are filled in then give user error
        if( answerFromField[i].value == "" ) {
            $statusM.html("<strong>Please enter four answer choices</strong>");
            $statusM.css("color", "red");
            answerFromField[i].style.backgroundColor = "#FFCCCC";
            setTimeout(function() {
                normStatusMessage()
                answerFromField[i].style.backgroundColor = "white";
            }, timeOffset)
            return;
        }
        else { // else return to normal status
            normStatusMessage()
            answerFromField[i].style.backgroundColor = "white";
            answerArray.push(answerFromField[i].value);
        }
        // gets the correct solution
        if( solutionFromField[i].checked ) {
            solution = answerFromField[i].value;
        }
    }

    // if no solution checked then give user error
    if( solution == "" ) {
        $statusM.html("<strong>Please choose a solution</strong>");
        $statusM.css("color", "red");
        return;
    }
    else { // else return to normal status
        normStatusMessage();
    }

	if(flag == null){
		console.log("adding new card")
		// encode everything to pass into the database
    	var encodedQ = encodeURIComponent(questionFromField);
    	var encodedS = encodeURIComponent(solution);
    	var encodedA = encodeURIComponent(answerArray);
    	var encodedT = encodeURIComponent(tagsFromField);
	    // check to see if card in database
	    searchCards(encodedQ, encodedS, type, encodedA, encodedT, function(result) {
	        // format the result
	        var cardID = result.slice(8);
	        // if the card is in the database, then do not make card
	        if( cardID !== "[]" ) {
	            console.log("CANNOT MAKE: card already created");
	            errStatusMessage("Card was already made. Please try again.");
	        }
	        // else make the card and get its ID
	        else {
	            // making the card
	            createFlashCard(encodedQ, encodedS, type, encodedA, encodedT, function(result2) {
	                console.log("card created: "+result2);
	                // format the result
	                cardID = result2.slice(8);
	                // parse as JSON object
	                cardID = JSON.parse(cardID);
	                // get the ID card tag
	                cardID = cardID["_id"];
	                // save the ID into a global variable to be passed back up for usage
	                cardIDToSave = cardID;
	                successStatusMessage();
	            }, false);
	        }
	    }, false);
console.log("adding card to deck");
	    //put the card ID into an array to be used later for making a deck
	    cardIDArray.push(cardIDToSave);
	    console.log(cardIDArray);
	    addCardsToDeck(deckid, "", cardIDArray, function(e){}, false);

	}
	else{
		if(flag.question == questionFromField){
			questionFromField = "";
		}
		if(flag.tags == tagsFromField){
			tagsFromField = "";
		}
		if(flag.answers.equals(answerArray)){
			answerArray = "";
		}
		if(flag.solution == solution){
			solution = "";
		}
		// encode everything to pass into the database
    	var encodedQ = encodeURIComponent(questionFromField);
    	var encodedS = encodeURIComponent(solution);
    	var encodedA = encodeURIComponent(answerArray);
    	var encodedT = encodeURIComponent(tagsFromField);
		editCard(flag._id, encodedQ, encodedS, "", encodedA, encodedT, function(e){})
	}
	loadCards();
	newCard();
	$statusM.html("Please click \"Add/Edit Card\" button to submit changes or add new card.");
}

// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}   