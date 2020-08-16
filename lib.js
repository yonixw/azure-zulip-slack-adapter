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

function convert(input) {
    result = input;
    if (result.attachments) {
        let new_blocks = result.blocks || [];

        result.attachments.forEach(attachment => {
            if (attachment.color) {
                let block_status = "(Color `"+ attachment.color + "`)";
                switch(attachment.color) {
                    case "good":
                        block_status = "✅ Good ✅"
                        break;
                    case "warning":
                        block_status = "⚠ Warning ⚠"
                        break;
                    case "danger":
                        block_status = "❌ Bad ❌"
                        break;
                }
                new_blocks.push(newBlock(block_status))
            }
    
            if (attachment.pretext) {
                new_blocks.push(newBlock(attachment.pretext))
            }
    
    
            if (attachment.fields) {
                attachment.fields.forEach(element => {
                    new_blocks.push(newBlock(
                        element.title + ": `" + element.value + "`"
                    ))
                });
            }
        });

        result["blocks"] = new_blocks;
    }

    delete result.attachments;
    return result;
}


module.exports = convert