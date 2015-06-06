var i = 0;

function processForm() {
	i++;
	var q = document.newCardForm.question.value;
	var a = document.newCardForm.answer.value;
	var listed = '<div id="item' + i + '"><input type="checkbox" onclick="crossedOut(\'item'+ i + '\')" />' + "Question: " + q + " Answer: " + a + '</div>';
	document.getElementById("checkList").innerHTML += listed;
}

function crossedOut(item) {
	document.getElementById(item).className = "checked-off";
}
