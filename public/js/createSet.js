// function createSet()
// {
//   var title = $('#title').val();
//   var classVal = $('#class').val();
//   var tags = $('#tags').val();

//   //Send to createDeck()

// }
//question, solution, answers, tags, type

//Need to find way of getting the solution and type from the webpage
//Push this new object into the array cards
//Once the user clicks createDeck we will send whatever is in cards to the database by looping
//through cards and calling createCard on each one. Remember that the callback function will give us
//a card ID and we need to save this in another array.
//Once all the cards are created we call createDeck and pass in all the ID's that we got from our callback function
//And hooray our deck is created
//After this we need to do some minor stuff like user confirmation of creating the deck, providing a way
//to access the deck the user just made and clearing all the fields on the page.
//We also need to make it so that a user can view the deck that he/she is currently making on the left side of the page
//where the index card is.
//TLDR: 1. get all parameters we need for Dylan's method createCard
//		2. Add all these cards to an array (cards)
	//  3. Send to database with createCard and then createDeck with returned ID's
	//	4. Less important implementation stuffs

// the card array that holds the card ID's to make a deck out of it
var cardIDArray = [];
// the card ID to save into the array
var cardIDToSave;
// import
$.getScript("../routes/create.js");
$.getScript("../routes/search.js");

var timeOffset = 1500;

//NOTE TO SELF MAKE SURE THAT THE PATH NAME IS CORRECT FOR THIS
function addCard()
{
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
//    encodedA = answerArray;
    //console.log(answerArray);
    console.log(encodedA);
    //return;

    // check to see if card in database
    searchCards(encodedQ, encodedS, type, encodedA, encodedT, function(result) {
        // format the result
        var cardID = result.slice(8);
        // if the card is in the database, then do not make card
        if( cardID !== "[]" ) {
            //console.log("CANNOT MAKE: card already created");
            errStatusMessage("Card was already made. Please try again.");
            return;
        }
        // else make the card and get its ID
        else {
            // making the card
            createFlashCard(encodedQ, encodedS, type, encodedA, encodedT, function(result2) {
                //console.log("card created: "+result2);
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

    //put the card ID into an array to be used later for making a deck
    cardIDArray.push(cardIDToSave);
    //console.log(cardIDArray);
    newCard();
}

function addDeck() {
    createDeck(cardIDArray, document.getElementById("deckTags").value, document.getElementById("deckTitle").value, function(e){}, false);
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
    $statusM.css("color", "red");
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
    console.log("newcard button")
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

$('document').ready(function() {
    var question = document.getElementById("question");
    var $checkedRadio = $('input[type=radio][name=pickSolution]');

    // populate the question field
    $('#question-field').bind('keyup keydown keypress', function() {
        question.innerHTML = $('#question-field').val();
    });
    // populate the choices
    $('#answer1').bind('keyup keydown keypress', function() {
        $('#choice1').html( $('#answer1').val() );
    });
    $('#answer2').bind('keyup keydown keypress', function() {
        $('#choice2').html( $('#answer2').val() );
    });
    $('#answer3').bind('keyup keydown keypress', function() {
        $('#choice3').html( $('#answer3').val() );
    });
    $('#answer4').bind('keyup keydown keypress', function() {
        $('#choice4').html( $('#answer4').val() );
    });
    // populate the solution
    $checkedRadio.click( function() {
        var correctSolution = $checkedRadio.filter(":checked").next();
        $('#solution').html( correctSolution.val() );

        correctSolution.bind('keyup keydown keypress', function() {
            $('#solution').html( correctSolution.val() );
        });
    });
});
