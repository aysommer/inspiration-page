const root = document.querySelector('#root');
const birthdayInput = document.querySelector('#birthday-input');

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
   return Boolean(
      value instanceof Date &&
      value.getDay() &&
      value.getMonth() &&
      value.getFullYear()
   );
}

/**
 * Submits user event for birthday input.
 * @param {SubmitEvent} event Event.
 */
function onSubmitBirthday(event) {
   event.preventDefault();

   if (birthdayInput.valueAsDate) {
      user.birthday = birthdayInput.valueAsDate;
   }
}

function init() { }