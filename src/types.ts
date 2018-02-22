export interface Project {
    name: string;
    url: string;
    externalUrl: string;
    description: string;
    updatedAt: Date;
    thumbnail: string;
    numRoles: number;
};

export interface View {
    focusMode: boolean;
}

export interface State {
    // TODO move under user
    loggedIn: boolean;
    username: string;
    email: string;
    view: View;
};

