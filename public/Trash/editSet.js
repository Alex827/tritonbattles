$(document).ready(function() {

	$("#title1").show();
	$("#content1").show();
	$("#title2").hide();
	$("#content2").hide();

	$('#save').click(function() {
		addCheckbox($('#txtName').val());
		clearText();
	});

	$('#mc').click(function(){
		$("#title1").show();
		$("#content1").show();
		$("#title2").hide();
		$("#content2").hide();
	});

	$("#sa").click(function(){
		$("#title1").hide();
		$("#content1").hide();
		$("#title2").show();
		$("#content2").show();
	});
});

function displayContents(){
	var answers = document.getElementById("answers");
	var choices = document.getElementsByClassName("choice");
	var flipButton = document.getElementById("flipButton");
	var solution = document.getElementById("solution");
    var answerToFill = document.getElementsByClassName("answer-field");
    var correctSolutions = document.getElementsByClassName("correctSolution");

	document.getElementById("question").innerHTML = document.getElementById("question-field").value;

    for(i = 0; i < 4; i++) {
		choices[i].removeAttribute("hidden");
		choices[i].innerHTML = answerToFill[i].value.trim();
        if( correctSolutions[i].checked ) {
            solution.innerHTML = answerToFill[i].value.trim();
        }
	}
}

//function addCheckbox(text_input) {
//	var container = $('#form');
//	var inputs = container.find('input');
//	var id = inputs.length+1;
//	var default_text = document.getElementById("txtName").defaultValue;
//
//	if(text_input != default_text){
//
//		$('<input />', {
//			type: 'checkbox',
//			id: 'cb'+id,
//		}).appendTo(container);
//
//		$('<label />', {
//			id: 'lb'+id,
//			text: text_input
//		}).appendTo(container);
//
//		$('<br />', {
//		}).appendTo(container);
//
//	}
//}

//function clearText(){
//	document.getElementById("txtName").value="";
//}

//$(document).ready( function() {
//	// when the flip button is clicked
//	$("#flipButton").click(function() {
//		// active means it is being shown
//		if( $('.front').hasClass('active') ) {
//			// rotate the card to show back
//			$(".flipper").css( {transform: "rotateY(180deg)"} );
//			// remove the active class and give it to the back card
//			$('.front').removeClass('active');
//			$('.back').addClass('active');
//		}
//		else { // if the back is being shown
//			// rotate the card to show front
//			$('.flipper').css( {transform: "rotateY(0deg)"});
//			$('.back').removeClass('active');
//			$('.front').addClass('active');
//		}
//	})
//
//
//
//});


