import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../lib/api';

interface User {
  _id: string;
  id?: string; // Keep for backward compatibility
  name: string;
  email: string;
  avatar?: string;
  credits: number;
  isVerified: boolean;
  city?: string;
  college?: string;
  year?: string;
  bio?: string;
  socialLinks?: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
    leetcode?: string;
    codeforces?: string;
    behance?: string;
    other?: string[];
  };
  rating?: {
    average?: number;
  } | number;
  totalReviews?: number;
  role?: string;
}

// Helper to normalize user data from backend (handles id vs _id)
const normalizeUser = (userData: any): User => {
  return {
    ...userData,
    _id: userData._id || userData.id,
    id: userData.id || userData._id,
  };
};

interface SignupData {
  // Required
  name: string;
  email: string;
  password: string;
  city: string;
  // Optional
  college?: string;
  year?: string;
  bio?: string;
  github?: string;
  linkedin?: string;
  portfolio?: string;
  leetcode?: string;
  codeforces?: string;
  behance?: string;
  otherLinks?: string[];
  skillsToTeach?: string[];
  skillsToLearn?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<User>;
  signup: (data: SignupData) => Promise<User>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        const parsedUser = JSON.parse(storedUser);
        setUser(normalizeUser(parsedUser));

        // Verify token is still valid
        try {
          const response = await authAPI.getMe();
          if (response.data.success) {
            const normalizedUser = normalizeUser(response.data.user);
            setUser(normalizedUser);
            localStorage.setItem('user', JSON.stringify(normalizedUser));
          }
        } catch (error) {
          // Token invalid, clear auth state
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, rememberMe = false) => {
    try {
      const response = await authAPI.login({ email, password, rememberMe });
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        const normalizedUser = normalizeUser(userData);
        
        setToken(newToken);
        setUser(normalizedUser);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        return normalizedUser; // Return user for immediate use
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Login failed. Please try again.';
      throw new Error(message);
    }
  };

  const signup = async (data: SignupData) => {
    try {
      const response = await authAPI.signup(data);
      
      if (response.data.success) {
        const { token: newToken, user: userData } = response.data;
        const normalizedUser = normalizeUser(userData);
        
        setToken(newToken);
        setUser(normalizedUser);
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        return normalizedUser; // Return user for immediate use
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Signup failed. Please try again.';
      throw new Error(message);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data.success) {
        const normalizedUser = normalizeUser(response.data.user);
        setUser(normalizedUser);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token && !!user,
    login,
    signup,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
