let urlForm = document.getElementById("url-form");
let rateSubmit = document.getElementById("rating-submit");


urlForm.addEventListener("submit", (url)=>{

    let feedback  = document.getElementById("feedback");
    feedback.style.display="none";

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

    let rating = document.getElementById("rating");
    rating.style.display = 'absolute';

    rateSubmit.addEventListener("submit", ()=>{
        var options = document.getElementsByName("response-quality");
    
        for (i = 0; i < options.length; i++){
            if (options[i].checked){
                try{
                    result[i].value.length;
                    var result = result[i].value;
                    recordRating(result, url, content);
                }catch(err){
                    console.log("Could not submit response");
                }
            }
        }
    });

};

async function recordRating(rating, url, response){
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


//Getting Url Content with Server
async function getUrlContent (url){
    //Prepping JSON
    var urlAddress = url;

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