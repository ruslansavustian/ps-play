import { User, Account, Game, Order, AuditLog } from "@/types";

export interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

export interface AccountsState {
  accounts: Account[];
  publicAccounts: Account[];
  loading: boolean;
  error: string | null;
}

export interface GamesState {
  games: Game[];
  currentGame: Game | null;
  loading: boolean;
  error: string | null;
}

export interface OrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export interface AuditLogsState {
  auditLogs: AuditLog[];
  loading: boolean;
  error: string | null;
}

export interface RootState {
  accounts: AccountsState;
  games: GamesState;
  auditLogs: AuditLogsState;
  orders: OrdersState;
  users: UsersState;
  auth: AuthState;
}
