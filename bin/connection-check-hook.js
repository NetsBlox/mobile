/* make sure an android device is connected */

const cp = require('child_process');

module.exports = function(ctx) {
  stdout = cp.execSync('adb devices | wc -l');
  numDevices = parseInt(stdout) - 2;
  if (numDevices < 1) console.error('NO CONNECTED DEVICE FOUND.');
  // TODO break the flow
  return false;
};
