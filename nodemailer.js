const { html } = require("cheerio/lib/api/manipulation");
const nodemailer = require("nodemailer");
const SMTPTransport = require("nodemailer/lib/smtp-transport");

async function main(recipent,mail_data,new_price){
    let transport = nodemailer.createTransport(new SMTPTransport({
        service:"gmail",
        host:"smtp.google.com",
        auth:{
            user:"",
            pass:"",
        }
    }));


    let info = await transport.sendMail({
        from:"experimental.vilas@gmail.com",
        to:`${recipent}`,
        subject:"Price Alert",
        text:"The Price has been dropped hurry and add products to your cart",
        html:`<div><div>
        <img src="${mail_data.image}"/>
        </div>
        <h4>₹${new_price}</h4>
        <p>${mail_data.descr}</p>
        <p>Checked Time : ${mail_data.lastcheckedtime}</p>
        <a href="${mail_data.link}" target="_blank"><button style="background-color:skyblue;padding:20px;border:solid 2px grey">Buy</button></a>
        <p>This item will be removed from your tracking list</p>
        </div>`
    })

    console.log(info.messageId);
}

exports.main = main;
