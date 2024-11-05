const fs = require('fs');
const csv = require('csv-parser');
const http = require('http');
const url = require('url');
const { hostname } = require('os');

function makeRequest(message) {
    return new Promise((resolve, reject) => {
        
        const requestBody = JSON.stringify({
            model: "phi3:medium",
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

function parseMessage(message, promptId) {

    switch (promptId) {
        case 1:
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
        case 2: 
        return `
        Here's the rephrased version, keeping those specific terms:
        Instruction: Review the text below and provide a strict four-line assessment using only these criteria:

        Text: ${message}

        Format your response as:
        Sentiment: [positive/negative/neutral]
        Confidence Level: [high/medium/low]
        Presence of Offenses: [yes/no]
        Presence of Discrimination: [yes/no]
        Guidelines:

        Default to neutral if sentiment is unclear
        Default to medium if confidence level is unclear
        Default to no if uncertain about offenses or discrimination
        Use only the specified terms
        Provide labels without explanation

        Example Response:
        Sentiment: positive
        Confidence Level: high
        Presence of Offenses: no
        Presence of Discrimination: no`
    }
 

   
}


async function main() {
    try {
        const inputFile = 'output.json';
        const messages = JSON.parse(fs.readFileSync(inputFile));
        const arrayOfResponses = [];
        for( let i = 0; i < 100; i++) {
            try {
                const formattedMessage = parseMessage(messages.sentences[i].text, 1);
                const response = await makeRequest(formattedMessage);
                const formattedResponse = `Text: ${messages.sentences[i].text}\n ${response.response}`

                arrayOfResponses.push(formattedResponse);

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
        fs.writeFileSync('p1_phiM.json', JSON.stringify(arrayOfResponses, null, 2));

        
    } catch (error) {
        console.error('\nError in main:', error);
    }
}

main();