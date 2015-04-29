var x_width = Math.min(document.documentElement.clientWidth, window.innerWidth || 0) - 50
var y_width = Math.min(document.documentElement.clientHeight, window.innerHeight || 0) - 204
x_width = Math.min(x_width, y_width)
y_width = x_width

var colorBubbleSize = Math.min(x_width, y_width) / 15;
var x_center = x_width / 2
var y_center = y_width / 2
var radius = Math.min(x_center, y_center) - colorBubbleSize * 2
var woord
var canvas
var startTime = new Date().getTime()
var runningTimeout
var testPosition = 0
var testVariables = {}
/*
var colors_locations = [
	[0, 0, "#ff0000"]
	, [0,0,  "#00ff00"]
	, [0,0, "#0000ff"]
	, [0,0, "#aaaaaa"]
	, [0, 0, "#ffff00"]
	, [0, 0, "#00ffff"]
	, [0, 0, "#ff00ff"]
	, [0, 0, "#000000"]
];
*/
var colors_locations = [
	[0, 0, "#ff0000"]
	, [0,0, "#0000ff"]
/*	, [0,0, "#000000"] Black is commented for now; the dot is black too.. */
	, [0,0, "#00ff00"]
	, [0, 0, "#ff69B4"]
	, [0, 0, "#008000"]
	, [0, 0, "#FFA500"]
	, [0, 0, "#00ffff"]
	, [0, 0, "#800080"]
	, [0, 0, "#808080"]
	, [0, 0, "#8B4513"]
	, [0, 0, "#90EE90"]
	, [0, 0, "#BDB76B"]
	, [0, 0, "#D3D3D3"] 
	, [0, 0, "#FFFF00"]
	
	, [0, 0, "#000080"]
];

for(i = 0; i < colors_locations.length; i++)
{
	angle = ((2 * Math.PI) / colors_locations.length) * i;
	x = radius * Math.cos(angle) + x_center;
	y = radius * Math.sin(angle) + y_center;
	colors_locations[i][0] = x;
	colors_locations[i][1] = y;
}


function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function toggle_visibility(className) {
    elements = document.getElementsByClassName(className);
    for (var i = 0; i < elements.length; i++) {
        elements[i].style.display = elements[i].style.display == 'block' ? 'none' : 'block';
    }
}

function deep_shuffle(array_array) {
	for(var i = 0; i < array_array.length; i++)
	{
		array_array[i] = shuffle(array_array[i]);
	}
	return array_array
}

function newWord(word_text, word_color) {
	canvas.clear();
	woord = new fabric.Text(word_text, {left: x_center, top: y_center, originX: 'center', originY: 'center', 'selectable': false, 'fill': word_color, fontFamily: 'Helvetica,Arial'});
	canvas.add(woord);
	
	for(i = 0; i < colors_locations.length; i++) {
		canvas.add(
			new fabric.Circle({
				left: colors_locations[i][0],
				top: colors_locations[i][1],
				fill: colors_locations[i][2],
				radius: colorBubbleSize,
				'selectable': false,
				originX: 'center',
				originY: 'center'
			})
		);
	}	
	canvas.renderAll();
}

function setupCanvas(canvas_id) {
	canvas = new fabric.Canvas('c', {'hoverCursor': 'pointer', 'selection': false, 'width': x_width, 'height': y_width});
	document.getElementById("c").fabric = canvas;
	
}

function showAnnouncement(jsonExpPart) {
	canvas.clear();
	canvas.renderAll();
	toggle_visibility("canvas-container");
	toggle_visibility("announcement");
	
	document.getElementById("announcement-title").innerHTML = jsonExpPart.title;
	document.getElementById("announcement-contents").innerHTML = jsonExpPart.tekst;
	if(jsonExpPart.buttondisplay) {
		document.getElementById("announcement-ok").style.display = "inline";
		document.getElementById("announcement-ok-text").innerHTML = jsonExpPart.buttontext
	}
	else 
		document.getElementById("announcement-ok").style.display = "none";
	
	document.getElementById("announcement-ok").onclick = function() {
		toggle_visibility("canvas-container");
		toggle_visibility("announcement");
		continueTest(currentTest);
	};
}

function checkValue(jsonExpPart) {
	if(testVariables[jsonExpPart.variable] != jsonExpPart.requiredValue)
	{
		testPosition = 0;
		continueTest(jsonExpPart.notAgreed);
		// document.getElementById("announcement-title").innerHTML = jsonExpPart.notAgreed.title;
		// document.getElementById("announcement-contents").innerHTML = jsonExpPart.notAgreed.tekst;
		// document.getElementById("announcement-ok").style.display = "none";
		// toggle_visibility("announcement");
	}
	else {
		continueTest(currentTest);
	}
}

function checkRange(jsonExpPart) {
	if(testVariables[jsonExpPart.variable] < jsonExpPart.minimum || testVariables[jsonExpPart.variable] > jsonExpPart.maximum) {
		testPosition = 0;
		continueTest(jsonExpPart.notAgreed);
		// document.getElementById("announcement-title").innerHTML = jsonExpPart.notAgreed.title;
		// document.getElementById("announcement-contents").innerHTML = jsonExpPart.notAgreed.tekst;
		// document.getElementById("announcement-ok").style.display = "none";
		// toggle_visibility("announcement");
	} else {
		continueTest(currentTest);
	}
}

