export type UserRole = "admin" | "agent" | "member";
export type UserStatus = "active" | "inactive" | "suspended";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
