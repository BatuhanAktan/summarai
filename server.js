const express = require("express");
const cors = require("cors");
const { convert } = require("html-to-text");

//Checking if there is an assigned port if not uses 3000
const port = process.env.PORT || 3000;


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

    //Getting rid of the header and the footer
    const contentRegex = /<header[^>]*>.*?<\/header>|<footer[^>]*>.*?<\/footer>|([\s\S]*)/;
    var content = html.match(contentRegex)[1];
    
    //Formatting the text using the H2T library
    var text = convert(content, options);
    
    //getting rid of all the characters to not confuse AI model
    text  = text.replace(/[^a-zA-Z0-9 ]/g, "");

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


async function summarize(ask){
    //Making request to the ML model.
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

//Starting the App.
app.listen(port, () => console.log('Bound to', port));