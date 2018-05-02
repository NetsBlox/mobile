console.log('overriding netsblox for mobile use. pre-nb');
let mobileHandle = parent.mobile;

SERVER_URL = mobileHandle.common.SERVER_ADDRESS;
SERVER_ADDRESS = SERVER_URL.replace(/^.*\/\//, '');
