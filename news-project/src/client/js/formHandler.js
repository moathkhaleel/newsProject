import { inputChecker } from './inputChecker'

function handleSubmit(event) {
    event.preventDefault()
    let formText1 = document.getElementById('name').value;
    const check = inputChecker(formText1);
    console.log(check);
    if (check == true) {
        failed()
    }
    else {
        let formText = document.getElementById('name').value.replace(/\s/g,"&")
        const newData = postData('http://localhost:8081/call', {formText: formText})
        updateUI(newData)
    }
}

const postData = async (url = '', data = {}) => {
    const response = await fetch('http://localhost:8081/call', {
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
   } catch(error) {
       console.log("error", error);
   } 
};

const updateUI = async () => {
        const request = await fetch('http://localhost:8081/call')
        try {
            const allData = await request.json()
            console.log(allData);
            document.getElementById('irony').innerHTML = allData.irony;
            document.getElementById('subjectivity').innerHTML = allData.subjectivity;
            document.getElementById('agreement').innerHTML = allData.agreement;
            document.getElementById('score_tag').innerHTML = allData.score_tag;
            document.getElementById('confidence').innerHTML = allData.confidence;
        } catch(error) {
            console.log("error", error)
        }
}

function failed () {
    document.getElementById('irony').innerHTML = "please enter a valid text";
    document.getElementById('subjectivity').innerHTML = " ";
    document.getElementById('agreement').innerHTML = " ";
    document.getElementById('score_tag').innerHTML = " ";
    document.getElementById('confidence').innerHTML = " ";
}

export { handleSubmit }
