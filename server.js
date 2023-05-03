const express = require("express");
const cors = require("cors");
var sql = require('mysql');
const summarize = require("./routes/summarize.js");


//Checking if there is an assigned port if not uses 3000
const port = process.env.PORT || 3001;


const app = express();

//Requirements for express
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use("/summarize", summarize);
app.use("/database", summarize);
//Listening to Post requests in /api


//Starting the App.
app.listen(port, () => console.log('Bound to', port));