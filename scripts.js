/* time periods in milliseconds */
var noOfMillisecondsInSecond = 1000,
	noOfMillisecondsInMinute = 60 * noOfMillisecondsInSecond,
	noOfMillisecondsInHour = 60 * noOfMillisecondsInMinute,
	noOfMillisecondsInDay = 24 * noOfMillisecondsInHour,
	noOfMillisecondsInWeek = 7 * noOfMillisecondsInDay;

var dateformat;

function processInput() {
	dateformat = $('input[name=month-order]:checked').val()
	$('#results').empty();
	var input = $('#input').val().trim().split('\n');
	for (var i=0; i < input.length; i++) {
		processLine(input[i]);
	};
}

function processLine(line) {
	line = normalise(line);
	var numOfDates = 0;

	var placeholders = line.match(/(today|now)/g);
	if (placeholders) {
		for (var i=0; i < placeholders.length; i++) {
			numOfDates++;
			line = line.replace(placeholders[i], new Date().getTime())
		}
	}

	var dates = line.match(/[0-9]{1,2}\/[0-9]{1,2}\/[0-9]{4}/g);
	if (dates) {
		for (var i=0; i < dates.length; i++) {
			numOfDates++;
			line = line.replace(dates[i], Date.parse(dates[i]));
		};
	};
	
	var additionArray = line.split(" + ");
	var millisecondSum = 0;
	for (var i=0; i < additionArray.length; i++) {
		millisecondSum += parseInt(additionArray[i]);
	};
	
	var result;
	if (numOfDates == 1) {
		result = new Date(millisecondSum);
	} else {
		result = formatTime(millisecondSum);
	}; 
	
	$('#results').append('<li><span title="'+line+'">'+result+'</span></li>');
	
}

function normalise(line) {
	line = convertToMilliseconds(line, line.match(/[0-9]+\s?(?:weeks|week|wks|wk)/g), noOfMillisecondsInWeek);
	line = convertToMilliseconds(line, line.match(/[0-9]+\s?(?:days|day)/g), noOfMillisecondsInDay);
	line = convertToMilliseconds(line, line.match(/[0-9]+\s?(?:hours|hour|hrs|hr)/g), noOfMillisecondsInHour);
	line = convertToMilliseconds(line, line.match(/[0-9]+\s?(?:minutes|minute|min)/g), noOfMillisecondsInMinute);
	line = convertToMilliseconds(line, line.match(/[0-9]+\s?(?:seconds|second|sec)/g), noOfMillisecondsInSecond);
	line = line.replace(' plus ', ' + ')
	line = line.replace(' minus ', ' - ')
	line = line.replace(' - ', ' + -')
	return line;
}

function convertToMilliseconds(line, match, multiplier) {
	if (match) {
		for (var i=0; i < match.length; i++) {
			var num = match[i].match(/[0-9]+/)[0] * multiplier;
			line = line.replace(match[i], num);
		};
	};
	return line;
}

function formatTime(milliseconds) {
	var isPositive = (milliseconds >= 0);
	var formattedTime = isPositive ? '+' : '-';
	milliseconds = Math.abs(milliseconds);
	if (milliseconds >= noOfMillisecondsInWeek) {
		var noOfWeeks = Math.floor(milliseconds / noOfMillisecondsInWeek);
		formattedTime = formattedTime + " " + noOfWeeks + " " + (noOfWeeks == 1 ? 'week' : 'weeks');
		milliseconds -= noOfWeeks * noOfMillisecondsInWeek;
	}
	if (milliseconds >= noOfMillisecondsInDay) {
		var noOfDays = Math.floor(milliseconds / noOfMillisecondsInDay);
		formattedTime = formattedTime + " " + noOfDays + " " + (noOfDays == 1 ? 'day' : 'days');
		milliseconds -= noOfDays * noOfMillisecondsInDay;
	}
	if (milliseconds >= noOfMillisecondsInHour) {
		var noOfHours = Math.floor(milliseconds / noOfMillisecondsInHour);
		formattedTime = formattedTime + " " + noOfHours + " " + (noOfHours == 1 ? 'hour' : 'hours');
		milliseconds -= noOfHours * noOfMillisecondsInHour;
	}
	if (milliseconds >= noOfMillisecondsInMinute) {
		var noOfMinutes = Math.floor(milliseconds / noOfMillisecondsInMinute);
		formattedTime = formattedTime + " " + noOfMinutes + " " + (noOfMinutes == 1 ? 'minute' : 'minutes');
		milliseconds -= noOfMinutes * noOfMillisecondsInMinute;
	}
	if (milliseconds >= noOfMillisecondsInSecond) {
		var noOfSeconds = Math.floor(milliseconds / noOfMillisecondsInSecond);
		formattedTime = formattedTime + " " + noOfSeconds + " " + (noOfSeconds == 1 ? 'second' : 'seconds');
		milliseconds -= noOfSeconds * noOfMillisecondsInSecond;
	}

	return formattedTime;
}

// stolen from http://stackoverflow.com/a/7180862
/*
$.fn.setCursorPosition = function(position){
    if(this.length == 0) return this;
    return $(this).setSelection(position, position);
}

$.fn.setSelection = function(selectionStart, selectionEnd) {
    if(this.length == 0) return this;
    input = this[0];

    if (input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd('character', selectionEnd);
        range.moveStart('character', selectionStart);
        range.select();
    } else if (input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    }

    return this;
}

$.fn.focusEnd = function(){
    this.setCursorPosition(this.val().length);
}
*/



$(document).ready(function(){
	processInput();
	setInterval(processInput, 5*noOfMillisecondsInSecond);
	$('#input').focus().keypress(function(event){
		if (event.which == 13) {
			processInput();
		}
	});
	
});