import { Project } from './types';
import $ from 'jquery';

const SERVER_ADDRESS = 'http://netsblox.tk:3000';
const loggedIn = false;

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

function checkLoggedIn() {
    let url = SERVER_ADDRESS + '/api/getProjectList?format=json';
    return $.ajax({
        url,
        method: 'GET',
        xhrFields: {
            withCredentials: true
        },
        crossDomain: true
    }).then( resp => {
        loggedIn = true;
        return resp; }).catch( e => {
        loggedIn = false;
        throw e;
    })
}

export default {
    SERVER_ADDRESS,
    loggedIn,
    checkLoggedIn,
    getProjectStructure,
};
