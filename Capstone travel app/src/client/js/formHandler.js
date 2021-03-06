const buttonElement = document.getElementById('generate');
// ad an event listener when the button is clicked
buttonElement.addEventListener('click', handleSubmit(e))

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
    //check if the country, city, and date field are empty. If they are, raise an alert, if not, proceed. 
    if (valueCheck2 || valueCheck1 || dateChecker(dateInput)) {
        if (dateChecker(dateInput)) {
            alert("please enter a date after today")
        }
        else {
            alert('please enter city and country names')
        }

    }
    else {
        console.log(countryName)
        console.log(tripDate)
        //creating an API call to different APIs
        const countryData =  await appBody('http://localhost:8081/countryCode', {countryName: countryName})
        const coordinates = await appBody('http://localhost:8081/getCoord', {city: city.value, country: countryData.alpha2Code}) 
        const weather = await appBody('http://localhost:8081/getWeath', {date: tripDate, lat: coordinates.lat, lng: coordinates.lng})
        const image = await appBody('http://localhost:8081/getImg', {city: city.value, countryName: countryName})
        .then(function(image) {
            //update the image
            imageScr.src = image
            console.log(weather)
            //postData('/addWeather', data = {lat: data.lat, lng: data.lng}) //, data = {irony: data.irony, date: newDate, subjectivity: data.subjectivity}
            //update the required fields 
            updateUI(city, countryName, dateInput, tripDate, weather)
        })
    }
};

//the one common function for server call to reduce code 
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
        alert(error)
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
//checks the number of days until the trip 
function checkDate(someDate) {
    const someDateParsed = parseDate(someDate)
    // Create a new date instance dynamically with JS
    var today = new Date()
    var seconds = someDateParsed.getTime() - today.getTime()
    var number = Math.round(seconds/(1000*60*60*24))
    return number 
}
//parses date to convert to days
function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
    return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
  }
//updates the user's UI
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
    if (checkDate(date)<-1 || date=="") {
        return true
    }
    else {
        return false
    }
}


export { handleSubmit }
