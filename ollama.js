const fs = require('fs');
const csv = require('csv-parser');
const http = require('http');
const url = require('url');
const { hostname } = require('os');

function makeRequest(message) {
    return new Promise((resolve, reject) => {
        
        const requestBody = JSON.stringify({
            model: "llama3.2",
            prompt: message,
            stream: false
        });

        const options = {
            hostname: 'localhost',
            port: 11434,
            path: '/api/generate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData);
                } catch (error) {
                    console.error('Error parsing response:', error);
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.error('Request error:', error);
            reject(error);
        });

        req.write(requestBody);
        req.end();
    });
}

function parseMessage(message) {
    return `
Instruction: Analyze the sentiment of the following text and classify it as positive, negative, or neutral. Indicate the confidence level as high, medium, or low. Your response should include exactly four words, showing only the requested data without explanation.
Use your own assumpions and knowledge to determine the sentiment of the text. If you are unsure about the sentiment, please indicate it as neutral. If you are unsure about the confidence level, please indicate it as medium. If you are unsure about the presence of offenses or discrimination, please indicate it as no. If you are unsure about the presence of discrimination, please indicate it as no.

Text: ${message}

Expected Output:
    Sentiment: (positive, negative, or neutral)
    Confidence Level: (high, medium, low)
    Presence of Offenses: (yes/no)
    Presence of Discrimination: (yes/no)


Exemplary Response:
    Sentiment: positive
    Confidence Level: high
    Presence of Offenses: no
    Presence of Discrimination: no

    `
}


async function main() {
    try {
        const inputFile = 'output.json';
        const messages = JSON.parse(fs.readFileSync(inputFile));
        const arrayOfResponses = [];
        for( let i = 0; i < 100; i++) {
            try {
                const formatedMessage = parseMessage(messages.sentences[i].text);
                const response = await makeRequest(formatedMessage);

                arrayOfResponses.push(response.response);

                console.log(`------------------------------------`);
                console.log(`Message ${i + 1}: \n${response.response}`);
                console.log(`------------------------------------`);
                console.log(`Done processing message ${i + 1} of ${100}`);
                console.log(`------------------------------------`);
            }catch (error) {
                console.log("!------------------------------------!");
                console.error('Error processing message:', messages[i]);
                if(response) {
                    console.error('Response:', response);
                }
                console.log("!------------------------------------!");
            };
        }
        console.log(arrayOfResponses.length);
        fs.writeFileSync('responses.json', JSON.stringify(arrayOfResponses, null, 2));

        
    } catch (error) {
        console.error('\nError in main:', error);
    }
}

main();