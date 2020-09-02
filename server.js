const express = require('express')
const converter = require("./lib")
const { json } = require('body-parser')
const fetch = require('node-fetch');
const fs = require('fs');


const app = express()

const port = 3000
const domain = process.env.DOMAIN || "localhost"
const code = process.env.CODE || "process"
console.log("Domain: '" + domain +  "', Code: '" + code +  "'");

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb'}));

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-type,Accept");
    console.log("[" + (new Date()).toISOString() +  "] " + req.url )
    return next();
})

app.get('/temp',(req,res)=>{
  let result = fs.readFileSync('temp.json',{encoding: "utf8"}).toString();
  res.set("content-type","text/plain")
  console.log(result);
  res.send(result);
})

app.post('*', (req, res)=>{
    console.log(req.url);
    fs.writeFileSync("temp.json", JSON.stringify(req.body))
    let result = converter(req.body);

    fetch(domain + req.url.replace("/" + code , ""), {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify(result)
    })
        .then(r => r.text())
        .then(text => res.send(text))
        .catch(e=> res.send(e))
})



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
