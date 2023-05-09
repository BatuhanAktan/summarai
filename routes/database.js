var sql = require('mysql');
const express = require("express");
const router = express.Router();
const conargs = {

};


router.post("/", (request, response) => {
    console.log("DATABASE");
    var con = sql.createConnection(conargs);
    try{

    const rating = parseInt(request.body.rating);
    const rsp = request.body.response;
    const url = request.body.url;

    con.query(`INSERT INTO modeldata(url, response, rating) VALUES ("${url}", "${rsp}", ${rating});`, function(err){
        if (err) throw err;
    });
    
    } catch (err) {
        console.log(err);
    }

    con.end();
});

module.exports = router;
  