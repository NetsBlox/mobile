// this is almost a clone of netsblox's build file.
// TODO refactor netsblox's bulid file so that it's reusable
/* eslint-disable no-console */
'use strict';
const isDevEnv = process.env.ENV !== 'production';
var fs = require('fs'),
  path = require('path'),
  srcPath = 'netsblox/src/browser';
const fsp = fs.promises;

const listOverrides = () => {
    return {
      post: ['src/netsblox-overrides/post-nb.js'],
      pre: ['src/netsblox-overrides/pre-nb.js']
    };
  },
  overrides = listOverrides();


// Get the given js files
var devHtml = fs.readFileSync(path.join(srcPath, 'index.dev.html'), 'utf8'),
  re = /text\/javascript" src="(.*)">/,
  match = devHtml.match(re),
  nbSrcFiles = [],
  srcFiles = [];

while (match) {
  nbSrcFiles.push(match[1]);
  devHtml = devHtml.substring(match.index + match[0].length);
  match = devHtml.match(re);
}
if (!isDevEnv) console.log('concatting and minifying:', nbSrcFiles);
nbSrcFiles = nbSrcFiles.map(file => path.join(srcPath, file))
    .filter(filename => !filename.endsWith('main.js'));

// H add mobile overrides
srcFiles = srcFiles.concat(overrides.pre);
srcFiles = srcFiles.concat(nbSrcFiles);
srcFiles = srcFiles.concat(overrides.post);

var src = srcFiles
  .map(file => fs.readFileSync(file, 'utf8'))
  .join('\n');

var ugly = require('uglify-js');

var finalCode = src;

if (isDevEnv) { // don't minify in dev
  console.log('Dev environment detected - skipping build optimizations. If you ' +
        'change to a production env, be sure to rebuild with:');
  console.log('');
  console.log('    npm run postinstall');
  console.log('');
} else {
  console.log('dev src length:', src.length);

  finalCode = ugly.minify(srcFiles, {outSourceMap: path.join(srcPath, 'netsblox-build.js.map')}).code;
  console.log('output length:', finalCode.length);
  console.log('compression ratio:', 1-(finalCode.length/src.length));
}

async function saveCode(code) {
    const outPath = 'www/assets/netsblox-client/';
    try {
      await Promise.all([
          fsp.mkdir(path.join(outPath, 'src')),
          fsp.mkdir(path.join(outPath, 'dist')),
      ]);
    } catch (err) {
    }
    await Promise.all([
        fsp.writeFile(
            'www/assets/netsblox-client/src/main.js',
            await fsp.readFile(path.join(srcPath, 'src', 'main.js'))
        ),
        fsp.writeFile(outPath + 'dist/app.min.js', code),
    ]);
}

saveCode(finalCode);
/* eslint-enable no-console */
