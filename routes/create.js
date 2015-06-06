//err is optional, this function can be called by passing strings
//and arrays of strings for each param or by passing in a FlashCard
//object as the first parameter
function createFlashCard(question,solution,type,answers,tags,callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/newflashcard";
    var params;
    if(typeof question === "FlashCard"){
        params  = "question="  + question["question"];
        params += "&solution=" + question["solution"];
        params += "&type="     + question["type"];
        params += "&answers="  + question["answers"];
        params += "&tags="     + question["tags"];
    }else{
        params  = "question="  + question;
        params += "&solution=" + solution;
        params += "&type="     + type;
        params += "&answers="  + answers;
        params += "&tags="     + tags;
    }
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback("Success:" + http.responseText);
            }
            else{
                console.log("Error creating flash card: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
}

function createDeck(cards, tags, title, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/newdeck";
    var params = "cards=" + cards.toString();
    if(tags && tags.length > 0) params += "&tags=" + tags.toString();
    if(title && title.length > 0) params += "&title=" + title.toString();
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                //success
                callback("Success:" + http.responseText);
            }else{
                console.log("Error searching cards: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
}


function registerNewUser(username, password, email, private, callback, async){
    async = typeof async !== 'undefined' ? async : true;
    var http = new XMLHttpRequest();
    var url = "/api/register";
    var params =    "username="  + username +
                    "&password=" + password +
                    "&email="    + email    +
                    "&private="  + private;
    http.open("POST", url, async);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200){
                callback("Success:" + http.responseText);
            }else{
                console.log("Error registering new user: " + http.responseText);
                callback("Failure:" + http.responseText);
            }
        }
    }
    http.send(params);
    if(!async){
        return http.responseText;   
    }
}
