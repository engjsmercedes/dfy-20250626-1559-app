export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  created_at: string;
  user_id: string;
}

// Add more types based on features

