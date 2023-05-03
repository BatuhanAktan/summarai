let urlForm = document.getElementById("url-form");


urlForm.addEventListener("submit", (url)=>{

    //Setting url Location
    let urlLocation = document.getElementById("url");

    //Setting the summary to None
    typeToSummary("");

    //Url value Setting
    let address = urlLocation.value;

    //Setting url to None
    urlLocation.value = "";

    //Preventing Default
    url.preventDefault();

    //Checking if the url is valid
    if (!urlCheck(address)){

    typeToSummary("That URL seems to not work");

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
const typeToSummary = (content)=>{
    let summary = document.getElementById("summary");
    summary.textContent=content;
};

//Getting Url Content with Server
async function getUrlContent (url){
    //Prepping JSON
    url = {url};

    //POST Request to Backend to Retrieve HTML
    const content = await fetch('/api', {
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
        typeToSummary(a);
    }

    //Running the async Function
    o();
};