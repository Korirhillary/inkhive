export interface User {
    id: string;
    name: string;
    email: string;
    createdAt: string;
  }
  
  export interface Category {
    id: string;
    name: string;
    description?: string;
    _count?: {
      posts: number; 
    };
    createdAt: string;
  }
  
  export interface Post { 
    id: string;
    title: string;
    content: string;
    published: boolean;
    createdAt: string;
    author: {
      id: string;
      name: string;
    };
    category: {
      id: string;
      name: string;
    };
    _count?: {
      comments: number;
    };
    comments?: Comment[];
  }
  
  export interface Comment {
    id: string;
    content: string;
    createdAt: string;
    author: {
      id: string;
      name: string;
    };
  }
  
  export interface AuthResponse {
    token: string;
  }
  
  export interface AuthStore {
    token: string | null;
    user: User | null;
    setToken: (token: string | null) => void;
    setUser: (user: User | null) => void;
    logout: () => void;
  }
  