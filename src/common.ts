let getProjectStructure = () => {
    let projectStructure = {
        name: 'Loading',
        description: 'loading pojects',
        updatedAt: new Date(),
        thumbnail: 'url'
    };
    return Object.assign({}, projectStructure);
}

export default {
    SERVER_ADDRESS: 'http://editor.local.netsblox.org:8080',
    loggedIn: false,
    getProjectStructure,
}
