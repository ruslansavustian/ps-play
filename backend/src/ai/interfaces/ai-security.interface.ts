export interface IAiSecurity {
  validateInput(message: string): boolean;
  sanitizeInput(message: string): string;

  checkRateLimit(userId: string): Promise<boolean>;
  checkIPBlocklist(ip: string): Promise<boolean>;
  checkSuspiciousPatterns(message: string): boolean;

  blockUser(userId: string, reason: string, duration?: number): Promise<void>;
  unblockUser(userId: string): Promise<void>;
  isUserBlocked(userId: string): Promise<boolean>;

  logSecurityEvent(event: ISecurityEvent): void;
  getSecurityLogs(): Promise<ISecurityEvent[]>;
}

export interface ISecurityEvent {
  userId: string;
  ip: string;
  eventType:
    | 'rate_limit'
    | 'suspicious_message'
    | 'blocked_user'
    | 'jailbreak_attempt';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

export interface ISecurityConfig {
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
    requestsPerDay: number;
  };
  suspiciousPatterns: string[];
  blockedIPs: string[];
  autoBlockThreshold: number;
}
