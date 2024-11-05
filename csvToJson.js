const fs = require('fs');
const { parse } = require('csv-parse/sync');

function csvToJson(csvData) {
    const records = parse(csvData, {
        columns: false,
        skip_empty_lines: true,
        relax_quotes: true,
        trim: true
    });

    const result = {
        sentences: []
    };

    for (let i = 0; i < records.length; i++) {
        const row = records[i];
        
        const sentence = {
            id: row[0],
            split: row[1],
            valence: parseFloat(row[2]),
            arousal: parseFloat(row[3]),
            dominance: parseFloat(row[4]),
            text: row[5]
        };

        result.sentences.push(sentence);
    }

    return result;
}

try {
    const csvData = fs.readFileSync('emobank.csv', 'utf-8');
    const jsonResult = csvToJson(csvData);
    fs.writeFileSync('output.json', JSON.stringify(jsonResult, null, 2));
    console.log('Conversion completed successfully!');
} catch (error) {
    console.error('Error:', error.message);
}