/*
 * complies the netsblox index.html
 */

const dot = require('dot'),
    fse = require('fs-extra');

const SERVER_URL = process.env.SERVER_URL,
    CLIENT_ADDRESS = 'www/assets/netsblox-client/',
    CONSTANTS_PATH = 'src/constants.ts';

if (!SERVER_URL) throw new Error('set the SERVER_URL');

const indexTpl = dot.template(fse.readFileSync(CLIENT_ADDRESS + 'index.dot', 'UTF8'));
indexMetadata = {
    baseUrl: SERVER_URL,
};

fse.writeFileSync(CLIENT_ADDRESS + 'index.html', indexTpl(indexMetadata), 'UTF8');

// setup constants file
let constantsTxt;
try {
    constantsTxt = fse.readFileSync(CONSTANTS_PATH, 'UTF8');
} catch (e) {
    constantsTxt = `export const SERVER_URL = "https://dev.netsblox.org";`;
}
const curUrl = constantsTxt.match(/SERVER_URL.*"(.*)"/)[1];
constantsTxt = constantsTxt.replace(curUrl, SERVER_URL);
fse.writeFileSync(CONSTANTS_PATH, constantsTxt, 'UTF8');

console.log('finished building index.html at', CLIENT_ADDRESS);
