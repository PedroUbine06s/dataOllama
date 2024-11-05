const fs = require('fs');

function cleanText(text) {
    return text.replace(/\s+/g, ' ').trim();
}

function extractField(text, fieldName) {
    const regex = new RegExp(`${fieldName}:\\s*([^\\n]+)`, 'i');
    const match = text.match(regex);
    return match ? cleanText(match[1]) : '';
}

function convertToCSV(jsonData) {

    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
    

    const headers = ['Text', 'Sentiment', 'Confidence Level', 'Presence of Offenses', 'Presence of Discrimination'];
    

    const rows = data.map(item => {
     
        const text = item.split('\n')[0].replace('Text: ', '').trim();
        

        const sentiment = extractField(item, 'Sentiment');
        const confidence = extractField(item, 'Confidence Level');
        const offenses = extractField(item, 'Presence of Offenses');
        const discrimination = extractField(item, 'Presence of Discrimination');
        
   
        return [
            `"${text.replace(/"/g, '""')}"`, 
            sentiment.toLowerCase(),
            confidence.toLowerCase(),
            offenses.toLowerCase(),
            discrimination.toLowerCase()
        ];
    });
    
    const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
    
    return csvContent;
}


fs.readFile('p1_phiM.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    try {
        const jsonData = JSON.parse(data);
        const csv = convertToCSV(jsonData);
        
        // Write the CSV to a new file
        fs.writeFile('p1_phiM.csv', csv, (err) => {
            if (err) {
                console.error('Error writing CSV file:', err);
                return;
            }
            console.log('CSV file has been created successfully!');
        });
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});