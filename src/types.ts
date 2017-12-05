export interface Project {
    name: string;
    url: string;
    externalUrl: string;
    description: string;
    updatedAt: Date;
    thumbnail: string;
};

export interface State {
    loggedIn: boolean;
    username: string;
    email: string;
};
