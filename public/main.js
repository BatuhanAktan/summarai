
let urlForm = document.getElementById("url-form");
let rating = document.getElementById("rating-submit");
let commentSubmit = document.getElementById("csubmit");

addEventListener("load", (event) => {
    getComments();
    $("div.alarm").fadeIn( 300 ).delay(6000).fadeOut( 400 );
    userId();
});

commentSubmit.addEventListener("click", () => {
    $(".csubmitbutton").attr("disabled", true);
    let comment  = document.getElementById("comment").value;
    let user = document.getElementById("usern").value;
    if (user.length > 1 && comment.length > 1){
        $("div.user-feedback").fadeIn( 300 ).delay(6000).fadeOut( 400 );
        user = user + ":";
        recordFeedback(comment, user);
    }else if (comment.length > 1){
        $("div.user-feedback").fadeIn( 300 ).delay(6000).fadeOut( 400 );
        recordFeedback(comment, "User:");
    }else{
        $(".csubmitbutton").attr("disabled", false);
        console.log("Cannot Submit");
        
    }
});

urlForm.addEventListener("submit", (url)=>{

    //Setting url Location
    let urlLocation = document.getElementById("url");

    //Url value Setting
    let address = urlLocation.value;

    //Setting url to None

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

rating.addEventListener("click", () => {
    var elements = document.getElementsByName('response-quality');
    var val = 0;
    var modelResp = document.getElementById("summary").innerHTML;
    for (i = 0; i < elements.length; i++){
        if (elements[i].checked){
            val = elements[i].value;
        }
    }
    
    if (val != 0 && modelResp.length > 0 && modelResp != "That Url doesn't seem to work!"){
        var urlAddress = document.getElementById("url").value;
        $("div.rating-feedback").fadeIn( 300 ).delay( 1500 ).fadeOut( 400 );
        recordRating(val, urlAddress, modelResp);
    }

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


async function recordRating(rating, url, response){
    rating = {rating,
        url,
        response};
    console.log("ratoing", JSON.stringify(rating));
    const content = await fetch('/database', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(rating)
    });
}


//Getting Url Content with Server
async function getUrlContent (url){
    //Prepping JSON
    url = {url};
    document.getElementById("loading").innerHTML = "<p> Loading . . . </p>";
    $(".urlSubmitButton").attr("disabled", true);
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
        let a = await JSON.stringify(returnContent.body.a);
        document.getElementById("loading").innerHTML = "";
        $(".urlSubmitButton").attr("disabled", false);
        a = a.slice(1,-1);
        typeToSummary(a);
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


const recordFeedback = async (feedback, user) => {
    feedback = {feedback,
        user};
    $("#comment-submit").attr("disabled", true);
    const content = await fetch('/comments', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(feedback)
    }).then(() => {
        getComments();
    });

}


const getComments = async () => {
    const topComment = document.getElementById("top");
    topComment.innerHTML = "";
    const content = await fetch('/comments', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let returnContent = await content.json();
    let comments  = returnContent.body.results;

    console.log(comments[0].name);
    for(i = 0; i < comments.length; i++){

        const topComment = document.getElementById("top");
        const container = document.createElement("div");

        const newDiv = document.createElement("div");
        newDiv.classList.add("comment-block");

        const newHeader = document.createElement("h1");
        newHeader.innerHTML = comments[i].name;
        newHeader.classList.add("user");
        newDiv.appendChild(newHeader);

        const feedback = document.createElement("p");
        feedback.innerHTML= comments[i].top;
        feedback.classList.add("comment-text");
        newDiv.appendChild(feedback);

        container.appendChild(newDiv);
        
        const brk = document.createElement("BR");
        container.appendChild(brk);

        topComment.appendChild(container);
    }
}


const userId = ()  => {
    let uid = document.cookie;
    let uidarr = uid.split(';');
    try{
        let id = uidarr[0].slice(4);
        let intId = parseInt(id);
        if (isNaN(intId)){
            genUid();
        }else{
            console.log("User Exists");
        }
    }catch (err) {
        console.log("Something went wrong");
    }
}

const genUid = async () => {
    const content = await fetch('/database', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    let rsp = await content.json();

    let id = rsp.body.uid;

    document.cookie = `uid=${id};` + "expires=Thu, 18 Dec 2024 12:00:00 UTC";
}

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