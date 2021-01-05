function handleSubmit(event) {
    event.preventDefault()

    // check what text was put into the form field
    let formText = document.getElementById('name').value.replace(/\s/g,"&");
    const newData = postData('http://localhost:8081/call', {formText: formText})
    updateUI(newData)
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
    const request = await fetch('/call')
    try {
        const allData = await request.json()
        console.log(allData);
        document.getElementById('irony').innerHTML = allData.irony;
        document.getElementById('subjectivity').innerHTML = allData.subjectivity;
    } catch(error) {
        console.log("error", error)
    }
}

export { handleSubmit }
