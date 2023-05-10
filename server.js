const express = require("express");
const cors = require("cors");
const summarize = require("./routes/summarize.js");
const database = require("./routes/database.js");
const comments = require("./routes/comments.js");


//Checking if there is an assigned port if not uses 3000


const app = express();

//Requirements for express
app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use("/database", database);
app.use("/summarize", summarize);
app.use("/comments", comments);

const port = process.env.PORT || 3001;
//Starting the App.
app.listen(port, () => console.log('Bound to', port));