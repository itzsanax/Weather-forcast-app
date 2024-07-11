const apiKey = 'f31a29649fdb81b6b9968f1ad2db732d';

function getWeatherByCity() {
    const city = document.getElementById('cityInput').value;
    if (city) {
        const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
        console.log('Fetching weather for city:', city);
        fetchWeatherData(weatherUrl);
        fetchForecastData(forecastUrl);
    } else {
        alert('Please enter a city name');
    }
}

function getWeatherByLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
            console.log('Fetching weather for location:', latitude, longitude);
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

function fetchWeatherData(url) {
    console.log('Fetching weather data from URL:', url);
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Weather data:', data);
            const weatherContainer = document.getElementById('weatherContainer');
            weatherContainer.innerHTML = `
            <div class="weather-container grid grid-cols-2 gap-4">
    <div class="weather-box bg-blue-200 p-4 rounded shadow-lg">
        <h2 class="text-2xl font-bold">Temperature</h2>
        <p class="text-xl">${data.main.temp} °C</p>
    </div>
    <div class="weather-box bg-green-200 p-4 rounded shadow-lg">
        <h2 class="text-2xl font-bold">Humidity</h2>
        <p class="text-xl">${data.main.humidity} %</p>
    </div>
    <div class="weather-box bg-yellow-200 p-4 rounded shadow-lg">
        <h2 class="text-2xl font-bold">Wind Speed</h2>
        <p class="text-xl">${data.wind.speed} m/s</p>
    </div>
    <div class="weather-box bg-purple-200 p-4 rounded shadow-lg">
        <h2 class="text-2xl font-bold">Precipitation</h2>
        <p class="text-xl">${data.clouds.all}%</p>
    </div>
</div>
    
            `;
        })
        .catch(error => {
            alert('Error fetching weather data. Please try again later.');
            console.error('Error fetching weather data:', error);
        });
}

