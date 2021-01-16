var path = require('path')
const express = require('express')
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
dotenv.config();
const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const cors = require('cors');
const { default: fetch } = require('node-fetch');
app.use(cors())
app.use(express.static('dist'))

// Setup needed URLs:
//countries api
const baseCounrty = "https://restcountries.eu/rest/v2/name/"
//geonames api
const baseURL1 = 'http://api.geonames.org/postalCodeSearchJSON?maxRows=1&placename=';
//weatherbit api
const baseWeather1 = "https://api.weatherbit.io/v2.0/forecast/daily?"
const baseWeather2 = "https://api.weatherbit.io/v2.0/current?"
//pixabay url
const baseimg1 = "https://pixabay.com/api/"

app.get('/', function (req, res) {
    //res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8081, listening)

function listening(req, res) {
    console.log('Example app listening on port 8081!');
}

//making a call to the rest countries api to obtain country code
const getCountryCode =  async (req, res) => {
    console.log(req.body.countryName)
    const countryNameFetch1 = replaceLetter(req.body.countryName,"%20")
    try {
        const respon = await fetch(baseCounrty+countryNameFetch1)
        const data1 = await respon.json();
        const data = data1[0]
        res.json(data)
    } catch(error) {
        console.log("error", error);
    } 
}

app.post('/countryCode', getCountryCode)

//making a call to the geo names api to get location coordinates 
const getCoord = async (req, res) => {
    const CC = `&country=${req.body.country}`
    const cityFetch = replaceLetter(req.body.city,"&")
    try {
        const resp = await fetch(baseURL1+cityFetch+CC+(process.env.coordinatesURL)) 
        const data1 = await resp.json();
        const data = data1.postalCodes[0];
        if (data) {
            res.json(data);
        }
        else if (!data) {
            console.log("trying without country code")
            const res1 = await fetch(baseURL1+cityFetch+(process.env.coordinatesURL))
            const data2 = await res1.json();
            const data3 = data2.postalCodes[0]
            res.json(data3) 
        }
    } catch(error) {
        console.log("error", error);
    }
}

app.post('/getCoord', getCoord)

//making a call to the weatherbit api to obtain weather data 
const getWeath = async (req, res) => {
    const coord = `lat=${req.body.lat.toFixed(4)}&lon=${req.body.lng.toFixed(4)}`
    console.log(coord)
    const weath = await fetchDateRes(coord, req.body.date)
    try {
        res.json(weath)
    } catch(error) {
        console.log("error", error);
    }
}

app.post('/getWeath', getWeath)

//making a call to the pixabay api to obtain a picture of the city. If unsuccessful, a pic of the country is fetched. 
const getImg = async (req, res) => {
    const cityFetch1 = replaceLetter(req.body.city,"+")
    const countryNameFetch = replaceLetter(req.body.countryName,"+")
    console.log(`the city is ${cityFetch1}`)
    console.log(`the country is ${countryNameFetch}`)
    //try to fetch a picture of the city
    try {
        const respon = await fetch(baseimg1+(process.env.imageURL)+cityFetch1+"+city") 
        const data1 = await respon.json();
        const data2 = data1.hits[1];
        if (data2) {
            const data = data2.webformatURL;
            res.json(data);
        }
        //try and fetch a picture of the country instead 
        else if (!data2) {
            console.log('city failed trying country')
            const res2 = await fetch(baseimg1+(process.env.imageURL)+countryNameFetch)
            const data3 = await res2.json();
            const data4 = data3.hits[1].webformatURL;
            res.json(data4)
        }
    } catch(error) {
        console.log("error", error);
    }
}

app.post('/getImg', getImg) 

//the fetchDateRes function fetches weather data according to the number of days until the trip 
const fetchDateRes = async (coord, date) => {
    //if the trip is less than a week away, the current forecast is projected
    if (date<=7) {
        const res = await fetch(baseWeather2+coord+(process.env.weatherURL))
        const weather = await res.json();
        const weath = {
            description: weather.data[0].weather.description, 
            temp: weather.data[0].app_temp
        }
        return weath
    }
    //if the trip is between a week and 16 days away, a future forecast is projected
    else if (date>7 && date<=16) {
        const res = await fetch(baseWeather1+coord+(process.env.weatherURL))
        const weather = await res.json();
        return fetchWeather(weather, date)
    }
    //if the trip is more than 16 days away, the forecast after 16 days is projected regardless
    else if (date>16) {
        const res = await fetch(baseWeather1+coord+(process.env.weatherURL))
        const weather = await res.json();
        return fetchWeather(weather, 15);
    } 
}

//to avoid error when user leaves a trailing space char 
function test(string, char) {
    if (string.slice(-char.length) == char) {
        return string.slice(0, -char.length)
    }
    else {
        return string
    }
}

//to replace letters according to api call requirement
function replaceLetter(string, letter) {
    const newstring = string.replace(/\s/g,letter)
    return test(newstring, letter)
}

//get weather data from weatherbit
function fetchWeather(weather, num) {
    const weath = {
            max_temp: weather.data[num].app_max_temp,
            min_temp: weather.data[num].app_min_temp, 
            description: weather.data[num].weather.description
        }
    return weath
}
