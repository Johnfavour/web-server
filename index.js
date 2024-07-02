const express = require('express');
const axios = require('axios');
const app = express();

const weatherApiKey = '245b388dae7898e94744c82efd06507d'; 


async function fetchClientIP() {
    try {
        const response = await axios.get('https://api.ipify.org?format=json');
        return response.data.ip;
    } catch (error) {
        return 'Failed to fetch IP';
    }
}

// The code fetches the geolocation data based on IP
async function fetchGeolocation(ip) {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=lat,lon,city`);
        return response.data;
    } catch (error) {
        return { error: 'Failed to fetch geolocation' };
    }
}

// Fetch weather data based on latitude and longitude
async function fetchWeather(lat, lon, apiKey) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    try {
        const response = await axios.get(url);
        const data = response.data;
        if ('main' in data && 'temp' in data.main) {
            const temperature = data.main.temp;
            const location = data.name || 'Unknown location';
            return { temperature, location };
        } else {
            return { error: 'Temperature data not found in the response.' };
        }
    } catch (error) {
        return { error: `Error fetching data from the API: ${error.message}` };
    }
}

app.get('/', (req, res) => {
    res.send('Welcome to the Weather API! Use /api/hello?visitor_name=YourName to get a greeting.');
});

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.ip === '::1' || req.ip === '::ffff:127.0.0.1' ? '127.0.0.1' : req.ip;

    try {
        const ip = await fetchClientIP();
        if (ip === 'Failed to fetch IP') {
            return res.status(500).json({ error: 'Failed to fetch client IP' });
        }

        const geolocation = await fetchGeolocation(ip);
        if (geolocation.error) {
            return res.status(500).json(geolocation);
        }

        const { lat, lon, city } = geolocation;
        const weatherData = await fetchWeather(lat, lon, weatherApiKey);
        if (weatherData.error) {
            return res.status(500).json(weatherData);
        }

        const { temperature, location } = weatherData;
        const greetingMessage = `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location}.`;

        res.json({
            client_ip: ip,
            city,
            temperature,
            location,
            greeting: greetingMessage
        });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
