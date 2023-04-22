const express = require("express");
const cors = require("cors");

const { convert } = require("html-to-text");

const port = process.env.PORT || 3000;


const app = express();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

app.post('/api', (request, response) => {
    url = request.body.url;

    fetch(url)
  .then(response => response.text())
  .then(async html => {
    // Create a new DOM parser to parse the HTML content
    // Extract the visible text content from the HTML content
    const options = {
        ignoreHref: true,
        ignoreImage: true,
        wordwrap: false,
        format: {
          tag: function(node, next) {
            if (node.name === 'p') {
              return node.children.map(next).join('');
            }
            return '';
          }
        }
      };

    const contentRegex = /<header[^>]*>.*?<\/header>|<footer[^>]*>.*?<\/footer>|([\s\S]*)/;
    var content = html.match(contentRegex)[1];
    
    var text = convert(content, options);
    
    text  = text.replace(/[^a-zA-Z0-9 ]/g, "");

    let out = summarize({"inputs": text});

    const o = async () =>{
        console.log("OUT");
        let a = await out;
        console.log("OUT", a);
        response.json({
            status: 'success',
            body: {a}
        });
    }

    o();
  })
  .catch(error => console.error(error));

});


async function summarize(ask){
    let value = await fetch(
        "https://api-inference.huggingface.co/models/Alred/t5-small-finetuned-summarization-cnn",
		{
			headers: { Authorization: "Bearer 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" },
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
    

}

async function segment (ask) {

    var ask = new String (ask);
    var lower = 0;
    if (ask.length < 3000){
        return await summarize(ask);
    }
    console.log(ask.length);
    var str = "";
    var len = ask.length;
    for (i = 2000; i < len; i+= 3000){
        var currentSlice;
        var aiResponse; 
        if (len-i < 3000){
            currentSlice = ask.slice(i, len);
            aiResponse = await summarize(currentSlice)
            str = str.concat(aiResponse);

        }else{
            currentSlice = ask.slice(lower, i);
            aiResponse = await summarize(currentSlice);
            str = str.concat(aiResponse);

        }

        lower=i;
    }


    return str;
}
app.listen(port, () => console.log('Bound to', port));