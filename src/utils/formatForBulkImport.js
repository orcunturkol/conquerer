const fs = require('fs');
const path = require('path');

function formatForBulkImport(inputFilePath, outputFilePath, indexName) {
  // Read the input JSON file
  const data = JSON.parse(fs.readFileSync(inputFilePath, { encoding: 'utf8' }));
  
  // Create a writable stream for the output file
  const outputStream = fs.createWriteStream(outputFilePath, { encoding: 'utf8' });

  data.forEach((doc) => {
    // For each document, write the action and document data as two lines
    const action = { index: { _index: indexName } };
    outputStream.write(JSON.stringify(action) + '\n');
    outputStream.write(JSON.stringify(doc) + '\n');
  });

  outputStream.end();
  console.log(`Formatted data saved to ${outputFilePath}`);
}

const postsInputPath = path.join(__dirname, 'posts.json');
const usersInputPath = path.join(__dirname, 'users.json');
const postsOutputPath = path.join(__dirname, 'formatted_posts.json');
const usersOutputPath = path.join(__dirname, 'formatted_users.json');

formatForBulkImport(postsInputPath, postsOutputPath, 'posts');
formatForBulkImport(usersInputPath, usersOutputPath, 'users');
