//api key for open weather map
const apiKey = 'a06427b134583496f0d62400656b85cf';
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const currentWeather = document.getElementById('current-weather');
const temperatureElement = document.getElementById('temperature');
const weatherDescriptionElement = document.getElementById('weather-description');
const humidityElement = document.getElementById('humidity');
const windSpeedElement = document.getElementById('wind-speed');
const weatherIconElement = document.getElementById('weather-icon');
const forecastContainer = document.getElementById('forecast-container');

searchButton.addEventListener('click', () => {
    const city = searchInput.value;
    try {
        if (city) {
            getWeatherData(city);
        }
    } catch (error) {
        console.log("Error: City not found", error);
    }
});

async function getWeatherData(city) {
    try {
        // Fetch current weather data
        const currentWeatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
        const currentWeatherData = await currentWeatherResponse.json();
        console.log("Current Weather Data: ", currentWeatherData);

        // Fetch 5-day weather data
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
        
        const forecastData = await forecastResponse.json();
        console.log("5-Day Weather Data: ", forecastData);
        // console.log("Item Length: ",forecastData.list.length);
        // console.log("Item at index 0: ",forecastData.list[0]);
        
        // Update UI with 5-days Forecast
        forecastContainer.innerHTML = '';
        forecastData.list.forEach((item) => {
            // console.log("City Data: ", item);
            let date = new Date(item.dt * 1000 ).toLocaleDateString();
            let iconCode = item.weather[0].icon;
            let temp = Math.round(item.main.temp - 273.15);
            let description = item.weather[0].description;

            let card = createForecastCard(date, iconCode, temp, description);
            forecastContainer.appendChild(card);

        });

        function createForecastCard(date, iconCode, temp, description) {
            let card = document.createElement('div');
            card.style.border = '1px solid #ccc';
            card.style.padding = '15px';
            card.style.margin = '5px';

            card.innerHTML = `
            <p>Date: ${date}</p>
            <p>Icon: ${iconCode}</p>
            <p>Temp: ${temp}</p>
            <p>Description: ${description}</p>
            `;

            return card;
        }

        // end UI for forecast

        temperatureElement.textContent = `Temperature: ${currentWeatherData.main.temp} °C`; // alt + 0176 for degree

        weatherDescriptionElement.textContent = `Description: ${currentWeatherData.weather[0].description}, ${currentWeatherData.weather[0].main}`;

        humidityElement.textContent = `Humidity: ${currentWeatherData.main.humidity} %`;

        windSpeedElement.textContent = `Wind Speed: ${currentWeatherData.wind.speed} m/s`;

        weatherIconElement.src = `https://openweathermap.org/img/w/${currentWeatherData.weather[0].icon}.png`;


        // Update UI with 5-days Forecast

        // forecastContainer.innerHTML = '';
        // for (let i = 0; i < forecastData.list.length; i += 8) {
        //   const forecastItem = forecastData.list[i];
        //   const forecastDate = new Date(forecastItem.dt_txt);
        //   const forecastCard = document.createElement('div');
        //   forecastCard.classList.add('forecast-card');
        //   forecastCard.innerHTML = `
        //     <p>Date: ${forecastDate.toDateString()}</p>
        //     <img src="https://openweathermap.org/img/w/${forecastItem.weather[0].icon}.png" alt="Forecast Icon">
        //     <p>Temp: ${forecastItem.main.temp}°C</p>
        //     <p>Description: ${forecastItem.weather[0].description}</p>
        //   `;
        //   forecastContainer.appendChild(forecastCard);
        // }

    } catch(error) {
        console.log("Error in fetching Data: ", error);
    }
}


