function colorHeader(color,text="") {
    color = color.replace('#',"");
    return "$$\\color{" + color + "}{░▒▓███████" + text + "███████▓▒░}$$";
}

const URL = require("url").URL;

const stringIsAValidUrl = (s) => {
    https://stackoverflow.com/a/55585593/1997873
    try {
        new URL(s);
        return true;
    } catch (err) {
        return false;
    }
};

function flat(data) {
    var result = {};
    function recurse (cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
             for(var i=0, l=cur.length; i<l; i++)
                 recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop+"."+p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
}

function newBlock(text) {
    return {
        "type":"section",
        "text":
            {
                "type":"mrkdwn",
                "text": text
            }
    }
}

function convert(input, filter = "") {
    const result = {"blocks":[]}
    result.blocks.push(newBlock(colorHeader("#00AA00")));


    const flattenJson = flat(input);
    let keys = Object.keys(flattenJson)
        .filter(k=>flattenJson.hasOwnProperty(k))
        .sort();
    console.log("Keys: \n" + JSON.stringify(keys.map((e,i)=>[e,i]),null,4))

    try {
        let keyFilter = JSON.parse('[' + filter + ']');
        keys = keyFilter.map((i)=>keys[i]);
    }
    catch (e) {
        console.log ("Error getting filter for json from :'" + filter + "'");
    }

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (stringIsAValidUrl(flattenJson[key])) {
            result.blocks.push(newBlock(key+": "+flattenJson[key]))
        }
        else {
            result.blocks.push(newBlock(key+": `"+flattenJson[key] + "`"))
        }
    }

    return result;
}

module.exports = convert;