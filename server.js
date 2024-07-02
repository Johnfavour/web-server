// require('dotenv').config();
// const express = require('express');
// const axios = require('axios');
// const app = express();

// const ipinfoToken = process.env.IPINFO_API_KEY;
// const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;

// app.get('/api/hello', async (req, res) => {
//     const visitorName = req.query.visitor_name || 'Guest';
//     const clientIp = req.ip === '::1' ? '127.0.0.1' : req.ip;

//     try {
//         const locationResponse = await axios.get(`https://ipinfo.io/${clientIp}/json?token=${ipinfoToken}`);
//         const location = locationResponse.data.city || 'New York';

//         const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`);
//         const temperature = weatherResponse.data.main.temp;

//         res.json({
//             client_ip: clientIp,
//             location: location,
//             greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
//         });
//     } catch (error) {
//         console.error('Error:', error.message);
//         res.status(500).json({ error: 'Error retrieving data' });
//     }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}`);
// });


require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

const ipinfoToken = process.env.IPINFO_API_KEY;
const weatherApiKey = process.env.OPENWEATHERMAP_API_KEY;

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = req.ip === '::1' ? '127.0.0.1' : req.ip;

    try {
        // Get location details using ipinfo.io API
        const locationResponse = await axios.get(`https://ipinfo.io/${clientIp}/json?token=${ipinfoToken}`);
        const location = locationResponse.data.city || 'New York';

        // Get weather details using OpenWeatherMap API
        const weatherResponse = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`);
        const temperature = weatherResponse.data.main.temp;

        // Send the response back to the client
        res.json({
            client_ip: clientIp,
            location: location,
            greeting: `Hello, ${visitorName}!, the temperature is ${temperature} degrees Celsius in ${location}`
        });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ error: 'Error retrieving data' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
