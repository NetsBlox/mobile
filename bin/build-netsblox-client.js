/*
 * complies the netsblox index.html
 */

const dot = require('dot'),
    fse = require('fs-extra');

const CLIENT_ADDRESS = 'www/assets/netsblox-client/';

const indexTpl = dot.template(fse.readFileSync(CLIENT_ADDRESS + 'netsblox.dot', 'UTF8'));
indexMetadata = {
    baseUrl: process.env.SERVER_URL || 'https://editor.netsblox.org'
};

fse.writeFileSync(CLIENT_ADDRESS + 'index.html', indexTpl(indexMetadata), 'UTF8');

console.log('finished building index.html at', CLIENT_ADDRESS);
