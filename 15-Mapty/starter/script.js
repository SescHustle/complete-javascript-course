'use strict';

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
    constructor(coords, distance, duration) {
        this.date = new Date();
        this.id = (Date.now() + '').slice(-10);
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }

    _setDescription() {
        // prettier-ignore
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)}
            on ${months[this.date.getMonth()]}
            ${this.date.getDate()}`
    }
}

class Running extends Workout {
    type = 'running';
    constructor (coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this._calcPace();
        this._setDescription();
    }

    _calcPace(){
        this.pace = this.duration / this.distance;
        return this.pace;
    }
}

class Cycling extends Running {
    type = 'cycling';
    constructor (coords, distance, duration, elevationGain) {
        super(coords, distance, duration);
        this.elevationGain = elevationGain;
        this._calSpeed();
        this._setDescription();
    }

    _calSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

class App {
    #map;
    #workouts = [];
    #mapEvent;

    constructor() {
        this._getPosition();
        form.addEventListener('submit', this._newWorkout.bind(this));
        inputType.addEventListener('change', this._toggleElevationField);
    };

    _getPosition() {
        if (navigator.geolocation) {
            const position = navigator.geolocation
                .getCurrentPosition(
                position => this._loadMap(position),
                position => {
                    alert('Can not get your position! Please, check console.');
                    console.log(position)
                }
            );  
        }
    }

    _loadMap(position) {
        const {latitude, longitude} = position.coords;
        this.#map = L.map('map').setView([latitude, longitude], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this));
    }

    _showForm(mapEvent) {
        this.#mapEvent = mapEvent;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    __hideForm() {
        inputDistance.value = 
        inputDuration.value = 
        inputCadence.value = 
        inputElevation.value = '';

        form.style.display = 'none';
        form.classList.add('hidden');
        setTimeout(() => (form.style.display = 'grid'), 1000);
    }

    _renderMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: `${workout.type}-popup`,
                }))
            .setPopupContent(
                `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`);
    }

    _renderWorkout(workout) {
        let html = `<li class="workout workout--${workout.type}" data-id="${workout.id}">
        <h2 class="workout__title">${workout.description}</h2>
        <div class="workout__details">
          <span class="workout__icon">${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'}</span>
          <span class="workout__value">${workout.distance}</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value">${workout.duration}</span>
          <span class="workout__unit">min</span>
        </div>
        `
        if (workout.type === 'running') {
            html +=`
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.pace.toFixed(1)}</span>
              <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
              <span class="workout__icon">🦶🏼</span>
              <span class="workout__value">${workout.cadence}</span>
              <span class="workout__unit">spm</span>
            </div>
          </li>`;
        }
        if (workout.type === 'cycling') {
            html +=`
            <div class="workout__details">
              <span class="workout__icon">⚡️</span>
              <span class="workout__value">${workout.speed.toFixed(1)}</span>
              <span class="workout__unit">min/km</span>
            </div>
            <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workout.elevationGain}</span>
            <span class="workout__unit">m</span>
            </div>
          </li>`;
        }

        form.insertAdjacentHTML('afterend', html);
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _addWorkout(workout) {
        this.#workouts.push(workout);
        this._renderMarker(workout);
        this._renderWorkout(workout);
        this.__hideForm();
    }

    _newWorkout(event) {
        event.preventDefault();
        const validInputs = (...inputs) => inputs.every(inp => (Number.isFinite(inp) && inp > 0));
        const addWorkout = (workout) => {
            this.#workouts.push(workout);
            this._renderMarker(workout);
            this._renderWorkout(workout);
            this.__hideForm();
        }


        const [type, distance, duration] = [inputType.value, +inputDistance.value, +inputDuration.value];
        const {lat, lng} = this.#mapEvent.latlng; 
        let workout;

        switch (type) {
            case 'cycling':
                const elevationGain = +inputElevation.value;
                if (!validInputs(distance, duration, elevationGain)) {
                    return alert('Inputs have to be positive numbers!');
                }
                workout = new Cycling([lat, lng], distance, duration, elevationGain);
                addWorkout(workout);
                break;
            case 'running':
                const cadence = +inputCadence.value;
                if (!validInputs(distance, duration, cadence)) {
                    console.log(distance, duration, cadence);
                    return alert('suck!');
                }
                workout = new Running([lat, lng], distance, duration, cadence);
                addWorkout(workout);
                break;
            default:
                break;
        }
    }
}

const app = new App();