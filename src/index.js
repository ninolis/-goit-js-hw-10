import { fetchCountries } from './js/fetchCountries';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;
const refs = {
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
  countryInput: document.querySelector('#search-box'),
};
const filter = {
  officialName: 'name',
  capital: 'capital',
  population: 'population',
  flag: 'flags',
  languages: 'languages',
};
let userInputCountry = '';

function renderFetchCountries() {
  fetchCountries(userInputCountry, filter)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        `${Notify.failure('Oops, there is no country with that name')}`;
        throw new Error(`Error ` + response.status);
      }
    })
    .catch(err => {
      console.log(err);
    })
    .then(countries => {
      if (countries) {
        if (countries.length > 10) {
          Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
          return;
        }
        if (countries.length > 1 && countries.length < 11) {
          createListMarkup(countries);
          return;
        }
        if (countries.length == 1) {
          createDetailedMarkup(countries);
          return;
        }
      }
    });
}

function createListMarkup(countries) {
  let countryString = '';
  countries.forEach(country => {
    let countryItem = `<li class="country-item">
        <img 
        src="${country.flags.svg}" 
        alt="${country.name.common}"
        width='30px'
        ' />
        <p class="country-name">${country.name.official}</p>
</li>`;
    countryString += countryItem;
  });
  refs.countryList.insertAdjacentHTML('beforeend', countryString);
}

function createDetailedMarkup(countries) {
  let detailedCountryString = '';
  countries.forEach(country => {
    let detailedCountry = `
        <img 
        src="${country.flags.svg}" 
        alt="${country.name.common}"
        width='90px'
        ' />
        <p class="country-name country-name__detailed">${
          country.name.official
        }</p>
        <p class="country-desc">Capital: <span>${country.capital}</span></p>
        <p class="country-desc">Population: <span>${
          country.population
        } people</span></p>
    <p class="country-desc">Languages: <span>${Object.values(
      country.languages
    )}</span></p>`;
    detailedCountryString = detailedCountry;
  });
  refs.countryInfo.insertAdjacentHTML('beforeend', detailedCountryString);
}

function clearMarkup() {
  refs.countryInfo.replaceChildren();
  refs.countryList.replaceChildren();
}
refs.countryInput.addEventListener(
  `input`,
  debounce(e => {
    userInputCountry = e.target.value.trim();
    if (e.target.value == '') {
      clearMarkup();
      return;
    }
    if (refs.countryInfo.hasChildNodes() || refs.countryList.hasChildNodes()) {
      clearMarkup();
    }
    if (userInputCountry !== '') renderFetchCountries();
  }, DEBOUNCE_DELAY)
);
