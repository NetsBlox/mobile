/*
 * complies the netsblox index.html
 */

const dot = require('dot'),
    fse = require('fs-extra');

const SERVER_URL = process.env.SERVER_URL,
    CLIENT_ADDRESS = 'www/assets/netsblox-client/';

if (!SERVER_URL) throw new Error('set the SERVER_URL');

const indexTpl = dot.template(fse.readFileSync(CLIENT_ADDRESS + 'netsblox.dot', 'UTF8'));
indexMetadata = {
    baseUrl: SERVER_URL,
};

fse.writeFileSync(CLIENT_ADDRESS + 'index.html', indexTpl(indexMetadata), 'UTF8');

console.log('finished building index.html at', CLIENT_ADDRESS);
