/*
 * complies the netsblox index.html
 */

const dot = require('dot');
const fs = require('fs');
const assert = require('assert');

const SERVER_URL = process.env.SERVER_URL,
  CLIENT_ADDRESS = 'www/assets/netsblox-client/',
  CONSTANTS_PATH = 'src/constants.ts';

if (!SERVER_URL) throw new Error('set the SERVER_URL');

const srcPath = 'netsblox/src/browser/';
const indexDotFile = fs.readFileSync(srcPath + 'index.dot', 'UTF8');
assert(indexDotFile, 'index.dot file is empty');
const indexTpl = dot.template(indexDotFile);
indexMetadata = {
  baseUrl: SERVER_URL,
  servicesHosts: [],
};

fs.writeFileSync(CLIENT_ADDRESS + 'index.html', indexTpl(indexMetadata), 'UTF8');

// setup constants file
let constantsTxt;
try {
  constantsTxt = fs.readFileSync(CONSTANTS_PATH, 'UTF8');
} catch (e) {
  console.error('couldn\'t find constant file, creating a new one');
  constantsTxt = 'export const SERVER_URL = "https://editor.netsblox.org";';
}
const curUrl = constantsTxt.match(/SERVER_URL.*"(.*)"/)[1];
constantsTxt = constantsTxt.replace(curUrl, SERVER_URL);
fs.writeFileSync(CONSTANTS_PATH, constantsTxt, 'UTF8');

console.log('finished building index.html at', CLIENT_ADDRESS);
