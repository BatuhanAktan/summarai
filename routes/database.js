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

router.get("/", (request, response) => {
    console.log("In DATABASE GET");
    var con = sql.createConnection(conargs);

    con.query(`SELECT max(id) as id FROM users`, function(err, results){
        let uid = results[0].id + 1;
        insertId(uid);
        const o = async () => {
            await response.json({
                status: 'success',
                body: {uid}
            });
        }
        o();

    });

    con.end();
});


const insertId = (uid) => {
    var con = sql.createConnection(conargs);

    con.query(`INSERT INTO users(id) VALUES (${uid})`, function(err){
        console.log("Inserted");
    });

    con.end();
}


module.exports = router;
  