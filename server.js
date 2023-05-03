const express = require("express");
const cors = require("cors");
const axios = require('axios');
const cheerio = require('cheerio');
const { throwError } = require("rxjs");
var sql = require('mysql');

//Checking if there is an assigned port if not uses 3000
const port = process.env.PORT || 3001;


const app = express();
const conargs = {

};
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

    //logging
    console.log(text);

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


app.post("/prio", (request, response) => {
    url = request.body.url;

    let o = async () => {
      try{
      let content = await scrape(url)
        .then (async (rsp) => {
          let price = rsp[0];
          let title = rsp[1];
          let img = rsp[2];
          let category = rsp[3]
          if(price.length == 0 || title.length == 0 || img.length == 0){
            throw new Error("Not a supported link");
          }
          await response.json({
            status: 1,
            price: {price},
            title: {title},
            img: {img},
            category: {category}
          });
      });
      }catch(error){
        console.log("error", error);
        await response.json({
          status: 0,
          reason: "Cannot Use that Link"
        });
      }
    }
    o();
    console.log("response sent");
});

app.post("/database", (request, response) => {
  requestType=request.body.type;
  try{
    let req = parseInt(requestType);
    if (req == 1){
        try{
          getID(function(final){
            response.json({
            status: 'success',
            id: {final}
            });
          });
        }catch(error){
          console.log(error);
        }
    }else if (req == 2) {
      
    }else{}
  }catch(error){
    console.log(error);
  }
});

//Adding database interface for PrioList
function getID () {
  var con = sql.createConnection(conargs);
  
  con.connect(function(err) {
    if (err) throw err;
    con.query("SELECT max(id) as id FROM userdata", function(err, result){
      if (err) throw err;
      console.log("result", result[0].id);
      let userId = result[0].id + 1;
      console.log(userId);
      final(userId);
      con.query(`INSERT INTO userdata(id) VALUES (?)`,[userId], function(err){
        if (err) throw err;
        console.log("added");
      });
    });
  });
}

//Adding Functionality for PrioList
function addList (id) {
  var con = sql.createConnection(conargs);

  con.connect(function(err) {
    if (err) throw err;
    con.query(`Select items from userdata where iduserData=${id}`, function(err,result){
      if (err) throw err;

      let list  = JSON.parse(result.items);

      if(list.length < 1){
         list.push([{itemCat},[{item}, {itemPrice}, {itemPicURl}, {itemId}]]);
      }
      for (var i = 0; i < list.length; i++){
        if (list[i][0] >= itemCat){
          list.splice(i-1, 0, [{item},{itemPrice}, {itemPicURl}, {itemId}]);
          break;
        }
      }
      list = JSON.stringify(list);

      con.query(`insert into userdata(items) values ${list} where iduserData=${id}`, function(err){
        if (err) throw err;
        console.log("added");
      });
    });
  })
}

//Prio List Scrape functionality.
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
  
  var category = $('#nav-progressive-subnav').find('#nav-subnav').attr("data-category");

  return [price, title, img, category];

  }catch(error){
    console.log(error);
    return null;
  }

}

async function summarize(ask){
    //Making request to the ML model.
    try{
      let value = await fetch(
          "https://api-inference.huggingface.co/models/Alred/t5-small-finetuned-summarization-cnn-ver3",
      {
        headers: { Authorization: "" },
        method: "POST",
        body: JSON.stringify(ask),
          }
      ).then(response => response.json())
      .then((rsp)=> {
          console.log(JSON.stringify(rsp));
          try{
            var err = rsp[0].error.length;
            console.log("err", err);
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

//Starting the App.
app.listen(port, () => console.log('Bound to', port));