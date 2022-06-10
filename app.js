const birthdayInputForm = document.querySelector('#birthday-form');
const birthdayInput = document.querySelector('#birthday-input');
const birthdayTimeContainer = document.querySelector('#birthday-timer-container');
const birthdayTimer = document.querySelector('#birthday-timer');
const birthdayTimerSeconds = document.querySelector('#birthday-timer-seconds');
const sidebar = document.querySelector('#sidebar');
const form = document.querySelector('#input-container');
const openMenuButton = document.querySelector('#open-menu-button');
const closeMenuButton = document.querySelector('#close-menu-button');
const updateTickRange = document.querySelector('#update-tick-range');

const UNIX_TIME_FULL_YEAR = new Date(0).getFullYear();
const AGE_DELIMITER = 1000 * 60 * 60 * 24 * 365.25;
const MAX_VALUE_LENGTH = 10;
const UPDATE_TICK = 150;
const NAV_WIDTH = 400;

let birthday;
let difference;
let value;
let updateTick = UPDATE_TICK;
let interval;

const user = {
   get birthday() {
      return localStorage.getItem('birthday');
   },
   set birthday(value) {
      if (isValidDate(value)) {
         localStorage.setItem('birthday', value.toString());
      }
   }
}

/**
 * Checks date value on day, month and year.
 * @param {Date} value Date value.
 */
function isValidDate(value) {
   const isDate = Boolean(
      value instanceof Date &&
      value.getDay() &&
      value.getMonth() &&
      value.getFullYear()
   )
   const isLessDate = Date.now() - value > 0;

   return isDate && isLessDate;
}

/**
 * Submits user event for birthday input.
 * @param {SubmitEvent} event Form event.
 */
function onSubmitBirthday(event) {
   event.preventDefault();

   if (birthdayInput.valueAsDate) {
      user.birthday = birthdayInput.valueAsDate;

      setActiveControl();
   }
}

/**
 * Sets timer update speed.
 * @param {InputEvent} event Range event.
 */
function onUpdateSpeed({ target }) {
   updateTick = target.value;
   restart();
}

/**
 * Sets active control for show.
 */
function setActiveControl() {
   const controlToHide = (user.birthday) ? birthdayInputForm : birthdayTimeContainer;
   const controlToShow = (user.birthday) ? birthdayTimeContainer : birthdayInputForm;

   controlToHide.style.display = 'none';
   controlToShow.style.display = 'block';

   if (user.birthday) {
      birthday = new Date(user.birthday);

      start();
   }
}

/**
 * Starts timer.
 */
function start() {
   // Neede to first render.
   calculateAge();
   interval = setInterval(calculateAge, updateTick);
}

/**
 * Restarts timer.
 */
function restart() {
   clearInterval(interval);
   start();
}

/**
 * Sets callbacks on controls.
 */
function setCallbacks() {
   updateTickRange.onchange = onUpdateSpeed;
   form.onsubmit = onSubmitBirthday;
   openMenuButton.onclick = () => toggleNavbar(true);
   closeMenuButton.onclick = () => toggleNavbar(false);
}

/**
 * Sets current age by interval.
 */
function calculateAge() {
   difference = Date.now() - birthday;
   value = (new Date(difference) - UNIX_TIME_FULL_YEAR) / AGE_DELIMITER;
   if (parseInt(birthdayTimer.innerText, 10) !== Math.trunc(value)) {
      birthdayTimer.innerText = Math.trunc(value);
   }
   birthdayTimerSeconds.innerText = (value % 1).toFixed(MAX_VALUE_LENGTH).substring(1);
}

/**
 * Toggles navbar.
 * @param {Boolean} value Value.
 */
 function toggleNavbar(value) {
   const expandValue = (value) ? `${NAV_WIDTH}px` : `${0}px`;
   sidebar.style.width = expandValue;
   birthdayTimeContainer.style.marginRight = expandValue;
}

/**
 * Sets settings.
 */
function setSettings() {
   updateTickRange.value = updateTick;
}

/**
 * Entry point.
 */
function init() {
   setSettings();
   setCallbacks();
   setActiveControl();
}

init();