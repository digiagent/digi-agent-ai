export type { User, UserRole, UserStatus } from "./user";
export type { Agent, AgentCapability, AgentAction } from "./agent";

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
