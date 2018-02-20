# NetsBlox Mobile



## Installation Tips

- Globally install ionic and coroda `npm i -g ionic cordova`
- Clone the repo `git clone --recursive REPO_URL_HERE netsblox-mobile && cd netsblox-mobile && git pull --recurse-submodules`
- Setup NetsBlox as a submodule: 
    - ~add `git submodule add https://github.com/NetsBlox/netsblox`~
    - update the submodule to pull its submodules `git submodule update --init --recursive` 
    - install netsblox depndecies to allow buliding dist file `cd netsblox && npm i; cd ../`
- Setup NetsBlox's browser by going to src/browser and running `git submodule update --init --recursive`
- Create a relative symlink from netsblox's browser directory to www/assets/netsblox-client `ln -s ../../netsblox/src/browser www/assets/netsblox-client`
- Set the server address for ionic through `src/commons`. TODO have it set the address as part of the compilation process.

### Platform Support Tips
In order for android webview to support the `viewport` tag you need to update the file `CordovaLib/src/org/apache/cordova/engine/SystemWebViewEngine.java` by adding 
```
settings.setUseWideViewPort(true);
settings.setLoadWithOverviewMode(true);
settings.setSupportZoom(true);
```
more information available at [cordova viewport fix](https://fetch-info.blogspot.com/2015/06/include-viewport-settings-in-cordova-if.html)

## Environment Variables
Set the environment variables below to configure your deployment.
- `SERVER_URL` to set the main server's url
- `ANDROID_HOME` to android sdk directory
- `JAVA_HOME` to jdk directory
- `PATH` should include android build-tools
