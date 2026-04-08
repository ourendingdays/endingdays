// ---------------------------------------------------------------------------
// State — single source of truth
// ---------------------------------------------------------------------------
let state = {
    doomsdays              : [],     // NormalizedDoomsdays[] built once at startup in the format { date: Date, year: string, detail: string }
    desiredDoomsdayIndex   : 0,      // current event index
    previousDoomsdayIndex  : 0,      // Chosen index of one of the previous doomsdays before today, used for progress calculations
    futureDoomsdayIndex    : 0,      // Chosen index of one of the future doomsdays after today, used for progress calculations
    timer                  : null    // Timer for the countdown to live updating every second
};

// ---------------------------------------------------------------------------
// Dom manipulations
// ---------------------------------------------------------------------------
let PERCENTAGE_TO_NEXT_TEXT = 'Time to survive: ';                                  //'Percentage of time from previous End of the World to the next: ';
let PERCENTAGE_TO_PREV_TEXT = 'Time survived: ';                                    //'Percentage of time from this past End of the World to the next: ';
let CLOCK                   = document.getElementById('clock');                     // Main countdown display element
let PROGRESS                = document.getElementById('progress-meter');            // Progress bar element
let PROGRESS_PERCENTAGE     = document.getElementById('progress-meter-percentage'); // Progress percentage element text
let AUTHOR                  = document.getElementById('p-author');                  // Author element text
let DESCRIPTION             = document.getElementById('p-description');             // Description element text

let PREV_BUTTON             = document.getElementById('last-button');
let NEXT_BUTTON             = document.getElementById('next-button');

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

async function loadDoomsdays() {
    const response = await fetch("api/doomsdays");

    if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
    }

    const rows = await response.json();

    state.doomsdays = rows.map(row => ({
        date: new Date(row.doomsday_date),
        year: row.display_year,
        detail: row.detail
    }));
    // Sets nearest previous and nearest future doomsdays from today as an initial indexes
    [state.previousDoomsdayIndex, state.futureDoomsdayIndex] = setInitialDoomsday(state.doomsdays, new Date());
}

document.addEventListener("DOMContentLoaded", async function () {
    getWindowHeight();
    console.log("Loading doomsdays...");

    try {
        await loadDoomsdays();
        render_doomsday();
        startCountdownTimer();
    } catch (error) {
        console.error("Failed to initialize app:", error);
    }
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
 * Starts the countdown timer that updates the displayed time left and progress towards the next doomsday every second.
 * If a timer is already running, it clears the existing interval to prevent multiple timers from running simultaneously.
 * This function is called on page load after the doomsdays have been loaded and rendered for the first time.
 * @returns void
 */
function startCountdownTimer() {
    // Prevent multiple intervals from stacking
    if (state.timer !== null) {
        clearInterval(state.timer);
    }

    state.timer = setInterval(function () {
        render_doomsday();
    }, 1000);
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
    // Guard: If there are no doomsdays loaded, do nothing
    if (!state.doomsdays.length) {
        return;
    }

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

    // UI updates
    (desiredDoomsday.date >= now) ? PROGRESS_PERCENTAGE.textContent = PERCENTAGE_TO_NEXT_TEXT + progressPer + '%'
    : PROGRESS_PERCENTAGE.textContent = PERCENTAGE_TO_PREV_TEXT + progressPer + '%';

    CLOCK.textContent           = timeLeft.days + ' days ' + pad(timeLeft.hours) + ':' + pad(timeLeft.minutes) + ':' + pad(timeLeft.seconds);
    PROGRESS.style.width        = progressPer + '%';
    PROGRESS.style.background   = color;
    AUTHOR.textContent          = desiredDoomsday.year;
    DESCRIPTION.textContent     = desiredDoomsday.detail;

    updateNavigationButtons();
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
    // Prevent moving back if we're already at the earliest event
    if (state.desiredDoomsdayIndex <= 0) return;

    state.futureDoomsdayIndex   = Math.max(0, state.futureDoomsdayIndex - 1);
    state.desiredDoomsdayIndex  = state.futureDoomsdayIndex; // Sync current index with future index after moving back
    if (state.doomsdays[state.futureDoomsdayIndex].date <  new Date()) {
        state.futureDoomsdayIndex   = Math.max(0, state.futureDoomsdayIndex + 1);
        state.previousDoomsdayIndex = Math.max(0, state.previousDoomsdayIndex - 1);
        state.desiredDoomsdayIndex  = state.previousDoomsdayIndex;
    } 
    
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
    // Prevent moving forward if we're already at the latest event
    if (state.desiredDoomsdayIndex >= state.doomsdays.length - 1) return;

    state.futureDoomsdayIndex   = Math.min(state.doomsdays.length - 1, state.futureDoomsdayIndex + 1);
    state.desiredDoomsdayIndex  = state.futureDoomsdayIndex; // Sync current index with future index after moving forward

    render_doomsday();
}

/**
 * Enables or disables the "Previous" and "Next" buttons based on the current desired doomsday index.
 * The "Previous" button is disabled if the desired doomsday index is at or below 0, meaning there are no earlier events to navigate to.
 * The "Next" button is disabled if the desired doomsday index is at or above the last index of the doomsdays array, meaning there are no later events to navigate to.
 * This function should be called whenever the desired doomsday index changes to ensure the buttons reflect the current navigation state.
 * @returns void
 */
function updateNavigationButtons() {
    PREV_BUTTON.disabled = (state.desiredDoomsdayIndex === 0);
    NEXT_BUTTON.disabled = (state.desiredDoomsdayIndex === state.doomsdays.length - 1);
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
    let start   = startDate.getTime();
    let end     = endDate.getTime();
    let current = now.getTime();
    
    let elapsed = current - start;
    let total   = Math.max(1, end - start);

    return Math.max(0, Math.min(1, elapsed / total));
}

// ---------------------------------------------------------------------------
// Utils
// ---------------------------------------------------------------------------
/** Produces a "#HHMMSS" hex color from the live countdown — keeps the fun trick. */
function buildColor(h, m, s) {
    return '#' + pad(h) + pad(m) + pad(s);
}

function pad(n) {
    return String(n).padStart(2, '0');
}