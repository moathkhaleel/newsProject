async function handleSubmit(event) {
    event.preventDefault()
    const imageScr = document.getElementById('image').firstElementChild;
    const city = document.getElementById('cityName');
    const countryName = document.getElementById('countryName').value;
    const dateInput = document.getElementById('tripdate').value;
    const tripDate = checkDate(dateInput);
    const valueCheck1 = inputChecker(city.value)
    const valueCheck2 = inputChecker(countryName)
    console.log(`country is ${countryName}`)
    if (valueCheck2 || valueCheck1 || dateChecker(tripDate)) {
        if (dateChecker(tripDate)) {
            alert("please enter a date after today")
        }
        else {
            alert('please enter city and country names')
        }

    }
    else {
        console.log(countryName)
        console.log(tripDate)
        //creating an API call
        const countryData =  await appBody(url ='http://localhost:8081/countryCode', data = {countryName: countryName})
        const coordinates = await appBody(url = 'http://localhost:8081/getCoord', data = {city: city.value, country: countryData.alpha2Code}) 
        const weather = await appBody(url = 'http://localhost:8081/getWeath', data = {date: tripDate, lat: coordinates.lat, lng: coordinates.lng})
        const image = await appBody(url = 'http://localhost:8081/getImg', data = {city: city.value, countryName: countryName})
        .then(function(image) {
            imageScr.src = image
            console.log(weather)
            //postData('/addWeather', data = {lat: data.lat, lng: data.lng}) //, data = {irony: data.irony, date: newDate, subjectivity: data.subjectivity}
            updateUI(city, countryName, dateInput, tripDate, weather)
        })
    }
};

const appBody = async (url = '', data) => {
    const request = await fetch(url, {
        method: 'POST', 
        credentials: 'same-origin', 
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), 
    });
    try {
        const allData = await request.json()
        return allData
    } catch(error) {
        console.log("error", error)
    }
};

function test(string, char) {
    if (string.slice(-char.length) == char) {
        return string.slice(0, -char.length)
    }
    else {
        return string
    }
}

function checkDate(someDate) {
    const someDateParsed = parseDate(someDate)
    // Create a new date instance dynamically with JS
    var today = new Date()
    var seconds = someDateParsed.getTime() - today.getTime()
    var number = Math.round(seconds/(1000*60*60*24))
    return number 
}

function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
  }

const updateUI = async (city, countryName, dateInput, tripDate, weather) => {
    try {
        document.getElementById('dest').innerHTML = `<strong> Destination: </strong> ${city.value}, ${countryName}`;
        document.getElementById('departing').innerHTML = `<strong> Departing on: </strong> ${dateInput}`;
        document.getElementById('away').innerHTML = `${city.value}, ${countryName} is ${tripDate} days away`;
        if (tripDate<=7) {
            document.getElementById('forecast-description').innerHTML = `Description: ${weather.description}`;
            document.getElementById('forecast').innerHTML = `Temperature: ${weather.temp}`;
        }
        else if (tripDate>7) {
            document.getElementById('forecast-description').innerHTML = `Description: ${weather.description}`;
            document.getElementById('forecast').innerHTML = `High: ${weather.max_temp}, Low: ${weather.min_temp}`;
        }
    } catch(error) {
        console.log("error", error)
    }
}
//check for empty country and city fields by user
function inputChecker(str) {
    return (str.match(/^\s*$/) || []).length > 0;
}
//check for date in the past 
function dateChecker(date) {
    return date<-1
}


export { handleSubmit }
