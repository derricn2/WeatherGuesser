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

// update search history
    updateSearchHistory(cityName);
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
    var dateElement = document.createElement('p');
    var currentDate = new Date().toLocaleDateString();
    dateElement.textContent = `${currentDate}`;

    var weatherIconElement = document.createElement("img");
    weatherIconElement.src = `https://openweathermap.org/img/w/${weatherIcon}.png`;

    var temperatureElement = document.createElement("p");
    temperatureElement.textContent = `Temperature: ${convertKelvinToFahrenheit(temperature)} °F`
    function convertKelvinToFahrenheit(kelvin){
        return((kelvin - 273.15) * 9 / 5 + 32).toFixed(2);
    }

    var humidityElement = document.createElement("p");
    humidityElement.textContent = `Humidity: ${humidity}%`;

    var windSpeedElement = document.createElement("p");
    windSpeedElement.textContent = `Wind Speed: ${windSpeed} mph`;

// append weather info elements to container
    currentWeatherDetails.appendChild(dateElement);
    currentWeatherDetails.appendChild(weatherIconElement);
    currentWeatherDetails.appendChild(temperatureElement);
    currentWeatherDetails.appendChild(humidityElement);
    currentWeatherDetails.appendChild(windSpeedElement);

    currentWeatherDetails.style.border = "1px solid #e55e00";
    currentWeatherDetails.style.boxShadow = "2px 2px 4px rgba(0, 0, 0, 0.2)";
}

function updateForecast(forecastList) {
    // HTML element for forecast info
    var forecastInfoElement = document.querySelector("#forecast-info");
    // remove previous forecast details
    forecastInfoElement.innerHTML = "";

    // to limit number of forecast cards
    var forecastCount = 0;

    // get current date
    var currentDate = new Date();

    // loop forecast list and create HTML elements for each forecast card
    for (var forecast of forecastList) {
        forecastCount++;
        if (forecastCount > 5) {
            break;
        }

        // pull required detail from API
        var forecastDate = new Date(forecast.dt_txt);
        currentDate.setDate(currentDate.getDate() + 1);
        
        var weatherIcon = forecast.weather[0].icon;
        var temperature = forecast.main.temp;
        var humidity = forecast.main.humidity;
        var windSpeed = forecast.wind.speed;

        // HTML elements for forecast cards
        var forecastEntry = document.createElement('div');

        var dateElement = document.createElement('p');
        dateElement.textContent = formatDate(currentDate);

        var weatherIconElement = document.createElement('img');
        weatherIconElement.src = `https://openweathermap.org/img/w/${weatherIcon}.png`;

        var temperatureElement = document.createElement('p');
        temperatureElement.textContent = `Temperature: ${convertKelvinToFahrenheit(temperature)} °F`
        function convertKelvinToFahrenheit(kelvin){
            return((kelvin - 273.15) * 9 / 5 + 32).toFixed(2);
        }

        var humidityElement = document.createElement('p');
        humidityElement.textContent = `Humidity: ${humidity}%`;

        var windSpeedElement = document.createElement('p');
        windSpeedElement.textContent = `Wind Speed: ${windSpeed} mph`;

        // append forecast elements to container
        forecastEntry.appendChild(dateElement);
        forecastEntry.appendChild(weatherIconElement);
        forecastEntry.appendChild(temperatureElement);
        forecastEntry.appendChild(humidityElement);
        forecastEntry.appendChild(windSpeedElement);


        forecastInfoElement.appendChild(forecastEntry);
    }
}

function formatDate(date) {
    var options = { weekday: 'short', month: 'short', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
  }

function updateSearchHistory(cityName) {
    // HTML element for each history list
    var searchHistoryList = document.querySelector('#search-history-list');

    // list item element for searched city
    var listItem = document.createElement('li');
    listItem.textContent = cityName;

    // event listener to the list item
    listItem.addEventListener('click', function() {
        // call getWeatherData function with clicked city
        getWeatherData(cityName);
    });

    // add search item to search history list
    searchHistoryList.appendChild(listItem);

    // store search history in local storage
    var searchHistory = localStorage.getItem('searchHistory');
    if(searchHistory) {
        searchHistory = JSON.parse(searchHistory);
    } else {
        searchHistory = [];
    }
    searchHistory.push(cityName);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}   

function loadSeachHistory() {
    var searchHistory = localStorage.getItem('searchHistory');
    if (searchHistory) {
        searchHistory = JSON.parse(searchHistory);
        for (var cityName of searchHistory) {
            updateSearchHistory(cityName);
        }
    }
}

loadSeachHistory();