const express = require('express');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;
const openWeatherMapApiKey = '1397a3d30af52d27312a3363ef5e9599'; 
const abstractApiKey = 'bf4d1414df8d4e3d8ee7969b95ab5e1f'; 

async function getWeather(city) {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${openWeatherMapApiKey}`;
  try {
    const response = await axios.get(url);
    return response.data.main.temp;
  } catch (error) {
    console.error('Error fetching weather data:', error.message);
    throw error;
  }
}

async function getGeolocation(ip) {
  const url = `https://ipgeolocation.abstractapi.com/v1/?api_key=${abstractApiKey}&ip_address=${ip}`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching geolocation data:', error.message);
    throw error;
  }
}

// the root route
app.get('/', (req, res) => {
  res.send('Welcome to the Weather API! Use /api/hello?visitor_name=YourName to get a greeting.');
});

// API endpoint to get user's location and greeting
app.get('/api/hello', async (req, res) => {
  const visitorName = req.query.visitor_name || 'Guest';

  // Getting the client's IP address
  let clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  if (Array.isArray(clientIp)) {
    clientIp = clientIp[0];
  } else if (clientIp.includes(',')) {
    clientIp = clientIp.split(',')[0];
  }

 
  clientIp = clientIp.trim();

  
  if (clientIp === '::1' || clientIp === '127.0.0.1') {
    clientIp = '105.112.106.226'; // where the ip address was added manually
  }

  console.log(`Client IP: ${clientIp}`);

  try {
    // Using AbstractAPI to get the ip address
    const geo = await getGeolocation(clientIp);
    console.log(`Geo data: ${JSON.stringify(geo)}`);

    if (!geo || !geo.city) {
      return res.status(500).json({ error: 'Failed to fetch geolocation data' });
    }

    const city = geo.city;

    let temperature = null;
    try {
      temperature = await getWeather(city);
    } catch (error) {
      return res.status(500).json({ error: `Failed to fetch weather data: ${error.message}` });
    }

    const greeting = temperature !== null
      ? `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${city}.`
      : `Hello, ${visitorName}! Unable to retrieve the temperature for ${city}.`;

    res.json({
      client_ip: clientIp,
      location: city,
      greeting: greeting
    });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving data' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});



