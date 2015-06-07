// gets the getLeaderboard()
$.holdReady(true);
$.getScript("../../routes/search.js", function() {
    $.holdReady(false);
});

// updates the leaderboard
function updateLeaderB() {
    // get the tags
    var check = false;
    var tags = GetURLParameter("tags");
    var deckid = GetURLParameter("deck");
    
    // DOM elements
    var usersToChange = document.getElementsByClassName("user");
    var scoresToChange = document.getElementsByClassName("score");
    
    // grab leaderboard info from database
    var leaderBInfo = getLeaderboard(tags, function(e){}, false);
    // parse the info as JSON
    var leaderJSON = JSON.parse(leaderBInfo);
    // loop through the html row elements
    // max ten players
    for(var i = 0; i < 10; i++) {
        // if there aren't enough players
        if( leaderJSON[i] == undefined ) {
            usersToChange[i].innerHTML = "N/A yet";
            scoresToChange[i].innerHTML = "N/A yet";
        }
        // sets the players' scores and their name
        else {
        usersToChange[i].innerHTML = leaderJSON[i].user;
        scoresToChange[i].innerHTML = Math.ceil(leaderJSON[i].score);
        }
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

function goBack() {
    window.history.back();
}

// updates the leaderboard on page load
$(document).ready( function() {
    updateLeaderB();
});
