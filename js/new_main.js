// ---------------------------------------------------------------------------
// State — single source of truth
// ---------------------------------------------------------------------------
let state = {
    doomsdays              : [],     // NormalizedDoomsdays[] built once at startup in the format { date: Date, year: string, detail: string }
    desiredDoomsdayIndex   : 0,      // current event index
    previousDoomsdayIndex  : 0,      // Chosen index of one of the previous doomsdays before today, used for progress calculations
    futureDoomsdayIndex    : 0,      // Chosen index of one of the future doomsdays after today, used for progress calculations
};

// ---------------------------------------------------------------------------
// Dom manipulations
// ---------------------------------------------------------------------------
let PERCENTAGE_TO_NEXT_TEXT = 'Time to survive: ';//'Percentage of time from previous End of the World to the next: ';
let PERCENTAGE_TO_PREV_TEXT = 'Time survived: ';//'Percentage of time from this past End of the World to the next: ';
let CLOCK = document.getElementById('clock');                                   // Main countdown display element
let PROGRESS = document.getElementById('progress-meter');                       // Progress bar element
let PROGRESS_PERCENTAGE = document.getElementById('progress-meter-percentage'); // Progress percentage element text
let AUTHOR = document.getElementById('p-author');                               // Author element text
let DESCRIPTION = document.getElementById('p-description');                     // Description element text

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

    // Armageddon doomsdays are defined in armageddonData.js as ARMAGEDDONS and DESCRIPTIONS.

	state.doomsdays = buildDoomsdayList(ARMAGEDDONS, DESCRIPTIONS);                                              // Populates state variable with normalised data
    [state.previousDoomsdayIndex, state.futureDoomsdayIndex] = setInitialDoomsday(state.doomsdays, new Date());  // Sets nearest previous and nearest future doomsdays from today as an initial indexes
    console.log('Prev:', state.doomsdays[state.previousDoomsdayIndex], 'Next:', state.doomsdays[state.futureDoomsdayIndex]);
    
    render_doomsday();
});

/**
 * Returns the first indexes of the Doomsday doomsdays in the past and future, relative to today; falls back to 0 and 1
 * @param {Array} doomsdays  
 * @param {Date} now 
 * @returns {Array} Indices of the initial doomsdays [previous, future]
 */
function setInitialDoomsday(doomsdays, now) {
    for (let i = 0; i < doomsdays.length; i++) {
        if (doomsdays[i].date > now) {
            state.desiredDoomsdayIndex = i;
            return [i-1, i];
        }
    }
    return [0, 1];
}

/**
 * Renders the current doomsday event based on state.desiredDoomsdayIndex
 * Calculates the time in days/hours/minutes/seconds until the event.
 * Understands whether the event is in the past or future and calculates progress accordingly.
 * Updates the UI elements with the calculated time left, progress percentage, and event details.
 * This function is called on page load and whenever the user clicks the "Next" or "Previous" buttons to update the displayed doomsday event.
 * @returns void    
 */
function render_doomsday() {
    // State     : { doomsdays: NormalizedDoomsday[], desiredDoomsdayIndex: number, previousDoomsdayIndex: number, futureDoomsdayIndex: number }
    // Doomsdays : { date: Date, year: string, detail: string }
    let desiredDoomsday = state.doomsdays[state.desiredDoomsdayIndex]; // doomsday event to render
    let now             = new Date();
    let startDate       = state.doomsdays[state.previousDoomsdayIndex].date;
    let endDate         = state.doomsdays[state.futureDoomsdayIndex].date; 
    
    let timeLeft        = computeTimeLeft(desiredDoomsday.date, now); // { days, hours, minutes, seconds }
    let progress        = computeProgressToDoomsday(startDate, endDate, now);
    let progressPer     = Math.round(progress * 100);
    let color           = buildColor(timeLeft.hours, timeLeft.minutes, timeLeft.seconds);

    console.log('Desired', desiredDoomsday.date, 'Prev Doomsday:', startDate, 'Next Doomsday:', endDate);

    // UI updates
    (desiredDoomsday.date >= now) ? PROGRESS_PERCENTAGE.textContent = PERCENTAGE_TO_NEXT_TEXT + progressPer + '%'
    : PROGRESS_PERCENTAGE.textContent = PERCENTAGE_TO_PREV_TEXT + progressPer + '%';

    CLOCK.textContent = timeLeft.days + ' days ' + pad(timeLeft.hours) + ':' + pad(timeLeft.minutes) + ':' + pad(timeLeft.seconds);
    PROGRESS.style.width = progressPer + '%';
    PROGRESS.style.background = color;
    AUTHOR.textContent = desiredDoomsday.year;
    DESCRIPTION.textContent = desiredDoomsday.detail;
}

// ---------------------------------------------------------------------------
// Event handlers for buttons
// ---------------------------------------------------------------------------
/**
 * Handles the click event for the "Previous" button.
 * Updates the state of the previous Doomsday, ensuring that the future index does not go below 0 and that the previous index does not go below 0.
 * If the new future doomsday index points to a past event, it adjusts both indexes to ensure they point to valid past and future events.
 * Finally, it calls render_doomsday() to update the UI with the new selected event.
 * @returns void    
 */