function performCheck(jsonExpPart) {
	switch(jsonExpPart.checkType) {
		case "range":
			checkRange(jsonExpPart);
			break;
		case "value":
			checkValue(jsonExpPart);
			break;
	}
}

function fillFormDate(jsonExpPart) {
	keuzeHTML = ""
	keuzeHTML += "<select name='day' id='form-choice-day'>"
	for(i = 1; i <= 31; i++)
	{
		keuzeHTML += "<option value='" + i + "'>" + i + "</option>"
	}
	keuzeHTML += "</select>"
	keuzeHTML += "<select name='month' id='form-choice-month'>"
	for(i = 1; i <= 12; i++)
	{
		keuzeHTML += "<option value='" + i + "'>" + i + "</option>"
	}
	keuzeHTML += "</select>"
	keuzeHTML += "<select name='year' id='form-choice-year'>"
	for(i = 2010; i >= 1900; i--)
	{
		keuzeHTML += "<option value='" + i + "'>" + i + "</option>"
	}
	keuzeHTML += "</select>"
	
	
	document.getElementById("form-response").innerHTML = keuzeHTML;
	
	document.getElementById("form-choice").onclick = function() {
		birthyear = document.getElementById('form-choice-year').value
		birthmonth = document.getElementById('form-choice-month').value
		birthday = document.getElementById('form-choice-day').value
		birthdate = "" + birthyear + "-" + birthmonth + "-" + birthday
		
		logging[logging.length] = {
			"event": "question",
			"variable": jsonExpPart.variable,
			"response": birthdate
		}
		testVariables[jsonExpPart.variable] = new Date(birthyear, birthmonth, birthday)
		toggle_visibility("canvas-container");
		toggle_visibility("form-dialog");
		continueTest(currentTest);
	};
}


function fillFormBoolean(jsonExpPart) {
	radioButtonName = "form-choice"
	
	keuzeHTML = "<input name='" + radioButtonName + "' id='form-choice-true' type='radio' value='1'><label for='form-choice-true' selected>" + jsonExpPart.responseen.true + "</label>"
	keuzeHTML += "<input name='" + radioButtonName + "' id='form-choice-false' type='radio' value='0'><label for='form-choice-false'>" + jsonExpPart.responseen.false + "</label>"
	
	
	document.getElementById("form-response").innerHTML = keuzeHTML;
	
	// form-response moet gevuld worden met de form-elementen waarmee response gegeven kan worden.
	document.getElementById("form-choice").onclick = function() {
		radioButtons = document.getElementsByName(radioButtonName);
		response = "";
		for(i = 0; i < radioButtons.length; i++)
		{
			if(radioButtons[i].checked)
				response = radioButtons[i];
		}
		
		testVariables[jsonExpPart.variable] = response.value;
		logging[logging.length] = {
			"event": "question",
			"variable": jsonExpPart.variable,
			"response": response.value
		};
		
		toggle_visibility("canvas-container");
		toggle_visibility("form-dialog");
		continueTest(currentTest);
	};
}

function askFormQuestion(jsonExpPart) {
	canvas.clear();
	canvas.renderAll();
	toggle_visibility("canvas-container");
	toggle_visibility("form-dialog");
	
	document.getElementById("form-title").innerHTML = jsonExpPart.title;
	document.getElementById("form-tekst").innerHTML = jsonExpPart.tekst;
	document.getElementById("form-question").innerHTML = jsonExpPart.question;
	switch(jsonExpPart.checkType) {
		case "date":
			fillFormDate(jsonExpPart);
			break;
		case "boolean":
			fillFormBoolean(jsonExpPart);
			break;
	}
}


function showAgreement(jsonExpPart) {
	canvas.clear();
	canvas.renderAll();
	
	// Canvas is visible by default, need to be invisible for the HTML area to be visible. Toggle the visibility.
	toggle_visibility("canvas-container");
	toggle_visibility("agreement-dialog");
	
	document.getElementById("agreement-title").innerHTML = jsonExpPart.title;
	document.getElementById("agreement-contents").innerHTML = jsonExpPart.tekst;
	document.getElementById("not-agreement-button").onclick = function() {
		toggle_visibility("canvas-container");
		toggle_visibility("agreement-dialog");
		testPosition = 0;
		continueTest(jsonExpPart.notAgreed);
	}
	// Turn back the visibility of the canvas
	document.getElementById("agreement-button").onclick = function() {
		toggle_visibility("canvas-container");
		toggle_visibility("agreement-dialog");
		continueTest(currentTest);
	};
	document.getElementById("back-agreement-button").onclick = function() {
		toggle_visibility("canvas-container");
		toggle_visibility("agreement-dialog");
		testPosition -= 2;
		continueTest(currentTest);
	};
	document.getElementById("back-agreement-button").style.display = jsonExpPart.backButton ? "inline" : "none";
}

