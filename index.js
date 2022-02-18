const express = require('express')
const mysql = require('mysql2')
var scrape = require('./getprice');
const CronJob = require('cron').CronJob;
const cors = require('cors');
const app = express();
const cronjobs = require("./cronjobs");
const path = require("path")


app.use(cors())
app.use(express.urlencoded({
    extended:true
}));
app.use(express.json())

let port = process.env.PORT||3333;

// const db = mysql.createConnection({
//     host:"127.0.0.1",
//     port:3306,
//     user:"root",
//     password:"vvilas122",
//     database:'world'
// })





let job = new CronJob("* 10 * * * *",function(){cronjobs(db)},null,true,null,null,true);
job.start();

app.get("*",(req,res)=>{
    res.send("Nothing here")
})

app.post("/",(req,res)=>{
    let q = `SELECT userid FROM users where userid="${req.body.user}"`
    
    db.query(q,(error,response)=>{
        if(error){
            console.log(error);
        }else{
            if (response.length>0){
                let query = `select * from products where userid="${req.body.user}"`
                db.query(query,(err,response)=>{
                    if(err){
                        
                        res.send({"res":"failure"})
                    }else{
                        
                        res.send({"res":response})
                    }
                    
                })
            }else{
                
                res.send({"res":"failure"})
            }

        }
    })
    
})



app.post("/vilas",async(req,res)=>{
    
    try{
        var data = await scrape.configureBrowser(req.body.ur,req.body.sit);

    }catch(err){
        res.send({"res":"Invalid Url"});
    }
    await res.send(JSON.stringify(data)); 
})


app.post("/delete",(req,res)=>{
    let query = `delete from products where userid="${req.body.user}" and link="${req.body.link}"`
    
    db.query(query,(err,response)=>{
        if(err){
            res.send({"res":"failed"})
        }else{
            res.send({"res":"success"})
        }
    })
})

app.post("/add",(req,res)=>{
    let user = req.body.user;
    let query = `select userid from users where userid="${user}"`
    
    db.query(query,(err,response)=>{
        if(err){
            console.log(err)
        }
        if(response.length>0){
            let vendor = req.body.product.vendor;
            let price = req.body.product.price;
            let desc = req.body.product.descr;
            let image = req.body.product.image;
            let url = req.body.product.url;
            let clock = new Date()
            let time = clock.toLocaleDateString() + " " + clock.toLocaleTimeString()
            query = `insert products values("${user}","${url}","${image}","${price}","${desc}","${vendor}","${price}","${time}")`        
            db.query(`select userid from products where userid="${user}" and link="${url}"`,(err,resp)=>{
                if(err){
                    res.send({"res":"failed"})
                }
                else if(resp.length>0){
                    res.send({"res":"link exsist"})
                }else{
                    db.query(query,(error,response)=>{
                        if(error){
                            console.log(error)
                            res.send({"res":"failed"})
                        }else{
                            res.send({"res":"success"});
                        }
                        })
                }
            })
            
            
        }
    })
    
    
    
})

app.post("/login",(req,res)=>{
    let query = `Select userid from users where userid="${req.body.user}" and password="${req.body.password}"`
    
    db.query(query,(err,response)=>{
        if(err){
            console.log(err)
            
            res.send("Error Occured")
        }else{
            if(response.length===0){
                const tosend = {res:""}
                
                res.send(tosend)
            }else{
                const tosend = JSON.stringify({"res":response[0]})
                
                res.send(tosend);
            }
        }
    })
})


app.post("/signup",(req,res)=>{
    let query = `insert users values("${req.body.user}","${req.body.password}","${req.body.email}")`;
    
    db.query(query,(error,response)=>{
        
        if(error){
            console.log(error)
            res.send({"res":"failed"});
        }else{
            
            res.send({"res":"success"});
        }
    })
})

app.post("/mailcheck",(req,res)=>{
    var mail = req.body.email;
    let query = `select userid from users where email="${mail}"`
    
    db.query(query,(err,response)=>{
        if(err){
            console.log(err)
            res.send({"res":"error"})
        }else{
            if(response.length<=0){
                res.send({"res":"false"})
            }else{
                res.send({"res":"true"})
            }
        }
    })
})

app.post("/usercheck",(req,res)=>{
    var user = req.body.user;
    let query = `select userid from users where userid="${user}"`
    
    db.query(query,(err,response)=>{
        if(err){
            console.log(err)
            res.send({"res":"error"})
        }else{
            if(response.length<=0){
                res.send({"res":"false"})
            }else{
                res.send({"res":"true"})
            }
        }
    })
})


app.listen(port,(err) => {
    if(err){
        console.log(err)
    }else{
        console.log(`Server started runing at port ${port}`)
    }
})