const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'server', 'controllers');

// Recursive function to get all files
function getAllFiles(dirPath, arrayOfFiles) {
  let files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(__dirname, 'server', 'controllers', file));
    }
  });

  return arrayOfFiles;
}

const files = getAllFiles(controllersDir);

files.forEach(file => {
  if (file.endsWith('.js')) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Replace "http://localhost:5001/uploads/..."
    content = content.replace(/"http:\/\/localhost:5001([^"]*)"/g, '`${process.env.BASE_URL || "http://localhost:5001"}$1`');
    // Replace `http://localhost:5001/uploads/...`
    content = content.replace(/`http:\/\/localhost:5001([^`]*)`/g, '`${process.env.BASE_URL || "http://localhost:5001"}$1`');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
