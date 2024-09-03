const bodyParser = require('body-parser');
const { log, error } = require('console');
const { configDotenv } = require('dotenv');
const express = require('express');
const https = require("https");

const app = express();
require('dotenv').config();

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    // res.send("Server is running so well");
    res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
    const query = req.body.location;
    const app_key = process.env.APP_KEY;
    const unit = "metric";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${app_key}&units=${unit}`;
    https.get(weatherUrl, (response) => {
        console.log(response.statusCode);
    
        let data ='';
        // A chunk of data has been recieved
        response.on('data', (chunk) => {
            data += chunk;
        });
    
        // The whole response has been received
        response.on('end', () => {
            // Parse and display the JSON data in the console
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
            
            
            res.write(`<h1>The weather is currently ${weatherDescription}</h1>`);
            res.write(`<h2>The temperature is ${query} is ${temp} degree celcius</h2>`)
            res.write(`<img src="${iconUrl}">`);
            res.send();
        }).on('error', (error) => console.error('Error: ', error));
            
    });
});
app.listen(3000, () => console.log("Server is listening to port 3000"));