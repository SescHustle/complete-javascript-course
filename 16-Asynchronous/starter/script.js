'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} M people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};

///////////////////////////////////////
console.log('------ CODING CHALLENGE #1 ------');
const whereAmI = function (lat, lng) {
  fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
    .then(response => {
        if (!response.ok) throw Error(`Can not get location by coordinates. Error: ${response.status}`);
        return response.json()
    })
    .then(data => {
      console.log(`You are in ${data.city}, ${data.country}.`);
      return fetch(`https://restcountries.com/v2/name/${data.country}`);
    })
    .then(response => {
        if (!response.ok) throw Error(`Unable to fetch country. Error: ${response.status}`);
        return response.json()
    })
    .then(country => renderCountry(country[0]))
    .catch(err => console.log(err.message));
}
navigator.geolocation
  .getCurrentPosition(
    position => whereAmI(
      position.coords.latitude,
      position.coords.longitude
    ));
// whereAmI(52.508, 13.381);
// whereAmI(19.037, 72.873);
// whereAmI(-33.933, 18.474);