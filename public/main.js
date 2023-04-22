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

    getUrlContent(address);
    

});

const urlCheck = (url) => {

    try{

        new URL (url);

    }catch (error) {

        console.log("Not valid URL");
        return false;

    }

    return true;
};

const typeToSummary = (content)=>{
    let summary = document.getElementById("summary");
    summary.textContent=content;
};

async function getUrlContent (url){
    url = {url};
    const content = await fetch('/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(url)
    });

    let returnContent = await content.json();
    
    const o = async () =>{
        console.log("OUT");
        let a = await JSON.stringify(returnContent.body.a);
        console.log("OUT", a);
        typeToSummary(a);
    }

    o();
};