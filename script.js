const apiKey = 'f31a29649fdb81b6b9968f1ad2db732d';

// event listener for when the DOM content is fully loaded
document.addEventListener('DOMContentLoaded', loadRecentCities);

// function to load recent cities from localStorage
function loadRecentCities() {
    // gets recent cities from localStorage or initialize an empty array if none found
    const recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    const recentCitiesDropdown = document.getElementById('recentCities');
    
    // hides dropdown if no there are no searched cities
    recentCitiesDropdown.style.display = 'none';
    if (recentCities.length > 0) {
        // populates dropdown with searched cities
        recentCitiesDropdown.innerHTML = '<option value="" disabled selected>Select a recent city</option>';
        recentCities.forEach(city => {
            const option = document.createElement('option');
            option.value = city;
            option.textContent = city;
            recentCitiesDropdown.appendChild(option);
        });

        // shows dropdown if recent cities are available
        recentCitiesDropdown.style.display = 'block';
    } else {
        console.log('No searched cities found.');
    }
}

// function to update recent cities in localStorage and reload dropdown
function updateRecentCities(city) {
    let recentCities = JSON.parse(localStorage.getItem('recentCities')) || [];
    if (!recentCities.includes(city)) {
        // add new city to the beginning of the array
        recentCities.unshift(city);
        // limit to 5 recent cities
        if (recentCities.length > 5) {
            recentCities.pop();
        }
        localStorage.setItem('recentCities', JSON.stringify(recentCities));
        loadRecentCities();
    }
}

// event listener for when a city is selected from the dropdown
document.getElementById('recentCities').addEventListener('change', function () {
    const city = this.value;
    getWeatherByCity(city);
});

// function to fetch weather data by city name
function getWeatherByCity(city = null) {
    // uses the provided city or get it from the input field
    city = city || document.getElementById('cityInput').value;
    if (city) {
        // validates city name (letters and spaces only)
        if (!/^[a-zA-Z\s]+$/.test(city)) {
            alert('Please enter a valid city name');
            return;
        }
        updateRecentCities(city);
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        fetchWeatherData(weatherUrl);
        fetchForecastData(forecastUrl);
    } else {
        alert('Please enter a city name');
    }
}

// function to fetch weather data by current location
function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            fetchWeatherData(weatherUrl);
            fetchForecastData(forecastUrl);
        }, error => {
            alert('Error getting location. Please try again.');
            console.error('Geolocation error:', error);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// function to fetch and display current weather data
function fetchWeatherData(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const weatherContainer = document.getElementById('weatherContainer');
            weatherContainer.innerHTML = `
                <div class="weather-container flex flex-col items-center bg-teal-100 p-4 rounded shadow-lg">
                    <div class="weather-box flex flex-col p-5">
                        <img src="icons/cloud.png" alt="cloud Icon" class="w-10 h-15 ml-3">
                        <p class="text-2xl">${data.main.temp} °C</p>
                    </div>
                    <div class="flex flex-row justify-evenly">
                        <div class="weather-box flex flex-col items-center px-16 p-6 mr-2">
                            <img src="icons/humidity.png" alt="humidity Icon" class="w-10 h-10 ml-3">
                            <h2 class="text-lg font-bold">Humidity</h2>
                            <p class="text-lg">${data.main.humidity} %</p>
                        </div>
                        <div class="weather-box flex flex-col items-center px-16 p-6 ml-2">
                            <img src="icons/speedwind.png" alt="wind speed Icon" class="w-10 h-10 ml-3">
                            <h2 class="text-lg font-bold">Wind Speed</h2>
                            <p class="text-lg">${data.wind.speed} m/s</p>
                        </div>
                    </div>
                    <div class="weather-box flex flex-col items-center p-3">
                        <img src="icons/rain.png" alt="rain Icon" class="w-10 h-10 ml-3">
                        <h2 class="text-lg font-bold">Precipitation</h2>
                        <p class="text-lg">${data.clouds.all}%</p>
                    </div>
                </div>
                <hr>
            `;
        })
        .catch(error => {
            alert('Error fetching weather data. Please try again later.');
            console.error('Error fetching weather data:', error);
        });
}

// function to fetch and display forecast data
function fetchForecastData(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            const forecastContainer = document.getElementById('forecastContainer');
            forecastContainer.innerHTML = ''; // Clear previous content
            const header = document.createElement('h3');
            header.className = 'text-2xl font-bold mb-4 my-10 text-center';
            header.textContent = '5-Day Forecast';
            forecastContainer.appendChild(header);
            
            const forecastRow = document.createElement('div');
            forecastRow.style.display = 'flex';
            forecastRow.style.flexDirection = 'row';
            forecastRow.style.flexWrap = 'wrap';
            forecastRow.style.justifyContent = 'center';
            forecastRow.style.backgroundColor = '#EBF4F6';
            forecastRow.style.paddingTop = '25px';
            forecastContainer.appendChild(forecastRow);

            for (let i = 0; i < data.list.length; i += 8) {
                const forecast = data.list[i];
                const forecastIcon = getWeatherIcon(forecast.weather[0].id);
                const forecastItem = document.createElement('div');
                forecastItem.className = 'flex justify-center items-center bg-gray-100 mb-2 mx-2';
                forecastItem.innerHTML = `
                    <div class="weather-box bg-zinc-700 p-6 rounded shadow-lg w-64">
                        <div class="date-description text-center m-2">
                            <p class="text-lg font-bold p-2">${new Date(forecast.dt_txt).toLocaleDateString()}</p>
                            <p class="italic p-1">${forecast.weather[0].description}</p>
                            <i class="wi ${forecastIcon} text-4xl"></i>
                        </div>
                        <div class="weather-details text-center">
                            <p class="p-2"><i class="fas fa-thermometer-half"></i> Temp: ${forecast.main.temp} °C</p>
                            <p class="p-2"><i class="fas fa-wind"></i> Wind: ${forecast.wind.speed} m/s</p>
                            <p class="p-2"><i class="fas fa-tint"></i> Humidity: ${forecast.main.humidity} %</p>
                        </div>
                    </div>
                `;
                forecastRow.appendChild(forecastItem);
            }
        })
        .catch(error => {
            alert('Error fetching forecast data. Please try again later.');
            console.error('Error fetching forecast data:', error);
        });
}

// function to map weather condition IDs to icon class names
function getWeatherIcon(weatherId) {
    // object to map the first digit of weather ID to corresponding icon class names
    const weatherIcons = {
        '2': 'wi-thunderstorm', 
        '3': 'wi-sprinkle', 
        '5': 'wi-rain', 
        '6': 'wi-snow', 
        '7': 'wi-fog', 
        '8': 'wi-day-sunny', 
        '80': 'wi-cloudy', 
        '90': 'wi-rain-mix' 
    };

    // convert weatherId to string and get the first character
    // return the corresponding icon class or a default 'wi-day-sunny' if not found
    return weatherIcons[String(weatherId).charAt(0)] || 'wi-day-sunny';
}
