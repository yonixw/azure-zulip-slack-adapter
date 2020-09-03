const fs = require('fs');
const fetch = require('node-fetch');

const url = fs.readFileSync("test_url.txt",{encoding: "utf-8"});

const azure_converter = require("./converters/azure")
const json_converter = require("./converters/json")

const azure_input = JSON.parse(fs.readFileSync('./test-cases/azure_devops.json'))
const bitrise_input = JSON.parse(fs.readFileSync('./test-cases/bitrise_slack_step.json'))
const appcenter_input = JSON.parse(fs.readFileSync('./test-cases/appcenter_new_release.json'))

const test_pairs = [
  [azure_converter, azure_input,null],
  [azure_converter, bitrise_input,null],
  [json_converter, appcenter_input, "0,3,7,10,11,15,17,18,19,20"]
]

async function fetchAll() {
  for (let i = 0; i < test_pairs.length; i++) {
    const e = test_pairs[i];
    console.log("========= Sending input #" + i);

    const result = JSON.stringify(e[0](e[1],e[2]),null,4);
    console.log(result);

    await fetch(url, {method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: result
    })
  }
}

fetchAll().then(()=>console.log("[DONE]"))



