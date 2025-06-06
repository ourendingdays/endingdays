jQuery(document).ready(function () {

	/* particlesJS.load(@dom-id, @path-json, @callback (optional)); */
	particlesJS.load('particles-js', '/js/particles.json', function () {
		console.log('callback - particles.js config loaded');
	});
	
	$("#form").submit(function(){
		$.ajax({
			type: "POST",
			url: "mail.php",
			data: $(this).serialize()
		}).done(function(){
		document.getElementById('greeting').textContent = 'Thank you! I will get in touch with you soon';
		});
		return false;
	});

	setInitialArmageddon();

	getTimeLeftAuto();
  	setInterval(getTimeLeftAuto, 1000)
});

/**
 * Picks the next future event and the immediate previous one as LAST_ARMAGEDDON.
 *
 * @returns {void}
 */
function setInitialArmageddon() {
	const today = new Date();
  
	for (let i = 0; i < armageddons.length; i++) {
	  // Determine the Date object for this event
	  const ev = armageddons[i];
	  const evDate = (ev instanceof Date)
		? ev
		: new Date(ev, 11, 31, 22, 0, 0);
  
	  if (today < evDate) {
		// the next event is at index i
		
		// 1) set whichArmaggedon to i
		whichArmaggedon = i;
		
		// 2) set NON_DATE_ARMAGEDDON if ev was a numeric year
		NON_DATE_ARMAGEDDON = !(ev instanceof Date);
  
		// 3) set LAST_ARMAGEDDON to the previous event's date,
		//    or fall back to today if there's no previous.
		if (i > 0) {
		  const prev = armageddons[i - 1];
		  LAST_ARMAGEDDON = (prev instanceof Date)
			? prev
			: new Date(prev, 11, 31, 22, 0, 0);
		} else {
		  // no past event, just use today as the baseline
		  LAST_ARMAGEDDON = today;
		}
  
		// 4) finally update the UI with the next event
		worldEndingCounter(ev, descriptions[i]);
		return;
	  }
	}
  
	// If we get here, there's no future event: fallback
	whichArmaggedon = 0;
	NON_DATE_ARMAGEDDON = false;
	LAST_ARMAGEDDON = today;
	worldEndingCounter(armageddons[0], descriptions[0]);
  }
  

/**
 * Sets the height of the grid element to match the client window's height.
 *
 * This function retrieves the current height of the document's client area, converts it to a pixel string, 
 * logs the height for debugging purposes, and then sets the `height` CSS style of the element with the ID 
 * "height-id" to ensure it spans the entire visible height of the window.
 *
 * @returns {void}
 */
function getWindowHeight() {
    var windowHeight = document.documentElement.clientHeight;
    windowHeight = windowHeight + 'px';
    console.log('height of the working window = ' + windowHeight);
    document.getElementById('height-id').style.height = windowHeight;
}
getWindowHeight();

var modalWindow = document.getElementById('my-modal');
var button = document.getElementById('contact-me');
var inline = document.getElementById('close');

button.onclick = function() {
	modalWindow.style.display = 'block';
}
inline.onclick = function() {
	modalWindow.style.display = 'none';
}
window.onclick = function(event) {
	if(event.target == modalWindow) {
		modalWindow.style.display = 'none';
	}
}

var CLOCK = document.getElementById('clock');
var PROGRESS = document.getElementById('progress-meter');
var TEXT_COLOR = document.getElementById('progress-meter-p-color');
var TEXT_COLOR_TEXT = 'Percentage of time from previous End of the World to the next : ';
var AUTHOR = document.getElementById('p-author');
var DESCRIPTION = document.getElementById('p-description');

//when Page is loaded BODY will execute onload function onNextButtonClicked() and will change whichArmaggedon into 0
var whichArmaggedon = -1;
var chosenArmageddonAuto = armageddons[0];
var NON_DATE_ARMAGEDDON = false;

//last world ending to make a progress on page load
var LAST_ARMAGEDDON;

var chosenDescriptionAuto = descriptions[0];

/**
 * Processes the world ending event by setting the global Armageddon event and its description.
 *
 * @param {Object} chosenArmageddon - The object representing the chosen Armageddon event.
 * @param {Object} chosenDescription - The object containing the description and details of the event.
 */
function worldEndingCounter(chosenArmageddon, chosenDescription) {
	chosenArmageddonAuto = chosenArmageddon;
	chosenDescriptionAuto = chosenDescription;
}

//Information about our current armageddon
var armageddonYear; var armageddonMonth; var armageddonDate;
var armageddonHours; var armageddonMinutes; var armageddonSeconds0;

/**
 * Automatically counts how much time is left
 */
