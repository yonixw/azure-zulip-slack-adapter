const express = require('express')
const { json } = require('body-parser')
const fetch = require('node-fetch');
const fs = require('fs');

const azure_converter = require("./converters/azure")
const json_converter = require("./converters/json")

const app = express()

const port = 3000
const domain = process.env.DOMAIN || "localhost"
console.log("Domain: '" + domain +  "'");

app.use(express.json({limit: '5mb'}));
app.use(express.urlencoded({limit: '5mb'}));

app.use((req, res, next) => {
    res.set("Access-Control-Allow-Origin", "*"); // restrict it to the required domain
    res.set("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-type,Accept");
    console.log("[" + (new Date()).toISOString() +  "] " + req.url )
    return next();
})

function handleConvert(req,res, converter, new_url, converter_opt) {
  console.log("Redirect to Sending to '" + new_url + "'");

  fs.writeFileSync("temp.json", JSON.stringify(req.body));
  let result = converter(req.body,converter_opt);

  fetch(new_url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(result)
  })
    .then(r => r.text())
    .then(text => res.send(text))
    .catch(e => res.send(e));
}

app.post('/', (req, res) => {
  res.send("OK-POST");
});

app.GET('/', (req, res) => {
  res.send("OK-GET");
});



app.get('*/temp.txt',(req,res)=>{
  let result = fs.readFileSync('temp.json',{encoding: "utf8"}).toString();
  res.set("content-type","text/plain")
  res.send(result);
})


app.post('/json/*', (req, res)=>{
  const new_url = domain + req.url.replace("json/", "");
  const converter_opt = {"filter": req.query.filter || ""};
  
  handleConvert(req,res, json_converter, new_url ,converter_opt);
})

app.post('/azure/*', (req, res)=>{
    const new_url = domain + req.url.replace("azure/", "");

    handleConvert(req,res, azure_converter, new_url);
})




app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


