const express = require('express');
const axios = require('axios');
const app = express();

const ipinfoToken = 'https://ipinfo.io/105.112.102.181/json?token=a7a66f749953c5';
const weatherApiKey = '245b388dae7898e94744c82efd06507d';

// Root route to handle the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Weather API! Use /api/hello?visitor_name=YourName to get a greeting.');
});

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.ip === '::1' || req.ip === '::ffff:127.0.0.1' ? '127.0.0.1' : req.ip;

    try {
        // Getting the location information from IPInfo
        let location = 'New York'; 
        if (clientIp !== '127.0.0.1') {
            const locationResponse = await axios.get(`https://ipinfo.io/${clientIp}/json?token=${ipinfoToken}`);
            location = locationResponse.data.city || 'New York';
        }

        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`);
        const temperature = weatherResponse.data.main.temp;

        res.json({
            client_ip: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
        });
    } catch (error) {
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
            console.error('Error headers:', error.response.headers);
        } else if (error.request) {
            console.error('Error request:', error.request);
        } else {
            console.error('Error message:', error.message);
        }
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});