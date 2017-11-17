import { Project, State } from './types';
import $ from 'jquery';

const SERVER_ADDRESS = 'http://netsblox.tk:3000';
let state:State = {
  loggedIn: false,
  username: '',
  email: ''
};

function getProjectStructure() {
  let project:Project;
  let projectStructure = {
    name: 'Loading',
    url: '',
    description: 'loading pojects',
    updatedAt: new Date(),
    thumbnail: 'url'
  };
  project = <Project> Object.assign({}, projectStructure);
  return project;
}

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
    state.username = resp.username;
    state.email = resp.email;
    return resp;
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
  getProjectStructure,
  state,
};
