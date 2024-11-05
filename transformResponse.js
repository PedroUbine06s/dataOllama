const fs = require('fs');

function parseJson(data) {
    const arrayOfObjects = [];
    for (let i = 0; i < data.length; i++) {
        const element = data[i];
        const obj = {
            sentiment: null,
            confidenceLevel: null,
            presenceOfOffenses: null,
            presenceOfDiscrimination: null,
            text: null
        }
        if(!element.includes('Sentiment')) {
            arrayOfObjects.push(obj);
            continue;
        }
        
        const lines = element.split('\n');

        const sentiment = lines[0].split(': ')[1].toLowerCase();
        const confidence = lines[1].split(': ')[1].toLowerCase();
        const offenses = lines[2].split(': ')[1].toLowerCase();
        const discrimination = lines[3].split(': ')[1].toLowerCase();

        obj.sentiment = sentiment;
        obj.confidenceLevel = confidence;
        obj.presenceOfOffenses = offenses;
        obj.presenceOfDiscrimination = discrimination;

        arrayOfObjects.push(obj);
    }

    return arrayOfObjects;
}

const data = fs.readFileSync('responses.json');
const rawData = JSON.parse(data);
const parsedData = parseJson(rawData);


const dataWithText = fs.readFileSync('output.json');
const rawDataWithText = JSON.parse(dataWithText);
const parsedDataWithText = rawDataWithText.sentences;

for (let i = 0; i < 100; i++) {
    parsedData[i].text = parsedDataWithText[i]?.text ?? null;
}
console.log(parsedData);