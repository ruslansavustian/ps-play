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
  gamesIds: number[];
  games?: Game[];
  priceP1: number;
  priceP2PS4: number;
  priceP2PS5: number;
  priceP3: number;
  priceP3A: number;
  platformPS4: boolean;
  platformPS5: boolean;
  P1: boolean;
  P2PS4: boolean;
  P2PS5: boolean;
  P3: boolean;
  P3A: boolean;
  created?: string;
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

export interface CreateOrderDto {
  customerName?: string;
  phone: string;
  gameName?: string;
  platform?: string;
  notes?: string;
  email?: string;
  telegram?: string;
  accountId?: number;
  purchaseType?: string;
}

export interface Order {
  id: number;
  createdAt?: string;
  customerName?: string;
  phone?: string;
  gameName?: string;
  platform?: string;
  notes?: string;
}

export interface OrdersState {
  orders: Order[];
  ordersLoading: boolean;
}

export interface AuditLog {
  id: number;
  userId: number;
  user: User;
  action: string;
  entityType: string;
  entityId?: number;
  description: string;
  metadata: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

// Chat types
export interface ChatMessage {
  id?: number;
  message: string;
  userName: string;
  userId?: string;
  createdAt?: Date;
  timestamp?: Date;
}

export interface JoinTheChatDto {
  userName: string;
  userId: string;
}

export interface ChatState {
  messages: ChatMessage[];
  messagesLoading: boolean;
}

export interface SupportTicket {
  id: string;
  userName: string;
  message: string;
  status: "open" | "closed";
}

export interface CreateTicketData {
  userName: string;
  initialMessage: string;
}
export interface AppState extends AuthState, AccountsState, GamesState {
  // Future: можно добавить другие состояния (projects, settings, etc.)
}
