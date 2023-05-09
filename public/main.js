
let urlForm = document.getElementById("url-form");


addEventListener("load", (event) => {
    startModel();

});

urlForm.addEventListener("submit", (url)=>{

    //Setting url Location
    let urlLocation = document.getElementById("url");

    //Url value Setting
    let address = urlLocation.value;

    //Setting url to None
    urlLocation.value = "";

    //Preventing Default
    url.preventDefault();

    //Checking if the url is valid
    if (!urlCheck(address)){

    let summary = document.getElementById("summary");
    summary.textContent="That Url doesn't seem to work!";

    return null;
 
    };

    //Getting Url Content
    getUrlContent(address);
    

});

const urlCheck = (url) => {
    //Checking if the URL is valid
    try{

        new URL (url);

    }catch (error) {

        console.log("Not valid URL");
        return false;

    }

    return true;
};


//Typing to Summary
const typeToSummary = (content, url)=>{
    let summary = document.getElementById("summary");
    summary.textContent=content;
};




/*
async function recordRating(rating, url, response){
    toggleOff();
    const content = await fetch('/database/rating', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        rating: JSON.stringify(rating),
        url: JSON.stringify(url),
        response: JSON.stringify(response)
    });
}
*/

//Getting Url Content with Server
async function getUrlContent (url){
    //Prepping JSON
    var urlAddress = url;
    console.log(url);
    url = {url};

    //POST Request to Backend to Retrieve HTML
    const content = await fetch('/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(url)
    });

    //Returned Content from the POST request
    let returnContent = await content.json();
    
    //ASYNC function to get value from promise
    const o = async () =>{
        console.log("OUT");
        let a = await JSON.stringify(returnContent.body.a);
        a = a.slice(1,-1);
        console.log("OUT", a);
        typeToSummary(a, urlAddress);
    }

    //Running the async Function
    o();
};


const startModel = async () => {
    var url = "https://education.nationalgeographic.org/resource/photosynthesis/";
    url = {url};
    const content = await fetch('/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(url)
    });

    let returnContent = await content.json();

    console.log("Model Started", returnContent);
};

/*
const toggleOn = () => {
    document.getElementById("rating").style.display = "absolute";
    setTimeout(() => {console.log(document.getElementById("rating").style.display)});
}

const toggleOff = () => {
    document.getElementById("rating").style.display = "none";
    setTimeout(() => {console.log(document.getElementById("rating").style.display)});
}

const alarm = () => {
    let rating = document.getElementById("rating");
    alert(rating.style.display);
}
*/