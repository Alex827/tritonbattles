//classtag = String
//callback = function(String)
function searchCardsByClass(classtag, callback){
    var pass = [classtag];
    searchCardsByTags(pass, callback);
}

//tags = [String]
//callback = function(String)
function searchCardsByTags(tags, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/searchcards?tags=" + tags;
    http.open('GET', url, async);
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                console.log(http.responseText);
                callback("Success:" + http.responseText);
            }else{
                console.log("Error searching cards by tags: " + http.responseText);
                callback("Failure:" + http.responseText);   
            }
        }
    }
    http.send();
    if(!async){
        return http.responseText;   
    }
}

//question = String
//solution = String
//type = String
//answers = [String]
//tags = [String]
//callback = function(String)
function searchCards(question,solution,type,answers,tags,callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/searchcards";
    var params;
    params  = "?question=" + question;
    params += "&solution=" + solution;
    params += "&type="     + type;
    params += "&answers="  + answers;
    params += "&tags="     + tags;
    http.open("GET", url + params, async);
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback("Success:" + http.responseText);
            }else{
                console.log("Error searching cards: " + http.responseText);
                callback("Failure:" + http.responseText);   
            }
        }
    }
    http.send();
    if(!async){
        return http.responseText;   
    }
}

//tags = [String]
//callback = function(String)
function searchDecksByTags(tags, title, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/searchdecks?tags=" + tags;
    url += "&title=" + title;
    http.open('GET', url, async);
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback("Success:" + http.responseText);
            }else{
                console.log("Error searching decks by tags: " + http.responseText);
                callback("Failure:" + http.responseText);   
            }
        }
    }
    http.send();
    if(!async){
        return http.responseText;   
    }
}

//cards = [String]
//callback = function(String)
function searchDecksByCards(cards, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/searchdecks?cards=" + cards;
    http.open('GET', url, async);
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback("Success:" + http.responseText);
            }else{
                console.log("Error searching decks by cards: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send();
    if(!async){
        return http.responseText;   
    }
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

function callback(String){}

function getUserInfo(callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/getuserinfo";
    http.open('GET', url, async);
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback(http.responseText);
            }else{
                //failure
                console.log("Error getting user info: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send();
    if(!async){
        return http.responseText;   
    }
}

//callback = function(String)
function getUserDecks(callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/getuserdecks";
    http.open('GET', url, async);
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback("Success:" + http.responseText);
            }else{
                //failure
                console.log("Error getting user info: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send();
    if(!async){
        return http.responseText;   
    }
}

//tags = [String]
//callback = function(String)
function getLeaderboard(tags, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/getleaderboard?tags=" + tags;
    http.open('GET', url, async);
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback("Success:" + http.responseText);
            }else{
                console.log("Error getting leaderboard: " + http.responseText);
                callback("Failure:" + http.responseText);   
            }
        }
    }
    http.send();
    if(!async){
        return http.responseText;   
    }
}