const birthdayInputForm = document.querySelector('#birthday-form');
const birthdayInput = document.querySelector('#birthday-input');
const birthdayTimeContainer = document.querySelector('#birthday-timer-container');
const birthdayTimer = document.querySelector('#birthday-timer');
const birthdayTimerSeconds = document.querySelector('#birthday-timer-seconds');

const UNIX_TIME_FULL_YEAR = new Date(0).getFullYear();
const AGE_DELIMITER = 1000 * 60 * 60 * 24 * 365.25;
const MAX_VALUE_LENGTH = 10;
const UPDATE_TICK = 150;

let birthday;
let difference;
let value;

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
 * @param {SubmitEvent} event Event.
 */
function onSubmitBirthday(event) {
   event.preventDefault();

   if (birthdayInput.valueAsDate) {
      user.birthday = birthdayInput.valueAsDate;

      setActiveControl();
   }
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

      // Need to render start.
      calculateAge();
      setInterval(calculateAge, UPDATE_TICK);
   }
}

/**
 * Sets current age by interval.
 */
function calculateAge() {
   difference = Date.now() - birthday;
   value = (new Date(difference) - UNIX_TIME_FULL_YEAR) / AGE_DELIMITER;
   birthdayTimer.innerText = Math.trunc(value);
   birthdayTimerSeconds.innerText = (value % 1).toFixed(MAX_VALUE_LENGTH).substring(1);
}

/**
 * Entry point.
 */
function init() {
   setActiveControl();
}

init();