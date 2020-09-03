
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

function colorHeader(color,text="") {
    color = color.replace('#',"");
    return "$$\\color{" + color + "}{░▒▓███████" + text + "███████▓▒░}$$";
}


function convert(input) {
    result = input;
    if (result.attachments) {
        let new_blocks = result.blocks || [];

        (result.attachments || [] ).forEach(attachment => {
            if (attachment.color) {
                let block_status = colorHeader(attachment.color,"");
                switch(attachment.color) {
                    case "good":
                        block_status = colorHeader("#00FF00","✅Good") 
                        break;
                    case "warning":
                        block_status = colorHeader("#FFFF00","⚠ WARN") 
                        break;
                    case "danger":
                        block_status = colorHeader("#FF0000","❌ Bad") 
                        break;
                }
                new_blocks.push(newBlock(block_status))
            }
    
            if (attachment.pretext) {
                new_blocks.push(newBlock(attachment.pretext))
            }
    
    
            if (attachment.fields) {
                attachment.fields.forEach(element => {
                    if (stringIsAValidUrl(element.value || "")) {
                        new_blocks.push(newBlock(
                            element.title + ": " + element.value 
                        ))
                    }
                    else {
                        new_blocks.push(newBlock(
                            element.title + ": `" + element.value + "`"
                        ))
                    }
                });
            }
        });

        result["blocks"] = new_blocks;
    }

    delete result.attachments;
    return result;
}


module.exports = convert

