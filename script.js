// Store API key in a more secure way (for production, use environment variables and a backend)
const apiKey = '9e3ea8c9f4ad7de6990cde9f0bdedf96';

// Elements
const cityInput = document.getElementById('city-input');
const weatherContainer = document.getElementById('weather-container');
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error-message');

// Add event listener for Enter key
cityInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    getWeather();
  }
});

async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    showError('Please enter a city name');
    return;
  }

  // Show loading, hide results and errors
  showLoading(true);
  weatherContainer.classList.add('hidden');
  errorElement.classList.add('hidden');

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    
    const data = await res.json();

    if (data.cod !== 200) {
      showError(data.message || 'City not found!');
      return;
    }

    // Update weather information
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('temperature').textContent = `${Math.round(data.main.temp)}°C`;
    document.getElementById('city-name').textContent = data.name;
    document.getElementById('humidity').textContent = `${data.main.humidity}%`;
    document.getElementById('wind-speed').textContent = `${data.wind.speed} km/h`;
    
    // Show weather container
    weatherContainer.classList.remove('hidden');
  } catch (err) {
    showError('Error fetching weather data. Please try again later.');
    console.error(err);
  } finally {
    showLoading(false);
  }
}

function showLoading(isLoading) {
  if (isLoading) {
    loadingElement.classList.remove('hidden');
  } else {
    loadingElement.classList.add('hidden');
  }
}

function showError(message) {
  errorElement.textContent = message;
  errorElement.classList.remove('hidden');
  weatherContainer.classList.add('hidden');
  showLoading(false);
}

// Optional: Load weather for a default city on page load
window.addEventListener('load', () => {
  cityInput.value = 'London'; // Default city
  getWeather();
});