function getTimeLeftAuto() {
	const today = new Date();
	
	// Determining target date similar to above
	let targetDate;
	if (NON_DATE_ARMAGEDDON) {
	  targetDate = new Date(chosenArmageddonAuto, 11, 31, 22, 0, 0);
	} else {
	  targetDate = chosenArmageddonAuto;
	}
	
	const diffMs = targetDate - today;
	// Calculating days, hours, minutes, seconds directly from ms difference.
	const diffSeconds = Math.floor(diffMs / 1000) % 60;
	const diffMinutes = Math.floor(diffMs / (1000 * 60)) % 60;
	const diffHours   = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
	const diffDays    = Math.floor(diffMs / (1000 * 60 * 60 * 24));
	
	// Padding numbers to two digits
	const formattedHours = String(diffHours).padStart(2, '0');
	const formattedMinutes = String(diffMinutes).padStart(2, '0');
	const formattedSeconds = String(diffSeconds).padStart(2, '0');
	
	// Constructing a more human-readable string.
	CLOCK.textContent = `${diffDays} days ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
	
	// Computing progress
	const progressPercent = getProgressTime(today);
	const progressWidth = progressPercent + '%';
	
	// Creating a dynamic color from the time parts (this is just a quirky idea)
	const colorCurrent = '#' + formattedHours + formattedMinutes + formattedSeconds;
	
	// Applying the computed values
	PROGRESS.style.width = progressWidth;
	PROGRESS.style.background = colorCurrent;
	TEXT_COLOR.textContent = TEXT_COLOR_TEXT + progressWidth;
	TEXT_COLOR.style.color = colorCurrent;
	
	AUTHOR.textContent = chosenDescriptionAuto[0];
	DESCRIPTION.textContent = chosenDescriptionAuto[1];
  }
  
getTimeLeftAuto();
setInterval(getTimeLeftAuto, 1000);

function timeLeftOutput(leftYear, leftMonth, leftDate, leftHours, leftMinutes, leftSeconds) {
	var answerTimeLeft = '';

	if (leftYear) {
		answerTimeLeft += leftYear + '/';
	}
	if (leftMonth) {
		answerTimeLeft += '' + leftMonth + '/';
	}
	if (leftDate) {
		answerTimeLeft += '' + leftDate + ' '
	}
	if (leftHours) {
		answerTimeLeft += '' + leftHours + ':'
	}
	if (leftMinutes) {
		answerTimeLeft += '' + leftMinutes + ':'
	}
	answerTimeLeft += '' + leftSeconds;

	CLOCK.textContent = answerTimeLeft;
}

/**
 * 
 * Function for progress-meter. Compares last Armageddon with the one to come and with TODAY
 * 
 * @param {Date} today - The current date.
 * 
 * @returns {string} The Progressbar percentage
 */
function getProgressTime(today) {

	// Determining target (next Armageddon) date, converting to a Date if we use a numeric year.
	let targetDate;
	if (NON_DATE_ARMAGEDDON) {
	  // If chosenArmageddonAuto is a year, define the target date (using December 31, 22:00 UTC as before).
	  targetDate = new Date(chosenArmageddonAuto, 11, 31, 22, 0, 0);
	} else {
	  targetDate = chosenArmageddonAuto;
	}
	
	const totalDuration = targetDate.getTime() - LAST_ARMAGEDDON.getTime();
	const elapsedDuration = today.getTime() - LAST_ARMAGEDDON.getTime();
	// Calculating progress percentage and capping it at 100%
	const progressPercent = Math.min(100, (elapsedDuration / totalDuration) * 100);
	
	// Returning progress percentage as a formatted string
	return progressPercent.toFixed(2);  
  }
  
/**
 * Activates when the "Next" button is clicked.
 * Increments the global 'whichArmaggedon' variable and updates the current Armageddon event by calling checkArmageddon().
 *
 * @returns {void}
 */
function onNextButtonClicked() {
	whichArmaggedon++;
	checkArmageddon(whichArmaggedon);
}

/**
 * Activates when the "Last" button is clicked.
 * Decrements the global 'whichArmaggedon' variable and updates the current Armageddon event by calling checkArmageddon().
 *
 * @returns {void}
 */
function onLastButtonClicked() {
	whichArmaggedon--;
	checkArmageddon(whichArmaggedon);
}


/**
 * Checks and updates the current Armageddon event based on the provided index.
 *
 * This function examines the parameter `number` and determines whether it falls within the valid range of the 
 * pre-defined `armageddons` array. If it exceeds the range or is less than or equal to zero, it resets the index 
 * to 0 and disables the NON_DATE_ARMAGEDDON flag. If the index is greater than 12, NON_DATE_ARMAGEDDON is enabled; 
 * otherwise, it is disabled. Finally, it calls `worldEndingCounter()` with the Armageddon event and its description 
 * corresponding to the globally tracked index `whichArmagedgedon`.
 *
 * @param {number} number - The index representing the selected Armageddon event.
 * @returns {void}
 */
function checkArmageddon(number) {
    if (number > armageddons.length - 1 || number <= 0) {
        worldEndingCounter(armageddons[0], descriptions[0]);
        whichArmaggedon = 0;
        NON_DATE_ARMAGEDDON = false;
    } else if (number > 12) {
        NON_DATE_ARMAGEDDON = true;
    } else {
        NON_DATE_ARMAGEDDON = false;
    }
    worldEndingCounter(armageddons[whichArmaggedon], descriptions[whichArmaggedon]);
}
