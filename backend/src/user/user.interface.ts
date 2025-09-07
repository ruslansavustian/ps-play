import { Role } from './role.entity';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  age?: number;
  role: Role;
}
