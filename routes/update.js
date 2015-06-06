//Update deck with cards should pass either title or id or both (preferably id to avoid user conflict)
//id - String
//title - String
//cards - [String] ids of card(s) to add
function addCardsToDeck(id, title, cards, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/updatedeck";
    var params = "cards=" + cards.toString();
    if(id && id.length > 0) params += "&id=" + id.toString();
    if(title && title.length > 0) params += "&title=" + title.toString();
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                //success
                callback("Success:" + http.responseText);
            }else{
                console.log("Error adding cards to deck: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
}


//Edit card
function editCard(cardId, question,solution,type,answers,tags,callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/editcard";
    var params;
    params  = "cardid="   + cardId;
    params += "&question=" + question;
    params += "&solution=" + solution;
    params += "&type="     + type;
    params += "&answers="  + answers;
    params += "&tags="     + tags;
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback("Success:" + http.responseText);
            }else{
                console.log("Error editing card: " + http.responseText);
                callback("Failure:" + http.responseText);   
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
};

//Update user with a post request
function updateUser(username, hidden, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/updateuser";
    var params = "username=" + username + "&hidden=" + hidden;
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                //success
                callback("Success:" + http.responseText);
            }else{
                console.log("Error updating user: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
}

//Send score to leaderboard
function sendScore(score, tags, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/sendscore";
    var params = "score=" + score + "&tags=" + tags;
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                //success
                callback("Success:" + http.responseText);
            }else{
                console.log("Error sending score: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
}

//Add favorite deck to user
function favoriteDeck(deckId, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/favoritedeck";
    var params = "deckid=" + deckId;
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                //success
                callback("Success:" + http.responseText);
            }else{
                console.log("Error adding favorite deck: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
}

//Report card
function reportCard(cardId, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/reportcard";
    var params = "cardid=" + cardId;
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                //success
                callback("Success:" + http.responseText);
            }else{
                console.log("Error reporting card: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
}

//Test programming flash card
//Must be logged in
//lang =   |   j   |   c   |
//Language | Java  | C/C++ |
//
//Make sure the code has newlines where appropriate (inline code rarely works)
function testPCard(cardId, lang, code, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/testpcard";
    var params = "cardid=" + cardId + "&code=" + code + "&lang=" + lang;
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                //success
                callback("Success:" + http.responseText);
            }else{
                console.log("Error reporting card: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
}