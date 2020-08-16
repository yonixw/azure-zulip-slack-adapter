const express = require('express')
const converter = require("./lib")
const { json } = require('body-parser')
const fetch = require('node-fetch');


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
    console.log("In use...")
    return next();
})

app.post('*', (req, res)=>{
    console.log(req.url);
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
