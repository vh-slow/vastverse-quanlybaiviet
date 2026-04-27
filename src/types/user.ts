export interface User {
    id: number;
    fullName: string;
    username: string;
    avatar?: string | null;
    email: string;
    bio?: string | null;
    role: string;
    status: number;
    createdAt: string;
}

export interface LoginRequest {
    username: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: number;
        fullName: string;
        username: string;
        avatar?: string | null;
        email?: string;
    };
}
