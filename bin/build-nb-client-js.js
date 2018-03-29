// this is almost a clone of netsblox's build file.
// TODO refactor netsblox's bulid file so that it's reusable
/* eslint-disable no-console */
'use strict';
const isDevEnv = process.env.ENV !== 'production';
var fs = require('fs'),
  path = require('path'),
  srcPath = 'netsblox/src/browser';

const listOverrides = () => ['src/netsblox-overrides/main.js'],
  overrides = listOverrides();


// Get the given js files
var devHtml = fs.readFileSync(path.join(srcPath, 'index.dev.html'), 'utf8'),
  re = /text\/javascript" src="(.*)">/,
  match = devHtml.match(re),
  srcFiles = [];

while (match) {
  srcFiles.push(match[1]);
  devHtml = devHtml.substring(match.index + match[0].length);
  match = devHtml.match(re);
}

if (!isDevEnv) console.log('concatting and minifying:', srcFiles);

srcFiles = srcFiles.map(file => path.join(srcPath, file));
// H add mobile overrides
srcFiles = srcFiles.concat(overrides);
var src = srcFiles
  .map(file => fs.readFileSync(file, 'utf8'))
  .join('\n');

var ugly = require('uglify-js');

var final_code = src;

if (isDevEnv) { // don't minify in dev
  console.log('Dev environment detected - skipping build optimizations. If you ' +
        'change to a production env, be sure to rebuild with:');
  console.log('');
  console.log('    npm run postinstall');
  console.log('');
} else {
  console.log('dev src length:', src.length);

  final_code = ugly.minify(srcFiles, {outSourceMap: path.join(srcPath, 'netsblox-build.js.map')}).code;
  console.log('output length:', final_code.length);
  console.log('compression ratio:', 1-(final_code.length/src.length));
}

fs.writeFileSync(path.join(srcPath, 'dist', 'app.min.js'), final_code);
/* eslint-enable no-console */
