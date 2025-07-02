import React, {createContext, useState, useEffect, useContext} from "react";
import { jwtDecode } from 'jwt-decode';

interface User{
    id: string;
    profileId: string;
    role: 'CANDIDATE' | 'COMPANY' | 'ADMIN';
    name: string;
}

interface AuthContextType {
    isAuthenticated: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);
export const AuthProvider : React.FC <{children: React.ReactNode}> = ({children}) => {
    const [user, setUser] = useState<User|null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(token){
            try {
                const decodeToken: {user:User} = jwtDecode(token);
                setUser(decodeToken.user);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem('token');
            }
        }
    },[]);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decodeToken: {user: User} = jwtDecode(token);
        setUser(decodeToken.user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{isAuthenticated, user, login, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
