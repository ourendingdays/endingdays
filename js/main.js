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

});

//getting width for XY grid to set .grid-y properly on the whole size of the screen
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
var TEXT_COLOR_TEXT = 'time from previous End of the World to the next : ';
var AUTHOR = document.getElementById('p-author');
var DESCRIPTION = document.getElementById('p-description');

//when Page is loaded BODY will execute onload function onNextButtonClicked() and will change whichArmaggedon into 0
var whichArmaggedon = -1;

//last world anding to make a progress on page load
var LAST_ARMAGEDDON = new Date(2017, 08, 23, 24, 00, 00);
//Dates of supposed Armageddons
var armageddon2020 = new Date(2020, 11, 31, 24, 00, 00);
var armageddon2021 = new Date(2021, 11, 31, 24, 00, 00);
var armageddon2026 = new Date(2026, 11, 31, 24, 00, 00);
var armegeddon2036 = new Date(2036, 11, 31, 24, 00, 00);
var armageddon2060 = new Date(2060, 11, 31, 24, 00, 00);
var armageddon2129 = new Date(2129, 11, 31, 24, 00, 00);
var armageddon2239 = new Date(2239, 11, 31, 24, 00, 00);
var armageddon2242 = new Date(2242, 11, 31, 24, 00, 00);
var armageddon2280 = new Date(2280, 11, 31, 24, 00, 00);
var armageddon2780 = new Date(2780, 11, 31, 24, 00, 00);
var armageddon2892 = new Date(2892, 11, 31, 24, 00, 00);
var armageddon3797 = new Date(3797, 11, 31, 24, 00, 00);
var armageddon5079 = new Date(5079, 11, 31, 24, 00, 00);

////////More then 5 charecters Date does not allow, so year 300 000 cannot be written in Date object
var armageddon3TY = 300000;
var armageddon5TY = 500000;
var armageddon1M = 1000000;
var armageddon100M = 100000000;
var armageddon500M = 500000000;
var armageddon600M = 600000000;
var armageddon1B = 1000000000;
var armageddon1_3B = 1300000000;
var armageddon7_59B = 7590000000;
var armageddon22B = 22000000000;

//13 armageddons have Date object, for the rest after armageddon5079 we need a new function
var armageddons = [armageddon2020, armageddon2021, armageddon2026, armegeddon2036, armageddon2060, armageddon2129, armageddon2239, armageddon2242, armageddon2280, armageddon2780, armageddon2892, armageddon3797, armageddon5079, armageddon3TY, armageddon5TY, armageddon1M, armageddon100M, armageddon500M, armageddon600M, armageddon1B, armageddon1_3B, armageddon7_59B, armageddon22B];

var chosenArmageddonAuto = armageddons[0];
var NON_DATE_ARMAGEDDON = false;

//Description of each Armageddon
var description2020 = ['2020', 'In This year, Jeane Dixon claims, Jesus will return to defeat the unholy trinity of the Antichrist, Satan, and the False prophet between 2020 and 2037.'];
var description2021 = ['2021', 'F. Kenton Beshore Predicted  the Second Coming of Jesus between 2018 and 2028 and the Rapture by 2021 at the latest.'];
var description2026 = ['2026', " Messiah Foundation International says an asteroid will collide with Earth in accordance with Riaz Ahmed Gohar Shahi's predictions in The Religion of God."];
var description2036 = ['2036', 'NASA says an asteroid (99942) Apophis smashes into Earth'];
var description2060 = ['2060', 'Isaac Newton in his published manuscript says an aocalupses to be after year 2026'];
var description2129 = ['2129', "Said Nursî's (this Sunni Muslim theologian) prediction"];
var description2239 = ['2239', "According to an opinion about the Talmud in mainstream Orthodox Judaism, the Messiah will come within 6000 years of the creation of Adam, and the world may be destroyed 1000 years later. Between 2239 and 3239"];
var description2242 = ['2242', "End of the world by the theory that our Sun will be destroyed"];
var description2280 = ['2280', "Rashad Khalifa(Egyptian-American biochemist's) researched the Quran and claimed the world will end during that year."];
var description2780 = ['2780', "The End of the world according to the prophetic icons, written in the late 18th century according to the predictions of the Abel the Seer (Abel the Monk)"];
var description2892 = ['2892', "Another End of the World by Abel the Monk (Vasilii Vasiliev)"];
var description3797 = ['3797', 'The date of The End of the World, written by Nostradamus in "Letter to the Son of Caesar"'];
var description5079 = ['5079', "An other prediction allegedly by Baba Vanga"];

