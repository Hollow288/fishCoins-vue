
export interface User {
    userId?: string
    userName?: string
    email?: string
    phoneNumber?: string
    name?: string
    firstName?: string
    lastName?: string
    nickName?: string
    avatarUrl?: string
    gender?: string
    genderLabel?: string
    country?: string
    province?: string
    city?: string
    status?: string
    createTime?: string
    address?: string
    biography?: string
    birthDate?: string
    verified?: boolean
    enabled?: boolean
    createdAt?: string
    githubId?:string
    githubUrl?:string
    roles?: string[]
    authTypes?: string[]
}

export interface Register {
    username: string;
    password: string;
    email: string;
}