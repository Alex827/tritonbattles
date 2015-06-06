function closePopups(){
    $(".cover").css("display", "none");
    $(".loginpopup").css("display", "none");
    $(".registerpopup").css("display", "none");
}

function openLogin(){
    $(".loginpopup").css("display", "block");
    $(".cover").css("display", "block");
}

function openRegister(){
    $(".registerpopup").css("display", "block");
    $(".cover").css("display", "block");
}

function submitLogin(username, password){
    var values = {};
    $.each($('#loginform').serializeArray(), function(i, field){
        values[field.name] = field.value;
    });
    //Submit form and check result
    var http = new XMLHttpRequest();
    var url = '/api/login';
    var params;
    if(username === undefined || username.length < 1){
        params = "username=" + values['username'] +
                             "&password=" + values['password'];
    }else{
        params = "username=" + username + "&password=" + password;   
    }
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200 || http.status == 302){
                //show success maybe
                closePopups();
                location.reload();
            }else{
                //show failure/report error
                $('.loginpopup').effect("shake",{times:1}, 250);
            }    
        }
    }
    http.send(params);
    //set loading
    return false;
}

function submitRegister(){
    var values = {};
    $.each($('#registerform').serializeArray(), function(i, field){
        values[field.name] = field.value;
    });
    //Submit form and check result
    var http = new XMLHttpRequest();
    var url = '/api/register';
    var params = "username=" + values['username'] +
                 "&password=" + values['password'] +
                 "&email=" + values['email'] +
                 "&hidden=" + values['hidden'];
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function(){
        if(http.readyState == 4){
            if(http.status == 200 || http.status == 302){
                //show success maybe
                closePopups();
                submitLogin(values['username'], values['password']);
            }else{
                //show failure/report error
                $('.registerpopup').effect("shake",{times:1}, 250);
            }    
        }
    }
    http.send(params);
    //set loading
    return false;
}

$(document).ready(function(){
    $("#login").click(openLogin);
    $("#register").click(openRegister);
    $("#logout").click(logout);
    $(".cover").click(closePopups); //If user clicks outside popup, close popups
    $('.logged-out-box').hide();
    $('.logged-in-box').hide();

    if(isLoggedIn()) {
      $('.logged-in-box').show();
      $('.logged-out-box').hide();
    }else {
      $('.logged-in-box').hide();
      $('.logged-out-box').show();
    }
});

function logout() {
  $.get( "logout")
  .done(function( data ) {
    location.reload();
  });
}

function isLoggedIn(){
    var http = new XMLHttpRequest();
    http.open('GET', "/api/isloggedin", false);
    http.send();
    if(http.responseText === "true"){
        return true;   
    }else{
        return false;   
    }
}

//==================EXAMPLE HTML============================
/*<div class="cover"></div>
<div class="loginpopup">
    <form id="loginform" class="form-signin" action="/api/login" method="POST" onsubmit="submitLogin();return false;">
        <h2 class="form-signin-heading">Please Log In</h2>
<label id="loginError" color="red"></label><br/>
        <input type="text" id="inputUsername" class="form-control" placeholder="Username" name="username" required autofocus>
        <input type="password" id="inputPassword" class="form-control" placeholder="Password" name="password" required>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Log In</button>
<table style="margin-top: 10px">
<tr>
<td width="50%" style="padding: 3px">
  <a href="/auth/google" class="btn btn-block btn-social btn-google-plus">
      <i class="fa fa-google-plus"></i>
      Google+
    </a>
</td>
<td width="50%" style="padding: 3px">
<a href="/auth/facebook" class="btn btn-block btn-social btn-facebook">
            <i class="fa fa-facebook"></i>
            Facebook
            </a>
</td>
</tr>
</table>
    </form>
</div>
<div class="registerpopup">
    <form id="registerform" class="form-signin" action="/api/register" method="POST" onsubmit="submitRegister();return false;">
        <h2 class="form-signin-heading">User Registration</h2>
        <input type="text" id="inputUsername" class="form-control" placeholder="Username" name="username" required autofocus>
        <input type="email" id="inputEmail" class="form-control" placeholder="Email Address" name="email" required>
        <input type="password" id="inputPassword" class="form-control" placeholder="Password" name="password" required>
        <div class="checkbox">
            <label><input type="checkbox" name="hidden">Hide My Scores</label>
        </div>
        <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
    </form>
</div> */

//THE ABOVE CODE SHOULD BE PLACED TOWARDS THE TOP OF THE FILE
//TO OPEN EACH POPUP YOU NEED A BUTTON WITH
//id="login" or id="register"
//to open the respective popups
