import './style.css';

const $ = document.querySelector.bind(document);

const birthdayForm = $('#birthday-form');
const birthdayInputForm = $('#birthday-input-form');
const birthdayInput = $('#birthday-input');
const birthdayTimer = $('#birthday-timer');
const ageYears = $('#age-years');
const ageFraction = $('#age-fraction');
const drawerToggle = $('#settings-drawer');
const updateTickRange = $('#update-tick-range');
const updateTickValue = $('#update-tick-value');
const birthdayValue = $('#birthday-value');
const resetBirthdayButton = $('#reset-birthday');
const designInputs = document.querySelectorAll('input[name="design"]');
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)');

const MS_PER_YEAR = 1000 * 60 * 60 * 24 * 365.25;
const FRACTION_DIGITS = 10;
const UPDATE_TICK = { MIN: 10, MAX: 1000, DEFAULT: 150 };
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const DESIGNS = ['apple', 'google'];
const DEFAULT_DESIGN = 'apple';

const storage = {
   get(key) {
      try {
         return localStorage.getItem(key);
      } catch {
         return null;
      }
   },
   set(key, value) {
      try {
         localStorage.setItem(key, value);
      } catch {}
   },
   remove(key) {
      try {
         localStorage.removeItem(key);
      } catch {}
   }
};

function parseBirthday(raw) {
   if (!raw) return null;
   const date = ISO_DATE.test(raw)
      ? new Date(...raw.split('-').map((part, i) => Number(part) - (i === 1 ? 1 : 0)))
      : new Date(raw);
   return isValidBirthday(date) ? date : null;
}

function isValidBirthday(date) {
   return date instanceof Date && !Number.isNaN(date.getTime()) && date.getTime() < Date.now();
}

function readUpdateTick() {
   const value = Number(storage.get('updateTick'));
   return value >= UPDATE_TICK.MIN && value <= UPDATE_TICK.MAX ? value : UPDATE_TICK.DEFAULT;
}

function readDesign() {
   const value = storage.get('design');
   return DESIGNS.includes(value) ? value : DEFAULT_DESIGN;
}

let birthday = parseBirthday(storage.get('birthday'));
let updateTick = readUpdateTick();
let interval;
let design = readDesign();

const googleFontReady = Promise.all(
   ['400', '500'].map((weight) => document.fonts.load(`${weight} 16px "Google Sans"`))
).catch(() => {});

function renderAge() {
   const age = (Date.now() - birthday.getTime()) / MS_PER_YEAR;
   const years = String(Math.trunc(age));
   if (ageYears.textContent !== years) {
      ageYears.textContent = years;
   }
   ageFraction.textContent = (age % 1).toFixed(FRACTION_DIGITS).slice(1);
}

function start() {
   stop();
   renderAge();
   interval = setInterval(renderAge, updateTick);
}

function stop() {
   clearInterval(interval);
}

function render() {
   birthdayForm.hidden = Boolean(birthday);
   birthdayTimer.hidden = !birthday;
   birthdayValue.textContent = birthday
      ? birthday.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })
      : 'Not set';
   resetBirthdayButton.textContent = birthday ? 'Change Birthday' : 'Set Birthday';

   if (birthday) {
      start();
   } else {
      stop();
      birthdayInput.max = new Date().toISOString().slice(0, 10);
   }
}

function renderRangeFill() {
   const { min, max, value } = updateTickRange;
   updateTickRange.style.setProperty('--fill', `${((value - min) / (max - min)) * 100}%`);
}

function renderUpdateTick() {
   updateTickRange.value = updateTick;
   updateTickValue.textContent = updateTick;
   renderRangeFill();
}

function applyDesign() {
   const root = document.documentElement;
   root.dataset.design = design;
   root.dataset.theme = `${design}-${colorScheme.matches ? 'dark' : 'light'}`;
   designInputs.forEach((input) => {
      input.checked = input.value === design;
   });
}

designInputs.forEach((input) => {
   input.addEventListener('change', () => {
      if (!input.checked) return;
      const next = input.value;
      storage.set('design', next);
      const ready = next === 'google' ? googleFontReady : Promise.resolve();
      ready.then(() => {
         design = next;
         applyDesign();
      });
   });
});

colorScheme.addEventListener('change', applyDesign);

birthdayInputForm.addEventListener('submit', (event) => {
   event.preventDefault();
   const date = parseBirthday(birthdayInput.value);
   if (!date) {
      birthdayInput.setCustomValidity('Please choose a date in the past.');
      birthdayInput.reportValidity();
      return;
   }
   storage.set('birthday', birthdayInput.value);
   birthday = date;
   render();
});

birthdayInput.addEventListener('input', () => birthdayInput.setCustomValidity(''));

updateTickRange.addEventListener('input', () => {
   updateTickValue.textContent = updateTickRange.value;
   renderRangeFill();
});

updateTickRange.addEventListener('change', () => {
   updateTick = Number(updateTickRange.value);
   storage.set('updateTick', updateTick);
   renderUpdateTick();
   if (birthday) start();
});

resetBirthdayButton.addEventListener('click', () => {
   storage.remove('birthday');
   birthday = null;
   birthdayInput.value = '';
   drawerToggle.checked = false;
   render();
   birthdayInput.focus();
});

document.addEventListener('keydown', (event) => {
   if (event.key === 'Escape') drawerToggle.checked = false;
});

applyDesign();
renderUpdateTick();
render();
