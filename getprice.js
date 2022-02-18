const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function configureBrowser(url,site){
    const browser = await puppeteer.launch({
        
        args: ["--no-sandbox",
		"--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0);
    switch(site){
        case "Amazon":
            return checkPrice_AMZ(page,url,browser,site);
        case "Flipkart":
            return checkPrice_FLP(page,url,browser,site);
        case "Myntra":
            return checkPrice_MYNTRA(page,url,browser,site);
        case "Snapdeal":
            return checkPrice_SD(page,url,browser,site)
        default:
            return null,null
    }
    
}

async function checkPrice_AMZ(page,url,browser,site){
    const sites = await page.goto(url);
    let html = await page.evaluate(()=>document.body.innerHTML)
    const $ = await cheerio.load(html);

    let price = await $('.apexPriceToPay .a-offscreen').text();
    let desc = await $('.a-size-large.product-title-word-break').text()
    let currprice = await price.replace(/[^0-9.-]+/g,"");
    let image = await $('#imgTagWrapperId img').attr('src');
    if(currprice===""){
        price = await $(".priceToPay .a-offscreen").text();
        currprice = await price.replace(/[^0-9.-]+/g,"");
    }
    await browser.close();
    const data =  {"price":currprice,"image":image,"descr":desc,'vendor':site}
    return data
}

async function checkPrice_FLP(page,url,browser,site){
    const sites = await page.goto(url);
    let html = await page.evaluate(()=>document.body.innerHTML);
    const $ = await cheerio.load(html);
    let price = await $('div ._30jeq3._16Jk6d').text();
    let image = await $('._396cs4._2amPTt._3qGmMb._3exPp9').attr('src');
    
    
    let desc = await $('span.B_NuCI').text()
    let currprice = await price.replace(/[^0-9.-]+/g,"");
    if(image===undefined){
        image = await $("img._2r_T1I._396QI4").attr('src')
        
    }
    await browser.close();
    const data = {'price':currprice,'image':image,"descr":desc,"vendor":site}
    return data
}


// async function checkPrice_MYNTRA(page,url,browser){
//     const site = await page.goto(url);
//     let html = await page.evaluate(()=>document.body.innerHTML);
//     const $ =await cheerio.load(html);
//     let price = await $('.pdp-price]').text();
//     let currprice = await price.replace(/[^0-9.-]+/g,"");
//     const data = {'price':price,'image':price}
//     return data
// }


// async function checkPrice_MYNTRA(page,url,browser){
//     const {data} = await axios.get(url);
//     const $ = cheerio.load(data);
//     let price = await $('span.pdp-price string').text()
//     let rawimage = await $('.image-grid-image').attr('style');
    
//     const res = {'price':price,'image':123}
//     return res
// }

async function checkPrice_SD(page,url,browser,site){
    const sites = await page.goto(url);
    let html = await page.evaluate(()=>document.body.innerHTML);
    const $ = await cheerio.load(html);
    let price = await $('span .payBlkBig').text();
    const image = await $('.cloudzoom').attr('src');
    let currprice = await price.replace(/[^0-9.-]+/g,"");
    let desc = await $("h1.pdp-e-i-head").text();
    await browser.close();
    const res = {'price':currprice,"image":image,"descr":desc,"vendor":site}
    return res;
}

// async function checkPrice_SD(page,url,browser){
//     const {data} = await axios.get(url);
//     const $ = cheerio.load(data)
//     let price = await $('span .payBlkBig').text();
//     const image = await $('.cloudzoom').attr('src');
//     let currprice = await price.replace(/[^0-9.-]+/g,"");
//     let desc = await $("h1.pdp-e-i-head").text();
//     await browser.close();
//     const res = {'price':currprice,"image":image,"desc":desc}
//     return res;
// }

exports.configureBrowser = configureBrowser;