var sql = require('mysql');
const express = require("express");
const router = express.Router();
const conargs = {
    host: "us-cdbr-east-06.cleardb.net",
    user: "b4e2217654c222",
    password: "4a20cd77",
    database: "heroku_1382bb1b27d36f0"
};

router.post("/", (request, response) => {
    console.log("comments");
    var con = sql.createConnection(conargs);
    try{

    const feedback = request.body.feedback;


    con.query(`INSERT INTO topcomments(top) VALUES ("${feedback}");`, function(err){
        if (err) throw err;
    });
    
    } catch (err) {
        console.log(err);
    }

    con.end();
});

router.get("/", (request, response) =>{
    console.log("comments get");
    var con = sql.createConnection(conargs);
    con.query(`SELECT * FROM topcomments;`, function(err, results){
        if (err) throw err;
            const o = async () => {
                await response.json({
                    status: 'success',
                    body: {results}
                });
            }
            o();
    });

    con.end();


});

module.exports = router;
  