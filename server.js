require('dotenv').config();

const express = require('express');
const axios = require('axios');
const app = express();

const ipinfoToken = process.env.IPINFO_API_KEY;
const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.ip;

    try {
        const locationResponse = await axios.get(`https://ipinfo.io/${clientIp}/json?token=${ipinfoToken}`);
        const location = locationResponse.data.city || 'Unknown Location';

        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`);
        const temperature = weatherResponse.data.main.temp;

        const response = {
            client_ip: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
        };

        res.json(response);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
