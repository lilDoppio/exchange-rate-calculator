import "./index.html";
import "./index.scss";

import { ruble } from './constants/ruble.js';
import { locals } from './constants/locals.js';

let valuteData;
let valutePositions = [];
let selectedSelector = '';
let exchangeValueFrom = 0;
let exchangeValueTo = 0;

const valuteContainer = document.querySelector(".valute-container");

const valuteSelectorFrom = document.querySelector(".selector-from");
const valuteSelectorTo = document.querySelector(".selector-to");
const currentValuteFrom = document.querySelector(".current-from");
const currentValuteTo = document.querySelector(".current-to");
const ValuteValueFrom = document.querySelector(".value-from");
const ValuteValueTo = document.querySelector(".value-to");


fetch("https://www.cbr-xml-daily.ru/daily_json.js")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    valuteData = Object.values(data.Valute);
    valuteData.push(ruble);
    init();
    onValueLoad();
  });

const init = function() {
  const charCode = locals[window.navigator.language] || 'RUB';
  const newCurrentValute = valuteData.filter((valute) => valute.CharCode === charCode);
  currentValuteFrom.innerText = `${newCurrentValute[0].CharCode} ${newCurrentValute[0].Name}`;
  currentValuteTo.innerText = `${newCurrentValute[0].CharCode} ${newCurrentValute[0].Name}`;
};

const onValueLoad = function () {
  valutePositions = document.querySelectorAll(".position");

  valuteSelectorFrom.addEventListener("click", () => {
    if (valuteSelectorFrom.classList.contains("active")) {
      valuteContainer.classList.remove("active");
      valuteSelectorFrom.classList.remove("active");
      
      valuteSelectorFrom.innerText = '▼';
      
      selectedSelector = '';
    } else {
      valuteContainer.classList.add("active");
      valuteSelectorFrom.classList.add("active");
      valuteSelectorTo.classList.remove("active");

      valuteSelectorFrom.innerText = '▲';
      valuteSelectorTo.innerText = '▼';

      selectedSelector = 'from';
    }
  });

  valuteSelectorTo.addEventListener("click", () => {
    if (valuteSelectorTo.classList.contains("active")) {
      valuteContainer.classList.remove("active");
      valuteSelectorTo.classList.remove("active");

      valuteSelectorTo.innerText = '▼';

      selectedSelector = '';
    } else {
      valuteContainer.classList.add("active");
      valuteSelectorTo.classList.add("active");
      valuteSelectorFrom.classList.remove("active");

      valuteSelectorTo.innerText = '▲';
      valuteSelectorFrom.innerText = '▼';

      selectedSelector = 'to';
    }
  });

  ValuteValueFrom.addEventListener('input', () => {
    const exchangeRate = ((1 / exchangeValueTo) / (1 / exchangeValueFrom)) * ValuteValueFrom.value;
    ValuteValueTo.value = exchangeRate.toFixed(2);
  });

  ValuteValueTo.addEventListener('input', () => {
    const exchangeRate = ((1 / exchangeValueFrom) / (1 / exchangeValueTo) ) * ValuteValueTo.value;
    ValuteValueFrom.value = exchangeRate.toFixed(2);
  });

  valutePositions.forEach((pos) =>
    pos.addEventListener("click", () => {
      const newCurrentValute = valuteData.filter((valute) => valute.CharCode === pos.id);
      if (selectedSelector === 'from') {
        currentValuteFrom.innerText = `${newCurrentValute[0].CharCode} ${newCurrentValute[0].Name}`;
        exchangeValueFrom = newCurrentValute[0].Value / newCurrentValute[0].Nominal;
      }
      else {
        currentValuteTo.innerText = `${newCurrentValute[0].CharCode} ${newCurrentValute[0].Name}`;
        exchangeValueTo = newCurrentValute[0].Value / newCurrentValute[0].Nominal;
      };
      ValuteValueTo.value = 0;
      ValuteValueFrom.value = 0;
    })
  );
};
