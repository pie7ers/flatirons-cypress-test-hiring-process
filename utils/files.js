const fs = require('fs');
const path = require('path');

const readOptions = { encoding: 'utf8', flag: 'r' }

function writeFile(destinationPath, content, options = 'utf-8') {
  const dirPath = path.dirname(destinationPath)
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  try {
    fs.writeFileSync(destinationPath, content, options)
    return 'File written at'
  } catch (error) {
    console.log(`${error}`)
  }
}

function readDataFile(destinationPath, options = readOptions) {
  try {
    return fs.readFileSync(destinationPath, options)
  } catch {
    return false
  }
}

function appendToDataFile(destinationPath, content, options = 'utf-8') {
  const dirPath = path.dirname(destinationPath);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  let data = readDataFile(destinationPath)
  let line = data ? JSON.parse(data) : []
  line.push(content)
  content = JSON.stringify(line, null, 2)
  fs.writeFileSync(destinationPath, content, options)

  //return `Appended to ${destinationPath}`;
  return { success: true, path: destinationPath }
}

module.exports = {
  writeFile,
  appendToDataFile,
};
