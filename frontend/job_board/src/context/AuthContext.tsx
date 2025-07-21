import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from 'jwt-decode';


interface User {
    id: string;
    profileId: string;
    role: 'CANDIDATE' | 'COMPANY' | 'ADMIN';
    name: string;
    exp?: number;
}

interface JwtPayload {
    user: User;
    exp?: number;
}

interface AuthContextType {
    isAuthenticated: boolean;
    isInitializing: boolean;
    user: User | null;
    login: (token: string) => void;
    logout: () => void;
}


const AuthContext = createContext<AuthContextType | null>(null);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        const initializeAuth = () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const decodedToken: JwtPayload = jwtDecode(token);
                    const isExpired = decodedToken.exp ? decodedToken.exp * 1000 < Date.now() : false;
                    
                    if (isExpired) {
                        throw new Error("Token expired");
                    }
                    
                    setUser(decodedToken.user); 
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                localStorage.removeItem('token');
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                // ✅ สำคัญมาก: ต้องตั้งค่า isInitializing เป็น false เสมอ ไม่ว่าจะเกิดอะไรขึ้น
                setIsInitializing(false);
            }
        };

        initializeAuth();
    }, []);

    const login = (token: string) => {
        localStorage.setItem('token', token);
        const decodedToken: JwtPayload = jwtDecode(token);
        setUser(decodedToken.user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
        setIsAuthenticated(false);
        // ไปที่หน้า login โดยตรงเพื่อรีเซ็ต state ทั้งหมด
        window.location.href = '/auth/employee/login';
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, isInitializing, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
