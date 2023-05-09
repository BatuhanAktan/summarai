const axios = require('axios');
const cheerio = require('cheerio');
const express = require("express");
const router = express.Router();



router.post('/', (request, response) => {
    url = request.body.url;
    console.log(url);
    //making a fetch request to get html.
    fetch(url)
    .then(response => response.text())
    .then(async html => {
    
    const rsp = await axios.request({
      method: "GET",
      url: url,
      headers: {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
      }
    });

    const $ = cheerio.load(rsp.data);

    //Getting all the p elements
    var text = "";
    $("p").each(function(i, element){
        text+= " " + $(element).text();
    });

    $('[class=paragraph]').each(function(i, element){
        text+= " " + $(element).text();
    });
    //summarize according to the extracted text
    let out = summarize({"inputs": text});

    const o = async () =>{
        let a = await out;
        await response.json({
            status: 'success',
            body: {a}
        });
    }

    //sending the response
    o();
  })
  .catch(error => console.error(error));

});

async function summarize(ask){
    //Making request to the ML model.
    try{
      let value = await fetch(
          "https://api-inference.huggingface.co/models/Alred/t5-small-finetuned-summarization-cnn-ver3",
      {
        headers: { Authorization: "Bearer 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" },
        method: "POST",
        body: JSON.stringify(ask),
          }
      ).then(response => response.json())
      .then((rsp)=> {
          try{
            var err = rsp[0].error.length;
            return rsp[0].error;
          }catch{
            console.log(rsp[0].summary_text);
            return rsp[0].summary_text;
          }
      });

      let out = await value;

      return out;
    }catch(error){
      console.log("Error", error);
    }
}


module.exports = router;