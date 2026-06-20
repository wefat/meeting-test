// src/lib/mockAuth.ts

// Define user types
export type UserType = "admin" | "user";

// Define the User interface
export interface User {
  id: number;
  name: string;
  email: string;
  type: UserType;
}

// Mock user accounts
const users: (User & { password?: string })[] = [
  {
    id: 1,
    name: "Admin User",
    email: "admin@example.com",
    password: "password123",
    type: "admin",
  },
  {
    id: 2,
    name: "Regular User",
    email: "user@example.com",
    password: "password123",
    type: "user",
  },
];

// Mock login function
export const login = (email: string, password?: string): User | null => {
  const user = users.find(
    (u) => u.email === email && u.password === password
  );
  if (user) {
    const { password, ...userWithoutPassword } = user;
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
    }
    return userWithoutPassword;
  }
  return null;
};

// Mock logout function
export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
};

// Get user from localStorage
export const getAuthUser = (): User | null => {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
};
