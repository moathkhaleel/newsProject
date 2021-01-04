projectData = {};
const baseURL1 = 'https://api.meaningcloud.com/sentiment-2.1?key=';
const baseURL2 = '&lang=en';
const apiKey = '10f35138a7823dddd2ea0d38211aa8bb&of=json&txt=';

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

console.log(__dirname)

app.get('/', function (req, res) {
    //res.sendFile('dist/index.html')
    res.sendFile(path.resolve('src/client/views/index.html'))
})

// designates what port the app will listen to for incoming requests
app.listen(8081, listening)

function listening(req, res) {
    console.log('Example app listening on port 8081!');
}

app.get('/all', getData)

function getData(req,res) {
    res.send(projectData)
    console.log(projectData)
    console.log('getdata complete')
}

app.post('/addText', addText);

function addText(req,res) {
    console.log('addText')
    newEntry = {
        irony: req.body.irony,
        subjectivity: req.body.subjectivity
    }
    projectData = newEntry
    res.send(projectData)
    console.log(projectData)
}


app.get('/call', async (req, res) => {
    const userInput = req.body; 
    console.log(`user input is: ${userInput}`);
    const apiURL = baseURL1 + apiKey + userInput + baseURL2;
    const response = await fetch(apiURL);
    const data = await response.json()
    res.json(data);
})


