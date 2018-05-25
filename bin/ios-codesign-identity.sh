#!/bin/bash

# changed XCode sign identity to iPhone Developer for IOS
sed 's/iPhone Distribution/iPhone Developer/' platforms/ios/cordova/build-release.xcconfig -i
