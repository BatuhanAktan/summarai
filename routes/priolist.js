function getID () {
    var con = sql.createConnection(conargs);
    
    con.connect(function(err) {
      if (err) throw err;
      con.query("SELECT max(id) as id FROM userdata", function(err, result){
        if (err) throw err;
        console.log("result", result[0].id);
        let userId = result[0].id + 1;
        console.log(userId);
        final(userId);
        con.query(`INSERT INTO userdata(id) VALUES (?)`,[userId], function(err){
          if (err) throw err;
          console.log("added");
        });
      });
    });
  }
  
  //Adding Functionality for PrioList
  function addList (id) {
    var con = sql.createConnection(conargs);
  
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


//Prio List Scrape functionality.
async function scrape(url) {
    try{
    const response = await axios.request({
        method: "GET",
        url: url,
        headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36"
        }
    });
  
    const $ = cheerio.load(response.data);
  
    const price = $("#apex_desktop").find(".a-offscreen:first").text();
  
    var title = $("#title").find("#productTitle").text();
    title = title.trim();
    
    var img = $('.a-declarative').find(".a-dynamic-image:first").attr("src");
    
    var category = $('#nav-progressive-subnav').find('#nav-subnav').attr("data-category");
  
    return [price, title, img, category];
  
    }catch(error){
      console.log(error);
      return null;
    }
  
  }

app.post("/prio", (request, response) => {
    url = request.body.url;

    let o = async () => {
      try{
      let content = await scrape(url)
        .then (async (rsp) => {
          let price = rsp[0];
          let title = rsp[1];
          let img = rsp[2];
          let category = rsp[3]
          if(price.length == 0 || title.length == 0 || img.length == 0){
            throw new Error("Not a supported link");
          }
          await response.json({
            status: 1,
            price: {price},
            title: {title},
            img: {img},
            category: {category}
          });
      });
      }catch(error){
        console.log("error", error);
        await response.json({
          status: 0,
          reason: "Cannot Use that Link"
        });
      }
    }
    o();
    console.log("response sent");
});