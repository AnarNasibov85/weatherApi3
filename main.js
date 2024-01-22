
const timeEl = document.querySelector('#time');
const dateEl = document.querySelector('#date');
const currentWeatherItemsEl = document.querySelector('#current-weather-items');
const timeZone = document.querySelector('#time-zone');
const countryEl = document.querySelector('#country');
const weatherForecastEl = document.querySelector('#weather-forecast');
const currentTempEl = document.querySelector('#current-temp');
const inputEl = document.querySelector('#inputEl');
const addBtn = document.querySelector('#button-addon2');
const today = document.querySelector('.today');
const country = document.querySelector('.place-container');

const API_KEY = "ce8adb725959853af1d79d03da42a6aa";
const forecast_api = 'dfe36761054c2b01ce788451c96b96a8';
const time_api = '23c9b0c81d6d47c294bcc1ce19bc827e';

async function getDefaultCity(city) {
    try {
        const responseCity = await fetch(city);
        const dataCity = await responseCity.json();
        return dataCity;
    } catch (err) {
        console.log('err', err);
    }
}

async function getElement(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        showCityData(data);
    } catch (err) {
        console.log('err', err);
    }
}

async function forecast(api_url, time_url) {
    try {
        const response2 = await fetch(api_url);
        const data2 = await response2.json();

        const response4 = await fetch(time_url);
        const data4 = await response4.json();

        fiveDays(data2, data4);
    } catch (err) {
        console.log('err', err);
    }
}

async function dailyForecast(api_url) {
    try {
        const response = await fetch(api_url);
        const data = await response.json();
        showDailyForecast(data);
    } catch (err) {
        console.log('err', err);
    }
}

async function localTime(timeDate) {
    try {
        const response3 = await fetch(timeDate);
        const data3 = await response3.json();
        date_of_city(data3);
    } catch (err) {
        console.log('err', err);
    }
}

function showCityData(city) {
    const humidity = city.main.humidity;
    const pressure = city.main.pressure;
    const windSpeed = city.wind.speed;
    const temperature = Math.floor(city.main.temp);

    currentWeatherItemsEl.innerHTML = `
        <div class="weather-item">
            <div>Humidity</div>
            <div>${humidity}%</div>
        </div>
        <div class="weather-item">
            <div>Pressure</div>
            <div>${pressure}</div>
        </div>
        <div class="weather-item">
            <div>Wind speed</div>
            <div>${windSpeed}</div>
        </div>`;

    today.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${city.weather[0].icon}.png" alt="weather icon" class="w-icon">
        <div class="other">
            <div class="day">${city.weather[0].description}</div>
            <div class="temp">${temperature}° C</div>
        </div>`;

    const dailyForecastApi = `https://api.openweathermap.org/data/2.5/forecast?q=${city.name}&appid=${forecast_api}&units=metric`;

    dailyForecast(dailyForecastApi);
}

function date_of_city(sheher) {
    country.innerHTML = `
        <div class="time-zone" id="time-zone">${sheher.features[0].properties.city}</div>
        <div class="time-zone" id="time-zone-country">${sheher.features[0].properties.country}</div>`;

    const today = new Date();

    const month = today.toLocaleString("en-US", {
        timeZone: `${sheher.features[0].properties.timezone.name}`,
        month: 'long'
    });

    const day_numeric = today.toLocaleString("en-US", {
        timeZone: `${sheher.features[0].properties.timezone.name}`,
        day: 'numeric'
    });

    const hour = today.toLocaleString("en-US", {
        timeZone: `${sheher.features[0].properties.timezone.name}`,
        hour: 'numeric',
        hour12: false
    });

    const minute = today.toLocaleString("en-US", {
        timeZone: `${sheher.features[0].properties.timezone.name}`,
        minute: '2-digit',
    });

    timeEl.innerHTML = `${hour}:${minute} <span id="am-pm"></span>`;

    dateEl.innerHTML = `<div id="date" class="date">
        ${day_numeric} ${month}
    </div>`;
}

function showDailyForecast(data) {
    const forecastItems = data.list.slice(1, 6); 

    weatherForecastEl.innerHTML = '';

    forecastItems.forEach((item) => {
        const dayName = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'long' });
        const temperatureMax = Math.floor(item.main.temp_max);
        const temperatureMin = Math.floor(item.main.temp_min);

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('weather-forecast-item');
        forecastItem.innerHTML = `
            <div class="day">${dayName}</div>
            <div class="temp">Max: ${temperatureMax}°C, Min: ${temperatureMin}°C</div>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="weather icon" class="w-icon">
        `;

        weatherForecastEl.appendChild(forecastItem);
    });
}

async function performans() {
    const search = inputEl.value;
    const apiWeather = `https://api.openweathermap.org/data/2.5/weather?q=${search}&APPID=${API_KEY}&units=metric`;
    const date_time = `https://api.geoapify.com/v1/geocode/search?text=${search}&lang=en&limit=2&type=city&apiKey=${time_api}`;

    await localTime(date_time);
    await getElement(apiWeather);
}

addBtn.addEventListener('click', performans);

inputEl.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        performans();
    }
});
