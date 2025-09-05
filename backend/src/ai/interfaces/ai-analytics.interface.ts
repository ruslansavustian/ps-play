export interface IAiAnalytics {
  trackMessage(sessionId: string, message: string, isFromUser: boolean): void;
  trackSession(sessionId: string, userId?: string): void;
  trackRecommendation(sessionId: string, recommendation: string): void;

  getSessionStats(sessionId: string): Promise<ISessionStats>;
  getUserStats(userId: string): Promise<IUserStats>;
  getOverallStats(): Promise<IOverallStats>;

  trackSuspiciousActivity(userId: string, message: string): void;
  getSuspiciousActivity(): Promise<ISuspiciousActivity[]>;
}

export interface ISessionStats {
  sessionId: string;
  messageCount: number;
  duration: number;
  recommendationsGiven: number;
  userSatisfaction?: number;
}

export interface IUserStats {
  userId: string;
  totalSessions: number;
  totalMessages: number;
  averageSessionDuration: number;
  favoriteGames: number[];
  preferredPlatform: string;
}

export interface IOverallStats {
  totalSessions: number;
  totalMessages: number;
  averageResponseTime: number;
  userSatisfaction: number;
  mostPopularGames: Array<{ gameId: number; count: number }>;
  platformDistribution: Array<{ platform: string; count: number }>;
}

export interface ISuspiciousActivity {
  userId: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  reason: string;
}
