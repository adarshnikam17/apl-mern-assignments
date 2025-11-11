const fs = require('fs');
const filePath = 'abc.txt';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err.message);
    return;
  }
  console.log('File Contents:\n');
  console.log(data);
});
