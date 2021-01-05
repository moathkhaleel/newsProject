projectData = {};

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


app.get('/call', async (req, res) => {
    const userInput = req.body; 
    const apiURL = `https://api.meaningcloud.com/sentiment-2.1?key=${process.env.API_KEY}&lang=en&of=json&txt=${userInput}`;
    console.log(`Your API url is ${apiURL}`);
    const response = await fetch(apiURL);
    const data = await response.json()
    res.json(data);
})


