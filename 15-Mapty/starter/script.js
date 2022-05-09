'use strict';

// prettier-ignore
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

class Workout {
    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance;
        this.duration = duration;
    }
}

class Running extends Workout {
    type = 'running';
    constructor (coords, distance, duration, cadence) {
        super(coords, distance, duration);
        this.cadence = cadence;
        this._calcPace();
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
    }

    _calSpeed() {
        this.speed = this.distance / (this.duration / 60);
        return this.speed;
    }
}

class App {
    #map;
    #workouts;
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
        
    }

    _addMarker(workout) {
        L.marker(workout.coords)
            .addTo(this.#map)
            .bindPopup(
                L.popup({
                    maxWidth: 250,
                    minWidth: 100,
                    autoClose: false,
                    closeOnClick: false,
                    className: `${workout.type}-popup`,
                })
            )
            .setPopupContent(workout.type);
    }

    _toggleElevationField() {
        inputElevation.closest('.form__row').classList.toggle('form__row--hidden');
        inputCadence.closest('.form__row').classList.toggle('form__row--hidden');
    }

    _newWorkout(event) {
        event.preventDefault();
        const validInputs = (...inputs) => inputs.every (inp => Number.isFinite(inp) && (inp > 0));
        
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
                this._addMarker(workout);
            case 'running':
                const cadence = +inputCadence.value;
                if (!validInputs(distance, duration, cadence)) {
                    return alert('Inputs have to be positive numbers!');
                }
                workout = new Running([lat, lng], distance, duration, cadence);
                this._addMarker(workout);
            default:
                break;
        }
    }
}

const app = new App();