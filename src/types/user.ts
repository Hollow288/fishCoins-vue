
export interface User {
    userId?: string
    userName?: string

    nickName?: string
    email?: string
    phoneNumber?: string
    gender?: string
    avatarUrl?: string
    biography?: string

    githubId?:string
    githubUrl?:string
    roles?: string[]
}

export interface Register {
    username: string;
    password: string;
    email: string;
}