function onPrevButtonClicked() {
    console.log('previousDoomsdayIndex: ', state.previousDoomsdayIndex, 'futureDoomsdayIndex: ', state.futureDoomsdayIndex);

    state.futureDoomsdayIndex = Math.max(0, state.futureDoomsdayIndex - 1);
    state.desiredDoomsdayIndex = state.futureDoomsdayIndex; // Sync current index with future index after moving back
    if (state.doomsdays[state.futureDoomsdayIndex].date <  new Date()) {
        state.futureDoomsdayIndex = Math.max(0, state.futureDoomsdayIndex + 1);
        state.previousDoomsdayIndex = Math.max(0, state.previousDoomsdayIndex - 1);
        state.desiredDoomsdayIndex = state.previousDoomsdayIndex;
    } 
    
    console.log('previousDoomsdayIndex: ', state.previousDoomsdayIndex, 'futureDoomsdayIndex: ', state.futureDoomsdayIndex);
    render_doomsday();
}

/**
 * Handles the click event for the "Next" button.
 * Updates the state of the future Doomsday, ensuring that the future index does not exceed the last index of the doomsdays array.
 * Syncs the desired doomsday index with the future index after moving forward.
 * Finally, it calls render_doomsday() to update the UI with the new selected event.
 * @returns void
 */
function onNextButtonClicked() {
    console.log('previousDoomsdayIndex: ', state.previousDoomsdayIndex, 'futureDoomsdayIndex: ', state.futureDoomsdayIndex);

    state.futureDoomsdayIndex = Math.min(state.doomsdays.length - 1, state.futureDoomsdayIndex + 1);
    state.desiredDoomsdayIndex = state.futureDoomsdayIndex; // Sync current index with future index after moving forward

    console.log('previousDoomsdayIndex: ', state.previousDoomsdayIndex, 'futureDoomsdayIndex: ', state.futureDoomsdayIndex);
    render_doomsday();
}

// ---------------------------------------------------------------------------
// Core logic
// ---------------------------------------------------------------------------

/** 
 * Computes time left in days, hours, minutes, and seconds until the target date.
 * Breaks the ms difference into days/hours/minutes/seconds (never negative). 
 * @param {Date} target Target date/time
 * @param {Date} now    Current date/time
 * @returns {Object}    Object with properties: days, hours, minutes, seconds
*/
function computeTimeLeft(target, now) {
    //console.log('Computing time left until:', target, 'from now:', now);
    let absoluteMilliseconds = Math.abs(Math.round(target - now));

    return {
        days:    Math.floor(absoluteMilliseconds / (1000 * 60 * 60 * 24)),
        hours:   Math.floor(absoluteMilliseconds / (1000 * 60 * 60)) % 24,
        minutes: Math.floor(absoluteMilliseconds / (1000 * 60)) % 60,
        seconds: Math.floor(absoluteMilliseconds / 1000) % 60
    };
}

/** 
 * Computes how far `now` lies between `startDate` and `endDate`.
 * Returns a ratio between 0 and 1:
 * - 0 means `now` is at or before `startDate`
 * - 1 means `now` is at or after `endDate`
 * - values in between represent progress through that interval
 * @param {Date} startDate  Start date of the interval
 * @param {Date} endDate    End date of the interval
 * @param {Date} now        Current date/time
 * @returns {number} Progress ratio between 0 and 1
*/
function computeProgressToDoomsday(startDate, endDate, now) {
    let start = startDate.getTime();
    let end = endDate.getTime();
    let current = now.getTime();
    
    let elapsed = current - start;
    let total = Math.max(1, end - start);

    return Math.max(0, Math.min(1, elapsed / total));
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
/**
 * Each raw entry (Date | number) becomes { date: Date, year: string, detail: string }.
 * Some numeric years represent far-future doomsdays stored as integers; convert them to Dec 31 22:00 of that year.
 * @param {string|number|Date} raw 
 * @param {Array} desc 
 * @returns {Object} dictionary with keys: date (Date), year (string), detail (string)
 */
function normalizeDoomsday(raw, desc) {
    let date = (raw instanceof Date) ? raw : new Date(raw, 11, 31, 22, 0, 0);
    return { date: date, year: desc[0], detail: desc[1] };
}

/**
 * Populates the list of normalized doomsdays from the raw data arrays.
 * @param {Array} rawDoomsdays : List of raw doomsdays, each either a Date or a numeric year.
 * @param {Array} rawDescs     : List of descriptions corresponding to each doomsday, where each description is an array [year, detail].
 * @returns {Array} List of normalized doomsdays with date, year, and detail.
 */
function buildDoomsdayList(rawDoomsdays, rawDescs) {
    let result = [];
    for (let i = 0; i < rawDoomsdays.length; i++) {
        result.push(normalizeDoomsday(rawDoomsdays[i], rawDescs[i]));
    }
    result.sort((a, b) => a.date - b.date);
    return result;
}

/** Produces a "#HHMMSS" hex color from the live countdown — keeps the fun trick. */
function buildColor(h, m, s) {
    return '#' + pad(h) + pad(m) + pad(s);
}

function pad(n) {
    return String(n).padStart(2, '0');
}