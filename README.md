# NetsBlox Mobile



## Installation Tips

- Globally install ionic and coroda `npm i -g ionic cordova`
- Setup NetsBlox as a submodule: 
    - add `git submodule add https://github.com/NetsBlox/netsblox` 
    - update the submodule to pull its submodules `git submodule update --init --recursive` 
    - install netsblox depndecies to allow buliding dist file `cd netsblox && npm i; cd ../`
- Symlink netsblox's client directory to www/assets/netsblox-client

## Environment Variables
Set the environment variables below to configure your deployment.
- `SERVER_URL` to set the main server's url
- `ANDROID_HOME` to android sdk directory
- `JAVA_HOME` to jdk directory
- `PATH` should include android build-tools
