const fs = require('fs');
try {
    const content = fs.readFileSync('gemini-test-final.txt', 'utf16le');
    const lines = content.split('\n');
    console.log('--- FINAL MODEL STATUS ---');
    lines.forEach(line => {
        if (line.includes('SUCCESS') || line.includes('FAILED') || line.includes('Testing model:')) {
            console.log(line.trim());
        }
    });
} catch (e) {
    console.error('Error reading file:', e.message);
}