var description3TY = ['3 thousand years', 'Peter Tuthill expects WR 104 (a part of a tripple star) to explode in a supernova producing a gamma ray burst that could pose a threat to life on Earth'];
var description5TY = ['5 thousand years', '	Nick Bostrom believes that Earth will have likely been hit by an asteroid of roughly 1 km in diameter'];
var description1M = ['1 million years', 'The Geological Society says that Earth will undergone a supervolcanic eruption large enough to erupt 3,200 km3 of magma'];
var description100M = ['100 milion years', 'Stephen A. Nelson claims that Earth will have likely been hit by an asteroid about 10–15 km in diameter '];
var description500M = ['500 million years', 'James Kasting says that the level of carbon dioxide in the atmosphere will drop dramatically, making Earth uninhabitable.'];
var description600M = ['600 million years', "Anne Minard - a gamma ray burst, or massive, hyperenergetic supernova, occurs within 6,500 light-years of Earth; close enough for its rays to affect Earth's ozone layer and potentially trigger a mass extinction"];
var description1B = ['1 billion years', "The estimated end of the Sun's current phase of development, after which it will swell into a red giant, either swallowing Earth or at least completely scorching it"];
var description1_3B = ['1.3 billion years', 'It is estimated that all eukaryotic life will die out due to carbon dioxide starvation. Only prokaryotes will remain'];
var description7_59B = ['7.59 billion years', 'David Powell believes that Earth and the Moon will be most likely destroyed by falling into the Sun'];
var description22B = ['22 billion years', 'The end of the Universe in the Big Rip scenario'];

var descriptions = [description2020, description2021, description2026, description2036, description2060, description2129, description2239, description2242, description2280, description2780, description2892, description3797, description5079, description3TY, description5TY, description1M, description100M, description500M, description600M, description1B, description1_3B, description7_59B, description22B];

var chosenDescriptionAuto = descriptions[0];

//the MAIN function
function worldEndingCounter(chosenArmageddon, chosenDescription) {
	chosenArmageddonAuto = chosenArmageddon;
	chosenDescriptionAuto = chosenDescription;
}

//Information about our current armageddon
var armageddonYear; var armageddonMonth; var armageddonDate;
var armageddonHours; var armageddonMinutes; var armageddonSeconds0;

