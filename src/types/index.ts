
export interface User {
  id?: number;
  name: string;
  birthdate: string; // ISO format
  quantity: number;
  avatar?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
