// ---------------------------------------------------------------------------
// State — single source of truth
// ---------------------------------------------------------------------------
let state = {
    events: [],   // NormalizedEvent[] built once at startup in the format { date: Date, year: string, detail: string }
    current_event_index:  0,    // current event index
    timer:  null, // setInterval handle
};

// ---------------------------------------------------------------------------
// Dom manipulations
// ---------------------------------------------------------------------------
let PERCENTAGE_TO_NEXT_TEXT = 'Percentage of time from previous End of the World to the next : ';
let PERCENTAGE_TO_PREV_TEXT = 'Percentage of time survived from previous End of the World until now : ';

let CLOCK = document.getElementById('clock');
let PROGRESS = document.getElementById('progress-meter');
let PROGRESS_PERCENTAGE = document.getElementById('progress-meter-percentage');
let AUTHOR = document.getElementById('p-author');
let DESCRIPTION = document.getElementById('p-description');

/**
 * Sets the #height-id of the grid element to match the client window's height. 
 * This ensures the grid fills the viewport vertically, which is important for the layout and styling of the page.
 * This function is called on page load to initialize the layout correctly.
 * 
 * Note: Do not delete, other than you rewrite the website with a different layout, this is required to make the page look good on different screen sizes.
 *
 * @returns {void}
 */
function getWindowHeight() {
    let windowHeight = document.documentElement.clientHeight + 'px';
    document.getElementById('height-id').style.height = windowHeight;
}

jQuery(document).ready(function () {
    getWindowHeight();

    // Armageddon events are defined in armageddonData.js as ARMAGEDDONS and DESCRIPTIONS.
	state.events = buildEventList(ARMAGEDDONS, DESCRIPTIONS); // Populates state variable with data
    state.current_event_index  = setInitialDoomsday(state.events, new Date()); // Sets next doomsday from today as an initial index
    console.log('Initial Doomsday is set in year:', state.events[state.current_event_index]['year']);
    
    render_doomsday();
});

// ---------------------------------------------------------------------------
// Data normalizations
// ---------------------------------------------------------------------------

/**
 * Each raw entry (Date | number) becomes { date: Date, year: string, detail: string }.
 * Some numeric years represent far-future events stored as integers; convert them to Dec 31 22:00 of that year.
 * @param {string|number|Date} raw 
 * @param {Array} desc 
 * @returns {Object} dictionary with keys: date (Date), year (string), detail (string)
 */
function normalizeEvent(raw, desc) {
    let date = (raw instanceof Date) ? raw : new Date(raw, 11, 31, 22, 0, 0);
    return { date: date, year: desc[0], detail: desc[1] };
}

/**
 * Populates the list of normalized events from the raw data arrays.
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
    state.current_event_index = Math.max(0, state.current_event_index - 1);
    console.log('Previous button clicked. New index:', state.current_event_index);
    
    render_doomsday();
}

function onNextButtonClicked() {
    state.current_event_index = Math.min(state.events.length - 1, state.current_event_index + 1);
    console.log('Next button clicked. New index:', state.current_event_index);
    
    render_doomsday();
}

// ---------------------------------------------------------------------------
// Script Logic
// ---------------------------------------------------------------------------

/**
 * Returns the index of the first event in the future; falls back to 0
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
 * Renders the current doomsday event based on state.current_event_index
 * Calculates the time in days/hours/minutes/seconds until the event.
 * Understands whether the event is in the past or future and calculates progress accordingly.
 * Updates the UI elements with the calculated time left, progress percentage, and event details.
 * This function is called on page load and whenever the user clicks the "Next" or "Previous" buttons to update the displayed doomsday event.
 * @returns void    
 */
