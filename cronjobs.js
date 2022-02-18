const scrape = require("./getprice")
const mail = require("./nodemailer");
function  mainJob(db){
    var all_links = []
    var query = "select * from products"
    
    db.query(query,(err,response)=>{
        if(err){
            console.log(`error ${err}`)
        }else{
            all_links = response
            checkPrice(all_links,db)
        }
    })
    
}



async function checkPrice(links,db) {
    links.forEach(async element => {
        try{
            var item = await scrape.configureBrowser(element.link,element.vendor);
            var clock = new Date()
            var time = clock.toUTCString()
            var email = ""
        
        if(item.price < element.price){
            db.query(`select email from users where userid="${element.userid}"`,(err,response)=>{
                if(err){
                    console.log(err)
                }else{
                    email = response[0].email
                    element["lastcheckedtime"] = time
                    db.query(`delete from products where userid="${element.userid}" and link="${element.link}"`,(err,response)=>{
                        if(err){
                            console.log(err)
                        }else{
                            mail.main(email,element,item.price)
                        }
                    })
                }
            })
        }else{
            db.query(`update products set lastprice="${item.price}",lastcheckedtime="${time}" where userid="${element.userid}" and link="${element.link}"`,(err,response)=>{
            if(err){
                console.log(err)
            }
        })
        }
        }catch(err){
            console.log(err)
        }
        
        console.log("at cron")
    });
}

module.exports = mainJob