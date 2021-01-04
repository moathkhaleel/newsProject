import fetch from "node-fetch";

function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let formText = document.getElementById('name').value.replace(/\s/g,"&");
    console.log("fetch initiated");
    fetch('http://localhost:8081/', {formText: formText})
    .then(function(data) {
        console.log(data.irony)
        postData('/addText', data = {irony: data.irony, subjectivity: data.subjectivity})
        updateUI()
    })

}

const postData = async (url, data) => {
    const response = await fetch(url, {
       method: 'POST', 
       credentials: 'same-origin', 
       headers: {
           'Content-Type': 'application/json',
       },
       body: JSON.stringify(data), 
   });
   try {
       const newData = await response.json();
       return newData
   } catch(eror) {
       console.log("error", error);
   } 
};

const updateUI = async () => {
    const request = await fetch('/all')
    try {
        const allData = await request.json()
        console.log(allData);
        document.getElementById('irony').innerHTML = allData.irony;
        document.getElementById('subjectivity').innerHTML = allData.subjectivity;
    } catch(error) {
        console.log("error", error)
    }
}

const makeCall = async(txt) => {
    const res = await fetch(baseURL1 + apiKey + txt + baseURL2) 
    try {
        const data = await res.json();
        console.log(data)
        return data;
    } catch(error) {
        console.log("error", error);
    } 
}

export { handleSubmit }
