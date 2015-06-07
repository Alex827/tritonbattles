
var main = function() {
	/*function flipCard() {
		var $flipper = document.getElementsByClassName("flipper");
		$flipper[0].style.transform="rotateY(180deg)";
	}*/

	$(".flashcard").on('click' ,function() {
		if($('.front').hasClass('.active')) {
			$(".flipper").css( {transform: "rotateY(180deg)"} );
			$('.front').removeClass('.active');
			$('.back').addClass('.active');
			
		}
		else {
			$('.flipper').css( {transform: "rotateY(0deg)"});
			$('.back').removeClass('.active');
			$('.front').addClass('.active');
			
		}
	})
	return true;

}

$(document).ready(main); 