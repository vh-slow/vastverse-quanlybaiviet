'use client';

import {
    createContext,
    useState,
    useContext,
    useEffect,
    ReactNode,
} from 'react';
import { LoginRequest, User } from '../types/user';
import { apiAuth } from '../services/auth';
import { apiUser } from '../services';

interface AuthContextType {
    user: User | null;
    login: (data: LoginRequest) => Promise<User>;
    logout: () => void;
    isLoading: boolean;
    refreshUser: (newUser: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('user');
            const savedToken = localStorage.getItem('token');
            if (savedUser && savedToken) {
                setUser(JSON.parse(savedUser));
            }
        } catch (error) {
            console.error('Failed to load user from localStorage', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = async (data: LoginRequest): Promise<User> => {
        const response = await apiAuth.login(data);

        if (response && response.token) {
            localStorage.setItem('token', response.token);

            const fullProfile = await apiUser.getMyProfile();

            localStorage.setItem('user', JSON.stringify(fullProfile));
            setUser(fullProfile);

            return fullProfile;
        } else {
            throw new Error('Đăng nhập thất bại! Không nhận được token.');
        }
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const refreshUser = (newUser: User) => {
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider
            value={{ user, login, logout, isLoading, refreshUser }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