function render_doomsday() {
    // State : { events: NormalizedEvent[], current_event_index: number, timer: setInterval handle }
    // Event : { date: Date, year: string, detail: string }
    let event       = state.events[state.current_event_index]; // doomsday event to render
    let now         = new Date();

    let timeLeft    = computeTimeLeft(event.date, now); // { days, hours, minutes, seconds }

    let progress, targetDate;
    if (now > event.date) {
        targetDate  = getNextDate(now);
        progress    = computeProgressToPrevDoomsday(targetDate, event.date, now);
    } else {
        targetDate  = getPrevDate(now);
        progress    = computeProgressToNextDoomsday(targetDate, event.date, now);
    }

    let progressPer = Math.round(progress * 100);
    let color       = buildColor(timeLeft.hours, timeLeft.minutes, timeLeft.seconds);


    // UI updates
    CLOCK.textContent = timeLeft.days + ' days ' + pad(timeLeft.hours) + ':' + pad(timeLeft.minutes) + ':' + pad(timeLeft.seconds);
    PROGRESS.style.width = progressPer + '%';
    PROGRESS.style.background = color;

    PROGRESS_PERCENTAGE.textContent = PERCENTAGE_TO_NEXT_TEXT + progressPer + '%';

    AUTHOR.textContent = event.year;
    DESCRIPTION.textContent = event.detail;
}

// ---------------------------------------------------------------------------
// Rendering functions
// ---------------------------------------------------------------------------

/**
 * Returns the previous event's date, or `now` when we're already at the first event.
 * Since we cannot go beyond the earliest possible date in the data, we assume today is the "previous event" when we're at the first index, which makes the progress bar show 0% and the time left show the full time until the first event.
 * 
 * @param {Date} now      Current date/time
 * @returns {Date} Previous event's date or `now` if at the first event
 */
function getPrevDate(now) {
    return (state.current_event_index > 0) ? state.events[state.current_event_index - 1].date : now;
}

/**
 * Returns the next event's date, or `now` when we're already at the last event.
 * Since we cannot go beyond the latest possible date in the data, we assume today is the "next event" when we're at the last index, which makes the progress bar show 100% and the time left show 0 until the last event.
 * 
 * @param {Date} now      Current date/time
 * @returns {Date} Next event's date or `now` if at the last event
 */
function getNextDate(now) {
    return (state.current_event_index < state.events.length - 1) ? state.events[state.current_event_index + 1].date : now;
}


/** 
 * Computes time left in days, hours, minutes, and seconds until the target date.
 * Breaks the ms difference into days/hours/minutes/seconds (never negative). 
 * @param {Date} target Target date/time
 * @param {Date} now    Current date/time
 * @returns {Object}    Object with properties: days, hours, minutes, seconds
*/
function computeTimeLeft(target, now) {
    console.log('Computing time left until:', target, 'from now:', now);
    let absoluteMilliseconds = Math.abs(Math.round(target - now));

    return {
        days:    Math.floor(absoluteMilliseconds / (1000 * 60 * 60 * 24)),
        hours:   Math.floor(absoluteMilliseconds / (1000 * 60 * 60)) % 24,
        minutes: Math.floor(absoluteMilliseconds / (1000 * 60)) % 60,
        seconds: Math.floor(absoluteMilliseconds / 1000) % 60
    };
}

/** 
 * Computes the percentage of elapsed time of today.
 * Elapsed ratio of now between prevDate and nextDate, clamped to [0, 1]. 
 * @param {Date} prevDate  Previous event's date
 * @param {Date} nextDate  Next event's date
 * @param {Date} now       Current date/time
 * @returns {number} Progress ratio between 0 and 1
*/
function computeProgressToNextDoomsday(prevDate, nextDate, now) {
    let previousPrediction = prevDate.getTime();
    let nextPrediction     = nextDate.getTime();
    let elapsed            = now.getTime() - previousPrediction;

    let total   = Math.max(1, nextPrediction - previousPrediction);  // guard against zero-length range
    return Math.max(0, Math.min(1, elapsed / total));
}

/** 
 * Computes the percentage of elapsed time from the previous event until the current event.
 * Elapsed ratio of now between prevDate and nextDate, clamped to [0, 1]. 
 * @param {Date} prevDate  Previous event's date
 * @param {Date} nextDate  Next event's date
 * @param {Date} now       Current date/time
 * @returns {number} Progress ratio between 0 and 1
*/
function computeProgressToPrevDoomsday(prevDate, nextDate, now) {
    let previousPrediction   = prevDate.getTime();
    let nextPrediction     = nextDate.getTime();

    return (now.getTime() - previousPrediction) / (nextPrediction - previousPrediction);
}

/** Produces a "#HHMMSS" hex color from the live countdown — keeps the fun trick. */
function buildColor(h, m, s) {
    return '#' + pad(h) + pad(m) + pad(s);
}

function pad(n) {
    return String(n).padStart(2, '0');
}