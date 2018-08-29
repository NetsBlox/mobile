# NetsBlox Mobile
Currently available for Android at [Google Store](https://play.google.com/store/apps/details?id=org.netsblox.player)



## Installation Tips

- Requirements: Node (version 8+)
    - Android Studio
    - XCode (for IOS development)
- Globally install ionic and coroda `npm i -g ionic cordova`
- Clone the repo `git clone --recursive REPO_URL_HERE netsblox-mobile && cd netsblox-mobile && git pull --recurse-submodules`
- Setup NetsBlox as a submodule:
    - ~add `git submodule add https://github.com/NetsBlox/netsblox`~
    - update the submodule to pull its submodules `git submodule update --init --recursive`
    - install netsblox depndecies to allow buliding dist file `cd netsblox && npm i; cd ../`
- Setup NetsBlox's browser by going to src/browser and running `git submodule update --init --recursive`
- Create a relative symlink from netsblox's browser directory to www/assets/netsblox-client `ln -s ../../netsblox/src/browser www/assets/netsblox-client`
- everytime netsblox submodule is changed/updated run `bin/update-netsblox.sh` to rebuild the nb dependencies

## Platform Dependent Tips
Read general instructions on how to publish on [Ionic's docs](https://ionicframework.com/docs/v1/guide/publishing.html)

### Android
In order for android webview to support the `viewport` tag you need to update the file `CordovaLib/src/org/apache/cordova/engine/SystemWebViewEngine.java` by adding
```
settings.setUseWideViewPort(true);
settings.setLoadWithOverviewMode(true);
settings.setSupportZoom(true);
```
more information available at [cordova viewport fix](https://fetch-info.blogspot.com/2015/06/include-viewport-settings-in-cordova-if.html)

To generate a production ready APK, run `./bin/publish-android.sh KEYSTORE_PATH ALIAS VERSION` to generate a production ready apk. Don't forget to subsitute keysore, alias and version number with appropriate values.

### IOS
- Take advantage of [free provisioning](https://developer.xamarin.com/guides/ios/getting_started/installation/device_provisioning/free-provisioning/) to deploy to your device w/o a developer account.
- To deploy to device:
    1. open `platforms/ios` in XCode
    2. click the project from the left pane to open its settings
    3. signing > select a team (refer to free provisioning)
    4. go to your device settings > general > dev management > trust your account
    5. `ionic cordova run ios --device`
- To publish to app store
    1. check/change signing identity located at `./platforms/ios/corodva/bulid-release.xcconfig`
    2. ensure you have the correct bundle id (same as the one defined in itunes connect)


## Environment Variables
Set the environment variables below to configure your deployment.
- `SERVER_URL` to set the main server's url
- `ANDROID_HOME` to android sdk directory
- `JAVA_HOME` to jdk directory
- `PATH` should include android build-tools