function startStroopTest(jsonExpPart)
{
	words = deep_shuffle(jsonExpPart.words);
	colors = jsonExpPart.colors;
	wordgroup_counter = 0;
	word_counter = 0;
	executeStroopTest(words, colors, wordgroup_counter, word_counter, false);
}

function showCenter(words, colors, wordgroup_counter, word_counter)
{
	canvas.clear();
	c = new fabric.Circle({
		left: x_center,
		top: y_center,
		originX: 'center',
		originY: 'center',
		radius: colorBubbleSize / 2,
		selectable: false,
		fill: '#000000'
	});
	canvas.add(c);
	
	canvas.on('mouse:down', function(options) {
			if(options.target && options.target.type == 'circle') {
				// Remove event
				canvas.off('mouse:down')
				
				// Clear canvas
				canvas.clear();
				canvas.renderAll();
				executeStroopTest(words, colors, wordgroup_counter, word_counter, true);
			}
		});
		
	canvas.renderAll();
}

function showWord(words, colors, wordgroup_counter, word_counter)
{
		wordColor = colors_locations[Math.floor(Math.random() * colors_locations.length)][2]
		wordText = words[wordgroup_counter][word_counter]
		newWord(wordText, wordColor)
		
		canvas.on('mouse:down', function(options) {
			if(options.target && options.target.type == 'circle') {
				// Remove event
				canvas.off('mouse:down')
				
				// Clear canvas
				canvas.clear();
				canvas.renderAll();

				clearTimeout(runningTimeout);
				// registreren woord
				// registreren geklikte kleur
				// registreren juiste kleur
				// registreren tijd

				var endTime = new Date().getTime();
				var totalTime = endTime - startTime;
				logging[logging.length] = {
					"event": "click",
					"startTime": startTime,
					"endTime": endTime,
					"totalTime": totalTime,
					"word": wordText,
					"wordColor": wordColor,
					"clickedColor": options.target.fill
				}
				//woord.set({'text': time.toString()});
				// Tijd registreren
				
				// Verdergaan met volgende woord
				executeStroopTest(words, colors, wordgroup_counter, word_counter + 1, false);
				//canvas.clear();
			}
		});
		canvas.renderAll();
		
		runningTimeout = setTimeout(function() {
			endTime = new Date().getTime();
			var totalTime = endTime - startTime;
			// registeren gemiste woord
			// registreren gemiste kleur
			logging[logging.length] = {
				"event": "timeout",
				"startTime": startTime,
				"endTime": endTime,
				"totalTime": totalTime,
				"word": wordText,
				"wordColor": wordColor,
				"clickedColor": null
			}
			
			// Remove event
			canvas.off('mouse:down')

			// Clear canvas
			canvas.clear();
			canvas.renderAll();
			
			executeStroopTest(words, colors, wordgroup_counter, word_counter + 1, false);
		}, 3000)
		
		startTime = new Date().getTime()
}

function executeStroopTest(words, colors, wordgroup_counter, word_counter, show_word)
{
	if(wordgroup_counter < words.length && word_counter < words[wordgroup_counter].length)
	{
		if(show_word) {
			//alert("Wordgroup: " + wordgroup_counter + ", words: " + words.length + ", word_counter: " + word_counter + ", words[].length: " + words[wordgroup_counter].length);
			showWord(words, colors, wordgroup_counter, word_counter)
		} else {
			//alert("Wordgroup: " + wordgroup_counter + ", words: " + words.length + ", word_counter: " + word_counter + ", words[].length: " + words[wordgroup_counter].length);
			showCenter(words, colors, wordgroup_counter, word_counter);
		}
	} else if(wordgroup_counter < words.length) {
		executeStroopTest(words, colors, wordgroup_counter + 1, 0, show_word)
	} else {
		continueTest(currentTest);
	}
}

function startTest(jsonExp) {
	testPosition = 0;
	currentTest = jsonExp;
	setupCanvas('c');
	elements = document.getElementsByClassName("canvas-container");
	
	for (var i = 0; i < elements.length; i++) {
		elements[i].style.display = elements[i].style.display = 'block';
	}
	continueTest(currentTest);
}

function sendResults(JSONData) {
	$.ajax({
		type: 'POST',
		url: 'backend.php',
		contentType:"application/json; charset=utf-8",
		dataType:"json",
		data:  JSONData,
		// success: function(data){
			// alert("Result: " + data);
		// }   // Success Function
	}); // AJAX Call
	continueTest(currentTest);
}

function continueTest(jsonExp) {
	var currentTestPart
	if(jsonExp.length > testPosition)
	{
		currentTestPart = jsonExp[testPosition++]
		switch(currentTestPart.type) {
			case "form":
				askFormQuestion(currentTestPart)
				break;
			case "controle":
				performCheck(currentTestPart)
				break;
			case "announcement":
				showAnnouncement(currentTestPart)
				break;
			case "agreement":
				showAgreement(currentTestPart)
				break;
			case "choice":
				sendResults(JSON.stringify(logging));
				break;
			case "proef":
				// Fallthrough
			case "experiment":
				startStroopTest(currentTestPart)
				break;
		}
	} else {
		
	}
}