var sql = require('mysql');
const express = require("express");
const router = express.Router();


router.post("/", (request, response) => {
    console.log("comments");
    var con = sql.createConnection(conargs);
    try{

    const feedback = request.body.feedback;
    const user = request.body.user;
    console.log(user);

    con.query(`INSERT INTO topcomments(top, name) VALUES ("${feedback}", "${user}");`, function(err){
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
    con.query(`SELECT * from topcomments order by topid desc;`, function(err, results){
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
  