export interface IAiProvider {
  generateResponse(prompt: string, context: string): Promise<string>;
  generateRecommendations(context: IRecommendationContext): Promise<string>;
  validateResponse(response: string): boolean;
}

export interface IRecommendationContext {
  availableAccounts: any[];
  userPreferences: {
    language: string;
    platformPreference?: string;
    budgetRange?: number;
    gamePreferences?: number[];
  };
  budget: number;
  platform: string;
  gameIds: number[];
}

export interface IAiConfig {
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
  rateLimit: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}
