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
export enum GamePlatform {
  PLAYSTATION = "playstation",
  XBOX = "xbox",
  STEAM = "steam",
  EPIC_GAMES = "epic_games",
  NINTENDO = "nintendo",
  BATTLE_NET = "battle_net",
  ORIGIN = "origin",
  UBISOFT = "ubisoft",
}

export enum AccountStatus {
  AVAILABLE = "available",
  SOLD = "sold",
  RESERVED = "reserved",
  PENDING = "pending",
}

export interface Account {
  id?: number;
  platform: GamePlatform;
  username: string;
  level?: string;
  gamesLibrary?: string;
  price: number;
  status: AccountStatus;
  description?: string;
  isVerified: boolean;
  region?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAccountDto {
  platform: GamePlatform;
  username: string;
  level?: string;
  gamesLibrary?: string;
  price: number;
  status?: AccountStatus;
  description?: string;
  isVerified?: boolean;
  region?: string;
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

export interface AppState extends AuthState, AccountsState {
  // Future: можно добавить другие состояния (projects, settings, etc.)
}
