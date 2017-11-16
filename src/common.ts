import { Project } from './types';

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

export default {
    SERVER_ADDRESS: 'http://editor.local.netsblox.org:8080',
    loggedIn: false,
    getProjectStructure,
};