//automatically counts how much left
function getTimeLeftAuto() {

	var today = new Date();

	//Year, Month, Date, Hours, Minutes, Seconds of TODAY
	var todayYear = today.getUTCFullYear();
	var todayMonth = today.getUTCMonth();
	var todayDate = today.getUTCDate();
	var todayHours = today.getUTCHours();
	var todayMinutes = today.getUTCMinutes();
	var todaySeconds = today.getUTCSeconds();

	//armageddons with Date object are just 12, so for the rest 10 of them I need a new functionality
	if (NON_DATE_ARMAGEDDON) {
		//chosenArmageddonAuto has JUST YEAR. Month = 11 ( January = 0, December = 11), Date = 31, Hours = 22 (UTC BUG), Minutes = 00, Seconds = 00
		armageddonYear = chosenArmageddonAuto;
		armageddonMonth = 11;
		armageddonDate = 31;
		armageddonHours = 22;
		armageddonMinutes = 00;
		armageddonSeconds = 00;
	} else {
		//Year, Month, Date, Hours, Minutes, Seconds of ARMAGEDDON
		armageddonYear = chosenArmageddonAuto.getUTCFullYear();
		armageddonMonth = chosenArmageddonAuto.getUTCMonth();
		armageddonDate = chosenArmageddonAuto.getUTCDate();
		//This I don't even need to find, because hours, minutes and seconds are default = 24h, 00m, 00s. But you need to remember, that 00m and 00s are actually 60m and 60s
		armageddonHours = chosenArmageddonAuto.getUTCHours();
		armageddonMinutes = chosenArmageddonAuto.getUTCMinutes();
		armageddonSeconds = chosenArmageddonAuto.getUTCSeconds();
	}
	var leftYear = armageddonYear - todayYear;
	var leftMonth = armageddonMonth - todayMonth;
	var leftDate = armageddonDate - todayDate;
	var leftHours = Math.abs(armageddonHours - todayHours);
	var leftMinutes = 59 - todayMinutes;
	var leftSeconds = 59 - todaySeconds;

	if (leftHours.toString().length < 2) {
		leftHours = '0' + leftHours;
	}
	if (leftMinutes.toString().length < 2) {
		leftMinutes = '0' + leftMinutes;
	}
	if (leftSeconds.toString().length < 2) {
		leftSeconds = '0' + leftSeconds;
	}

	timeLeftOutput(leftYear, leftMonth, leftDate, leftHours, leftMinutes, leftSeconds);

	var space = getProgressTime(today);
	space +='%';

	var colorCurrrent = '#' + leftHours + leftMinutes + leftSeconds;
	PROGRESS.style.background = colorCurrrent;
	PROGRESS.style.width = space;
	TEXT_COLOR.textContent = TEXT_COLOR_TEXT + space;
	TEXT_COLOR.style.color = colorCurrrent;

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

//function for progress-meter. Compares last Arm with the one to come and with TODAY
function getProgressTime(today_P) {
	//current armagedon (chosenArmageddonAuto) I have from function getTimeLeftAuto
	
	var todayYear = today_P.getUTCFullYear();
	var todayMonth = today_P.getUTCMonth();
	var todayDate = today_P.getUTCDate();
	var todayHours = today_P.getUTCHours();
	var todayMinutes = today_P.getUTCMinutes();
	var todaySeconds = today_P.getUTCSeconds();
	
	var lastArmageddonYear = LAST_ARMAGEDDON.getUTCFullYear();
	var lastArmageddonMonth = LAST_ARMAGEDDON.getUTCMonth();
	var lastArmageddonDate = LAST_ARMAGEDDON.getUTCDate();
	var lastArmageddonHours = LAST_ARMAGEDDON.getUTCHours();
	var lastArmageddonMinutes = LAST_ARMAGEDDON.getUTCMinutes();
	var lastArmageddonSeconds = LAST_ARMAGEDDON.getUTCSeconds();
	
	//Getting Progress between Last and Today
	var LTYear = todayYear - lastArmageddonYear;
	var LTMonth = todayMonth - lastArmageddonMonth;
	var LTDate = todayDate - lastArmageddonDate;
	var LTHours = todayHours - lastArmageddonHours;
	var LTMinutes = todayMinutes - lastArmageddonMinutes;
	var LTSeconds = todaySeconds - lastArmageddonSeconds;
	
	var LFYear = armageddonYear - lastArmageddonYear;
	var LFMonth = armageddonMonth - lastArmageddonMonth;
	var LFDate = armageddonDate - lastArmageddonDate;
	var LFHours = 0;
	var LFMinutes = 0;
	var LFSeconds = 0;
	
	var progressLT_Seconds = LTSeconds + (LTMinutes * 60) + (LTHours * 60 * 60) + (LTDate * 24 * 60 * 60) + (LTMonth * 24 * 60 * 60 * 30) + (LTYear * 24 * 60 * 60 * 30 * 365);
	var progressLF_Seconds = (LFYear * 24 * 60 * 60 * 30 * 365) + (LFMonth * 24 * 60 * 60 * 30) + (LTDate * 24 * 60 * 60);
	
	var progressWidth = (progressLT_Seconds * 100)/progressLF_Seconds * 100;
	
	var progressWidthMin = progressWidth.toFixed(4);
	
	return progressWidthMin;
}

function onNextButtonClicked() {
	whichArmaggedon++;
	checkArmageddon(whichArmaggedon);
}

function onLastButtonClicked() {
	whichArmaggedon--;
	checkArmageddon(whichArmaggedon);
}

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
