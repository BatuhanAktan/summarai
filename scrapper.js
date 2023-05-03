

const axios = require('axios');
const cheerio = require('cheerio');
var sql = require('mysql');
// This is a function that scrapes relevant information given the correct url.



async function scrape(url) {
    const response = await axios.request({
        method: "GET",
        url: url,
        headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    });

    const $ = cheerio.load(response.data);
    var text = "";
    $("p").each(function(i, element){
        text+= " " + $(element).text();
    });
    console.log(text);
    /*
    const price = $("#apex_desktop").find(".a-offscreen:first").text();

    var title = $("#title").find("#productTitle").text();
    title = title.trim();
    
    var img = $('.a-declarative').find(".a-dynamic-image:first").attr("src");
    

    var category = $('#nav-progressive-subnav').find('#nav-subnav').attr("data-category");
    console.log(category);
    return [price, title, img, categor];
    */
}

 
console.log(scrape('https://education.nationalgeographic.org/resource/photosynthesis/'));


/*
  
  function addList (id) {
    var con = sql.createConnection({
      host: "us-cdbr-east-06.cleardb.net",
      user: "b4e2217654c222",
      password: "4a20cd77",
      database: "heroku_1382bb1b27d36f0"
    });
  
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


addList( v);

*/
