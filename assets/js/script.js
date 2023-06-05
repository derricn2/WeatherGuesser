// place JS after HTML, in order to troubleshoot error in console
document.addEventListener('DOMContentLoaded', function() {

// search form element
var searchForm = document.querySelector('#search-form');

// event listener for form submission
searchForm.addEventListener("submit", function (event) {
    event.preventDefault();
// city name entered by user
    var cityName = document.querySelector("#city-input").value;
// call function to fetch weather data for city
    getWeatherData(cityName);
});});


// generates weather information
function getWeatherData(cityName) {
    var url = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=4127e0642e9395af24c212d70c2d27a4`;


    fetch(url)
        .then(function (response){
            if(!response.ok){
                throw new Error ("Not okay");
            }
            return response.json();
        })
        .then(function (data){
            processWeatherData(data);
        })
        // deals with any errors during fetch request
        .catch(function (error) {
            console.log("Error", error);
        });
}

function processWeatherData(data) {
    // weather data from API response
    var cityName = data.city.name;
    var forecastList = data.list;

    // update current weather
    updateCurrentWeather(cityName, forecastList[0]);
    // update 5-day forecast section
    updateForecast(forecastList.slice(1));
}

function updateCurrentWeather(cityName, currentWeather) {
    // variables for updating HTML elements for current weather information
    var currentWeatherSection = document.querySelector("#current-weather-section");
    var currentWeatherDetails = currentWeatherSection.querySelector("#current-weather-details");

    // update city name ***need to pull date
    currentWeatherSection.querySelector("h2").textContent = `${cityName}`;

    // remove previous weather details
    currentWeatherDetails.innerHTML = "";

    // pull crucial weather data from API
    var weatherIcon = currentWeather.weather[0].icon;
    var temperature = currentWeather.main.temp;
    var humidity = currentWeather.main.humidity;
    var windSpeed = currentWeather.wind.speed;

    // create HTML elements to display current weather info
    var weatherIconElement = document.createElement("img");
    weatherIconElement.src = `https://openweathermap.org/img/w/${weatherIcon}.png`;

    var temperatureElement = document.createElement("p");
    temperatureElement.textContent = `Temperature: ${temperature} °F`

    var humidityElement = document.createElement("p");
    humidityElement.textContent = `Humidity: ${humidity}%`;

    var windSpeedElement = document.createElement("p");
    windSpeedElement.textContent = `Wind Speed: ${windSpeed} mph`;

// append weather info elements to container
    currentWeatherDetails.appendChild(weatherIconElement);
    currentWeatherDetails.appendChild(temperatureElement);
    currentWeatherDetails.appendChild(humidityElement);
    currentWeatherDetails.appendChild(windSpeedElement);
}