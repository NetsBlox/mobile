import { State } from './types';
import $ from 'jquery';

declare global {
    interface Window { mobile: any; }
}

interface Cache {
  projects: any[];
};

const SERVER_ADDRESS = 'https://dev.netsblox.org';
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
function getUser() {
  return $.ajax({
    url: SERVER_ADDRESS + '/api',
    method: 'POST',
    data: JSON.stringify({
    api: false,
    return_user: true,
    silent: true
    }),
    contentType: 'application/json; charset=utf-8',
    xhrFields: {
      withCredentials: true
    },
    headers: {
      // SESSIONGLUE: '.sc1m16',
      Accept: '*/*',
    },
    crossDomain: true
  }).then( resp => {
    if (resp) {
      state.loggedIn = true;
      state.username = resp.username;
      state.email = resp.email;
      return resp;
    } else {
      throw new Error('no response from server when getting user');
    }
  }).catch(err => {
    state.loggedIn = false;
    throw err;
  })
}

function checkLoggedIn() {
  return getUser();
}

export default {
  SERVER_ADDRESS,
  checkLoggedIn,
  getUser,
  state,
  snap,
  cache,
  snapFrame,
  platform,
};
