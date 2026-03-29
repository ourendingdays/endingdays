// ---------------------------------------------------------------------------
// State — single source of truth
// ---------------------------------------------------------------------------
let state = {
    events: [],   // NormalizedEvent[] built once at startup
    index:  0,    // current event index
    timer:  null  // setInterval handle
};

// ---------------------------------------------------------------------------
// Dom manipulations
// ---------------------------------------------------------------------------
let CLOCK = document.getElementById('clock');
let PROGRESS = document.getElementById('progress-meter');
let TEXT_COLOR = document.getElementById('progress-meter-p-color');
let TEXT_COLOR_TEXT = 'Percentage of time from previous End of the World to the next : ';
let AUTHOR = document.getElementById('p-author');
let DESCRIPTION = document.getElementById('p-description');

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
    let windowHeight = document.documentElement.clientHeight;
    windowHeight = windowHeight + 'px';
    document.getElementById('height-id').style.height = windowHeight;
}

jQuery(document).ready(function () {
    getWindowHeight();

    // Armageddon events are defined in armageddonData.js as ARMAGEDDONS and DESCRIPTIONS.
	state.events = buildEventList(ARMAGEDDONS, DESCRIPTIONS);
    state.index  = setInitialDoomsday(state.events, new Date());
    console.log(`Initial Doomsday is set to index: ${state.index}, year: ${state.events[state.index].year}`);
    render_doomsday();
});

// ---------------------------------------------------------------------------
// Data normalizations
//
// Each raw entry (Date | number) becomes 
// { 
//  date: Date, 
//  year: string, 
//  detail: string 
// }.
// Numeric years represent far-future events stored as integers; convert them
// to Dec 31 22:00 of that year, matching the convention used in main.js.
// ---------------------------------------------------------------------------

/**
 * 
 * @param {string|number|Date} raw 
 * @param {Array} desc 
 * @returns 
 */
function normalizeEvent(raw, desc) {
    let date = (raw instanceof Date) ? raw : new Date(raw, 11, 31, 22, 0, 0);
    return { date: date, year: desc[0], detail: desc[1] };
}

/**
 * Populates the list of normalized events from the raw data arrays.
 * 
 * @param {Array} rawEvents : List of raw events, each either a Date or a numeric year.
 * @param {Array} rawDescs  : List of descriptions corresponding to each event, where each description is an array [year, detail].
 * @returns {Array} List of normalized events with date, year, and detail.
 */
function buildEventList(rawEvents, rawDescs) {
    let result = [];
    for (let i = 0; i < rawEvents.length; i++) {
        result.push(normalizeEvent(rawEvents[i], rawDescs[i]));
    }
    return result;
}


// ---------------------------------------------------------------------------
// Button Navigation
// ---------------------------------------------------------------------------

function onPrevButtonClicked() {
    state.index = Math.max(0, state.index - 1);
    render_doomsday();
}

function onNextButtonClicked() {
    state.index = Math.min(state.events.length - 1, state.index + 1);
    render_doomsday();
}

// ---------------------------------------------------------------------------
// Script Logic
// ---------------------------------------------------------------------------

/**
 * Returns the index of the first event in the future; falls back to 0
 * 
 * @param {Array} events  
 * @param {Date} now 
 * @returns {number} Index of the initial doomsday event
 */
function setInitialDoomsday(events, now) {
    for (let i = 0; i < events.length; i++) {
        if (events[i].date > now) return i;
    }
    return 0;
}

/**
 * Renders the current doomsday event based on state.index
 * 
 * @returns void    
 */
function render_doomsday() {
    let event       = state.events[state.index];
    let now         = new Date();
    let prevDate    = getPrevDate(state.events, state.index, now);

    let timeLeft    = computeTimeLeft(event.date, now);
    let progress    = computeProgress(prevDate, event.date, now);
    let progressPer = Math.round(progress * 100);
    let color       = buildColor(timeLeft.hours, timeLeft.minutes, timeLeft.seconds);

    CLOCK.textContent = timeLeft.days + ' days ' + pad(timeLeft.hours) + ':' + pad(timeLeft.minutes) + ':' + pad(timeLeft.seconds);
    PROGRESS.style.width = progressPer + '%';
    PROGRESS.style.background = color;

    TEXT_COLOR.textContent = TEXT_COLOR_TEXT + progressPer + '%';
    TEXT_COLOR.style.background = color;
    console.log('Setting text color to:', color);
    TEXT_COLOR.style.color = color;

    AUTHOR.textContent = event.year;
    DESCRIPTION.textContent = event.detail;
}

// ---------------------------------------------------------------------------
// Rendering functions
// ---------------------------------------------------------------------------

/**
 * Returns the progress-bar baseline: the previous event's date, or `now` when we're already at the first event.
 * @param {Array} events  List of normalized events
 * @param {number} index  Current event index
 * @param {Date} now      Current date/time
 * @returns {Date} Previous event's date or `now` if at the first event
 */
function getPrevDate(events, index, now) {
    return (index > 0) ? events[index - 1].date : now;
}

/** Breaks the ms difference into days/hours/minutes/seconds (never negative). 
 * @param {Date} target Target date/time
 * @param {Date} now    Current date/time
 * @returns {Object}    Object with properties: days, hours, minutes, seconds
*/
function computeTimeLeft(target, now) {
    console.log('Computing time left until:', target, 'from now:', now);
    let diffMs = Math.max(0, target - now);
    return {
        days:    Math.floor(diffMs / (1000 * 60 * 60 * 24)),
        hours:   Math.floor(diffMs / (1000 * 60 * 60)) % 24,
        minutes: Math.floor(diffMs / (1000 * 60)) % 60,
        seconds: Math.floor(diffMs / 1000) % 60
    };
}

/** Elapsed ratio of now between prevDate and nextDate, clamped to [0, 1]. 
 * @param {Date} prevDate  Previous event's date (or `now` if at first event)
 * @param {Date} nextDate  Next event's date
 * @param {Date} now       Current date/time
 * @returns {number} Progress ratio between 0 and 1
*/
function computeProgress(prevDate, nextDate, now) {
    let start   = prevDate.getTime();
    let end     = nextDate.getTime();
    let elapsed = now.getTime() - start;
    let total   = Math.max(1, end - start);  // guard against zero-length range
    return Math.max(0, Math.min(1, elapsed / total));
}

/** Produces a "#HHMMSS" hex color from the live countdown — keeps the fun trick. */
function buildColor(h, m, s) {
    return '#' + pad(h) + pad(m) + pad(s);
}

function pad(n) {
    return String(n).padStart(2, '0');
}