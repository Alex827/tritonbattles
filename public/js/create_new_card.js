// the card array that holds the card ID's to make a deck out of it
cardIDArray = [];
// the card array for dynamic displaying
cardArray = [];
// the card ID to save into the array
cardIDToSave = [];
// time offset to change back to default status messgae
timeOffset = 1500;
// index for cards made
indexCreate = 0;

//NOTE TO SELF MAKE SURE THAT THE PATH NAME IS CORRECT FOR THIS
function addCard() {
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
    // boolean to return if error
    var errorBool = false;

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
                answerFromField[i].style.backgroundColor = "#F0F0F0";
            }, timeOffset)
            return;
        }
        else { // else return to normal status
            normStatusMessage()
            answerFromField[i].style.backgroundColor = "#F0F0F0";
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
            errStatusMessage("Card was already made. Please try again.");
            errorBool = true;
            return;
        }
        // else make the card and get its ID
        else {
            // making the card
            createFlashCard(encodedQ, encodedS, type, encodedA, encodedT, function(result2) {
                // format the result
                cardID = result2.slice(8);
                // parse as JSON object
                cardID = JSON.parse(cardID);
                cardArray.push(cardID);
                // get the ID card tag
                cardID = cardID["_id"];
                // save the ID into a global variable to be passed back up for usage
                cardIDToSave = cardID;
                successStatusMessage();
            }, false);
        }
    }, false);
    
    // if there was an error then return
    if( errorBool ) {
        return;
    }

    //put the card ID into an array to be used later for making a deck
    cardIDArray.push(cardIDToSave);
    
    updateCardArrInfo();
    
    // clear fields if checked
    if( $("#clearCheckBox").prop('checked') ) {
        newCard();
    }
}

function addDeck() {
    var deckTitleFromField = document.getElementById("deckTitle");
    var deckTagsFromField = document.getElementById("deckTags");
    
    if( cardIDArray.length == 0 ) {
        errStatusMessage( "Please create at least one card.");
        return;
    }
    if( deckTitleFromField.value == "") {
        errStatusMessage("Please enter a deck title.", $("#deckTitle"));
        return;
    }
    if( deckTagsFromField.value == "" ) {
        errStatusMessage("Please enter deck tag(s).", $("#deckTags"));
        return;
    }
    createDeck(cardIDArray, deckTagsFromField.value, deckTitleFromField.value, function(e){}, false);
    var $statusM = $("#statusMessage");

    $statusM.html("<strong>Deck created!</strong>");
    $statusM.css("color", "purple");
    setTimeout(normStatusMessage, timeOffset);
}

// changes status message to default and returns field to normal if any
function normStatusMessage(var1) {
    var $statusM = $("#statusMessage");

    $statusM.css("color", "black");
    $statusM.html("Please click \"Add Card\" button to submit.");
    if( var1 ) {
        var1.css("background-color","#F0F0F0");
    }
}

// changes status message to error and changes field to red if any
function errStatusMessage(string1, var1) {
    var $statusM = $("#statusMessage");

    $statusM.html("<strong>"+ string1 + "</strong>");
    $statusM.css("color", "white");
    if( var1 ) {
        var1.css("background-color","#FFCCCC");
        setTimeout( function() {
            var1.css("background-color","#F0F0F0");

        }, timeOffset);
    }
    setTimeout(normStatusMessage, timeOffset);
}

// changes status message to passing
function successStatusMessage() {
    var $statusM = $("#statusMessage");

    $statusM.html("<strong>Card created!</strong>");
    $statusM.css("color", "green");
    setTimeout(normStatusMessage, timeOffset);
}

//Clears fields after adding cards
function newCard(){
    document.getElementById("question-field").value=null;
    document.getElementById("question").innerHTML = "Question";
    document.getElementById("tag-field").value=null;
    for(r=0; r < 4; r++){
        var h = r+1;
        document.getElementById("answer"+h).value=null;
        document.getElementById("choice"+h).innerHTML = "Choice " + h;
        document.getElementsByClassName("correctSolution roundedHomepage").checked = false;
    }
}

// shows cards currently made next
function nextCardCreate() {
	if( indexCreate < cardIDArray.length ) {
        $("#solution").css("visibility","hidden");
        // DOM variables
        var numOfChoices = cardArray[indexCreate].answers.length;
        var lastButton = document.getElementById("lastButton");
        var nextButton = document.getElementById("nextButton");
        var question = document.getElementById("question");
        var solution = document.getElementById("solution");

        // if on the back of the card when next is clicked, flip back to front
        if( $('.back').hasClass('active') ) {
            $('.flipper').css( {transform: "rotateY(0deg)"});
            $('.back').removeClass('active');
            $('.front').addClass('active');
        }

        // popluates the question
        question.innerHTML = "<strong>"+cardArray[indexCreate].question+"</strong>";
        // populates the choices
        for(i = 0; i < numOfChoices; i++) {
            choices[i].removeAttribute("hidden");
            choices[i].innerHTML = cardArray[indexCreate].answers[i];
            choices[i].innerHTML = choices[i].innerHTML.trim();
        }

        //Prevents extra showing of previous options
        // also keeps it to only 4 multiple choices options
        for(a = numOfChoices; a < 4; a++){
            choices[a].setAttribute("hidden", true);
        }
        // populates the solution
        solution.innerHTML = cardArray[indexCreate].solution;

    //    tags.innerHTML = "Tags: "+cardArray[index].tags;
        // reset choice backgrounds
        document.getElementById("choice1").style.background = 'transparent';
        document.getElementById("choice2").style.background = 'transparent';
        document.getElementById("choice3").style.background = 'transparent';
        document.getElementById("choice4").style.background = 'transparent';
        
		indexCreate++;
        updateCardArrInfo();
    }
}

// updates the card info area
function updateCardArrInfo() {
    // DOM variable
    var cardArrStatus = document.getElementById("cardStatus");
    // the two default messages
    var defMess1 = "Your current card: ";
    var defMess2 = " Total Cards: ";
    // update the message
    cardArrStatus.innerHTML = defMess1 + indexCreate + defMess2 + cardArray.length;
}

// goes to prev card
function lastCardCreate(){
	//call next card to reduce code << good stuff using DRY :D
	indexCreate -= 2; //subtract two
	if(indexCreate < 0) {
		indexCreate = 0;
	}
	nextCardCreate(); //nextCard
}