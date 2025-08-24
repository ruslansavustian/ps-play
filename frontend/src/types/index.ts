// User types
export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Gaming Account types
export interface Account {
  id?: number;
  games: Game;
  platform: string;
  pricePS: number;
  pricePS4: number;
  created?: string;
}

export interface CreateAccountDto {
  games: number;
  platform: string;
  pricePS: number;
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
