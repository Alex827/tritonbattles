
//This is the function that closes the pop-up
function endBlackout1(){
$(".blackout").css("display", "none");
$(".msgbox1").css("display", "none");
}

//This is the function that closes the pop-up
function endBlackout2(){
$(".blackout").css("display", "none");
$(".msgbox2").css("display", "none");
}

//This is the function that starts the pop-up
function strtBlackout1(){
$(".msgbox1").css("display", "block");
$(".blackout").css("display", "block");
}

//This is the function that starts the pop-up
function strtBlackout2(){
$(".msgbox2").css("display", "block");
$(".blackout").css("display", "block");
}

//Sets the buttons to trigger the blackout on clicks
$(document).ready(function(){
$("#btn1").click(strtBlackout1); // open if btn is pressed
$(".blackout").click(endBlackout1); // close if click outside of popup
$(".closeBox").click(endBlackout1); // close if close btn clicked


});

$(document).ready(function(){
$("#btn2").click(strtBlackout2); // open if btn is pressed
$(".blackout").click(endBlackout2); // close if click outside of popup
$(".closeBox").click(endBlackout2); // close if close btn clicked


});