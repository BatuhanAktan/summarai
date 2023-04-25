const express = require("express");
const cors = require("cors");
const axios = require('axios');
//const cheerio = require('cheerio');
const { convert } = require("html-to-text");
const cheerio = require('cheerio');

//Checking if there is an assigned port if not uses 3000
const port = process.env.PORT || 3001;


const app = express();

//Requirements for express
app.use(cors());
app.use(express.static('public'));
app.use(express.json());

//Listening to Post requests in /api
app.post('/api', (request, response) => {
    url = request.body.url;

    //making a fetch request to get html.
    fetch(url)
    .then(response => response.text())
    .then(async html => {

    //formatting options for the HTML-to-Text library
     /*
    const options = {
        ignoreHref: true,
        ignoreImage: true,
        wordwrap: false,
        format: {
          tag: function(node, next) {
            if (node.name == 'p') {
              return node.children.map(next).join(' ');
            }else if(node.name == 'span'){
              return node.children.map(next).join(' ');
            }else{
              return '';
            }
          }
        },
        skip: ["a", "ul"]
      };
    //Getting rid of the header and the footer
    const contentRegex = /<header[^>]*>.*?<\/header>|<footer[^>]*>.*?<\/footer>|([\s\S]*)/;
    var content = html.match(contentRegex)[1];

    //Formatting the text using the H2T library
    var text = convert(content, options);
    

    //getting rid of all the characters to not confuse AI model
    text  = text.replace(/[^a-zA-Z0-9 ]/g, "");
    */
    
    const response = await axios.request({
      method: "GET",
      url: url,
      headers: {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
      }
    });

    const $ = cheerio.load(response.data);

    const text = $.extract({
      content: ['p'],
    });

    console.log("TEXT", text);

    //summarize according to the extracted text
    let out = summarize({"inputs": text});

    const o = async () =>{
        let a = await out;
        response.json({
            status: 'success',
            body: {a}
        });
    }

    //sending the response
    o();
  })
  .catch(error => console.error(error));

});


app.post("/prio", (request, response) => {
    url = request.body.url;

    let o = async () => {
    let content = await scrape(url)
        .then (async (rsp) => {
          if (rsp === null){
            await response.json({
              status: 0
            });
          }else{
            let price = rsp[0];
            let title = rsp[1];
            let img = rsp[2];
            await response.json({
              status: 1,
              price: {price},
              title: {title},
              img: {img}
            });
          }
      });
    }

    o();
    console.log("response sent");
});


async function summarize(ask){
    //Making request to the ML model.
    try{
      let value = await fetch(
          "https://api-inference.huggingface.co/models/Alred/t5-small-finetuned-summarization-cnn",
      {
        headers: { Authorization: "" },
        method: "POST",
        body: JSON.stringify(ask),
          }
      ).then(response => response.json())
      .then((rsp)=> {
          console.log(JSON.stringify(rsp));
          return rsp[0].summary_text;
      });

      let out = await value;

      return out;
    }catch(error){
      console.log("Error", error);
    }
}

async function scrape(url) {
  try{
  const response = await axios.request({
      method: "GET",
      url: url,
      headers: {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
      }
  });

  const $ = cheerio.load(response.data);

  const price = $("#apex_desktop").find(".a-offscreen:first").text();

  var title = $("#title").find("#productTitle").text();
  title = title.trim();
  
  var img = $('.a-declarative').find(".a-dynamic-image:first").attr("src");
  

  return [price, title, img];

  }catch(error){
    console.log(error);
    return null;
  }

}

//Starting the App.
app.listen(port, () => console.log('Bound to', port));