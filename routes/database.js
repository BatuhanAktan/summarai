var sql = require('mysql');
const express = require("express");
const router = express.Router();
const conargs = {

};


router.post("/rating", (request, response) => {
    console.log("DATABASE");
    var con = sql.createConnection(conargs);

    var url = request.rating;
    console.log("URL", url);
    con.connect(function(err){
        if (err) throw err;
        
        con.query(`INSERT INTO modeldata(url, response, rating) VALUES (${url}, ${response}, ${rating});`)
    });
});

module.exports = router;
  