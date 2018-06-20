import { State } from './types';
import { SERVER_URL } from './constants';

declare global {
    interface Window { mobile: any; }
}


interface Cache {
  projects: any[];
};

const DEVICE_UUID = '_netsblox';
const SERVER_ADDRESS = SERVER_URL;
declare var AuthHandler;
const authenticator = new AuthHandler(SERVER_ADDRESS)
let snap: any;
let platform:string = 'unknown';
let snapFrame: any;
let state:State = {
  loggedIn: false,
  username: '',
  email: '',
  view: {
    focusMode: false,
  }
};

let cache:Cache = {projects: null};
// can be used as a way to check if loggedIn
// gets the current logged in users and also updates the app state regarding the user auth
function getUser() {
  return authenticator.getProfile()
    .then( user => {
      state.loggedIn = true;
      state.username = user.username;
      state.email = user.email;
      return user;
    })
    .catch(err => {
      state.loggedIn = false;
      throw err;
    })
}

function checkLoggedIn() {
  return getUser();
}

export default {
  SERVER_ADDRESS,
  DEVICE_UUID,
  checkLoggedIn,
  getUser,
  state,
  snap,
  cache,
  snapFrame,
  platform,
  authenticator
};
