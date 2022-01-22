# NetsBlox Mobile
Currently available for Android at [Google Store](https://play.google.com/store/apps/details?id=org.netsblox.player)

## TODO
- big action buttons on android
- keyboard interaction on ios
- ? missing roles

## Dev Environment

- Requirements:
    - Node 10 (**higher versions may have compile errors for some deps**)
    - Android Studio (android only)
    - XCode (iOS only)

- Globally install ionic and cordova:

    ```sh
    npm i -g @ionic/cli
    npm i -g cordova@8.1.2
    ```

- Clone the repo

    ```sh
    git clone --recurse-submodules git@github.com:NetsBlox/mobile.git netsblox-mobile
    cd netsblox-mobile
    ```

- Setup the NetsBlox submodule

    ```sh
    cd netsblox && npm i && cd ..
    ```

- Create a symlink to use NetsBlox's `browser` submodule (run from `netsblox-mobile/`)

    ```sh
    ln -s ../../netsblox/src/browser src/assets/netsblox-client
    ```

- Run/test your code (on a tethered physical device)

    ```sh
    npx ionic cordova run <android|ios> --device
    ```

- Inspect logging/errors during runtime (tethered device) through Chrome

    ```
    chrome://inspect
    ```

## Platform Dependent Tips
Read general instructions on how to publish on [Ionic's docs](https://ionicframework.com/docs/v1/guide/publishing.html)

### Android

In order for android webview to support the `viewport` tag you need to update the file `platforms/android/CordovaLib/src/org/apache/cordova/engine/SystemWebViewEngine.java` by adding the following to `initWebViewSettings()` after the declaration of the `settings` variable:

```java
settings.setUseWideViewPort(true);
settings.setLoadWithOverviewMode(true);
settings.setSupportZoom(true);
```

More information is available at [cordova viewport fix](https://fetch-info.blogspot.com/2015/06/include-viewport-settings-in-cordova-if.html).
If `platforms/android` does not exist, first build the android project with `npx ionic cordova build android`. Unless cleaned/deleted, the modified java file will persist and only needs to be changed once.

Here are instructions for how to publish a new release to the Google Play store.

- Update the `version="..."` attribute (on root `widget` object) in [`config.xml`](config.xml).

- If the max Android API level has changed, also edit `<preference name="android-targetSdkVersion" value="..." />` in [`config.xml`](config.xml). *(The Play Console sometimes complains when targetting non-up-to-date versions).*

- Generate an (unsigned) production-ready APK

    ```sh
    npx ionic cordova build android --prod --release
    ```

- Change directory into the output location

    ```sh
    cd platforms/android/app/build/outputs/apk/release/
    ```

- Align the apk

    ```sh
    zipalign -v -p 4 app-release-unsigned.apk app-release-unsigned-aligned.apk
    ```

- Sign the apk with the NetsBlox dev account upload (private) key *(replace `<upload-key>` with the path to the `.jks` keystore file)*

    ```sh
    apksigner sign --ks <upload-key> --out app-release-signed.apk app-release-unsigned-aligned.apk
    ```

- Upload the signed apk (`app-release-signed.apk`) to the [play console](https://play.google.com/console)

More information about the build/signing process can be found [here](https://developer.android.com/studio/build/building-cmdline).

### IOS

- Take advantage of [free provisioning](https://developer.xamarin.com/guides/ios/getting_started/installation/device_provisioning/free-provisioning/) to deploy to your device w/o a developer account.

- To deploy to device:
    1. Generate the XCode project

        ```sh
        npx ionic cordova prepare ios
        ```

    1. open `platforms/ios` in XCode
    1. click the project from the left pane to open its settings
    1. signing > select a team (refer to free provisioning)
    1. go to your device settings > general > dev management > trust your account
    1. Run the project

        ```sh
        npx ionic cordova run ios --device
        ```
- To publish to app store
    1. check/change signing identity located at `./platforms/ios/corodva/bulid-release.xcconfig`
    1. ensure you have the correct bundle id (same as the one defined in itunes connect)


## Environment Variables

Set the environment variables below to configure your deployment.
*Note: The java/android related env vars are not needed for iOS development.*

- `SERVER_URL` - the main NetsBlox server's url
- `ANDROID_HOME` - android sdk directory
- `JAVA_HOME` - jdk directory
- `PATH` - should include android build-tools and gradle

Here is an example set of sufficient environment variables (linux):

```sh
export SERVER_URL=https://editor.netsblox.org
export ANDROID_HOME=/home/devin/Android/Sdk/
export JAVA_HOME=/usr/local/android-studio/jre/
export PATH=/opt/gradle/gradle-7.3.3/bin:/home/devin/Android/Sdk/build-tools/30.0.3:$PATH
```