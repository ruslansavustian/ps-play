import { User, Account, Game, Order, Role, AuditLog } from "@/types";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
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

export interface AppState {
  users: User[];
  roles: Role[];
  auditLogs: AuditLog[];
  auditLogsLoading: boolean;
  errorMessage: string | null;
}

export interface RootState {
  auth: AuthState;
  accounts: AccountsState;
  games: GamesState;
  orders: OrdersState;
  app: AppState;
}
