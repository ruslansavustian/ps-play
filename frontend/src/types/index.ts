// User types
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
export interface SessionResponse {
  uuid: string;
  expiresAt: string;
}
export interface LoginDto {
  uuid: string;
  email: string;
  hashedPassword: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  hashedPassword: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Gaming Account types
export interface Account {
  id?: number;
  games: Game;
  pricePS5: number;
  platformPS4: boolean;
  platformPS5: boolean;
  pricePS4: number;
  P1: boolean;
  P2: boolean;
  P3: boolean;
  created?: string;
}

export interface CreateAccountDto {
  games: number;
  platformPS4: boolean;
  platformPS5: boolean;
  P1: boolean;
  P2: boolean;
  P3: boolean;
  pricePS5: number;
  pricePS4: number;
}

// Game types
export interface Game {
  id?: number;
  name: string;
  created?: string;
}

export interface CreateGameDto {
  name: string;
}

// App State types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface AccountsState {
  accounts: Account[];
  accountsLoading: boolean;
}

export interface GamesState {
  games: Game[];
  gamesLoading: boolean;
}

export interface AppState extends AuthState, AccountsState, GamesState {
  // Future: можно добавить другие состояния (projects, settings, etc.)
}
