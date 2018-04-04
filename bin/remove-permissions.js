#!/usr/bin/env node

//
// This hook removes specific permissions from the AndroidManifest.xml
// The AndroidManifest is re-generated during the prepare stage,
// so this must be run on the "after_prepare" hook.
//


// Configure the permissions to be forcefully removed.
// NOTE: These permissions will be removed regardless of how many plugins
//     require the permission. You can check the permission is only required
//     by the plugin you *think* needs it, by looking at the "count" shown in
//     your /plugins/android.json file.
//     If the count is more than 1, you should search through
//     the /plugins/<plugin-name>/plugin.xml files for <uses-permission> tags.

var permissionsToRemove = [ 'RECORD_AUDIO', 'CAMERA', 'READ_CONTACTS', 'BLUETOOTH', 'BLUETOOTH_ADMIN', 'READ_CALENDAR' ];


var fs = require('fs');
var manifestFile = 'platforms/android/AndroidManifest.xml';

fs.readFile( manifestFile, 'utf8', function( err, data )
{
  if (err)
    return console.log( err );

  var result = data;
  for (var i=0; i<permissionsToRemove.length; i++)
    result = result.replace( '<uses-permission android:name="android.permission.' + permissionsToRemove[i] + '" />', '' );

  fs.writeFile( manifestFile, result, 'utf8', function( err ) {
    console.log('removed permissions', permissionsToRemove);
    if (err)
      return console.log( err );
  });
} );
