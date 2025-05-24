async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const apiKey = '565577757f28a71b7e43393e1fef68a1';
  const weatherDiv = document.getElementById('weather');

  if (!city) {
    weatherDiv.innerHTML = '<p class="error">Please enter a location.</p>';
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;

  weatherDiv.innerHTML = '<p>Loading...</p>';

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('City not found. Please try another location.');
      } else {
        throw new Error('Unable to retrieve weather data.');
      }
    }

    const data = await response.json();
    const temp = data.main.temp;
    const description = data.weather[0].description;
    const icon = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
    
    const lat = data.coord.lat;
    const lon = data.coord.lon;

    
    const aqiUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const aqiResponse = await fetch(aqiUrl);

    if (!aqiResponse.ok) {
      throw new Error('Failed to retrieve air quality data.');
    }

    const aqiData = await aqiResponse.json();
    const aqi = aqiData.list[0].main.aqi;

    const aqiLevels = {
      1: "Good ",
      2: "Fair ",
      3: "Moderate ",
      4: "Poor ",
      5: "Very Poor "
    };
    weatherDiv.innerHTML = `
      <h2>Weather in ${data.name}</h2>
      <p><strong>Temperature:</strong> ${temp} °C</p>
      <p><strong>Condition:</strong> ${description.charAt(0).toUpperCase() + description.slice(1)}</p>
      <img src="${iconUrl}" alt="${description}" />
      <div id="airQuality">
        <h3>Air Quality Index</h3>
        <p><strong>AQI:</strong> ${aqi}</p>
        <p><strong>Air Quality:</strong> ${aqiLevels[aqi] || 'Unknown'}</p>
      </div>
    `;
  } catch (error) {
    weatherDiv.innerHTML = `<p class="error">${error.message}</p>`;
  }
}
