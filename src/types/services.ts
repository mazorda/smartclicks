export interface RetryConfig {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  shouldRetry: (error: unknown) => boolean;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 5000,
  shouldRetry: (error: unknown) => {
    if (error instanceof Error) {
      // Retry on network errors or 5xx server errors
      return error.name === 'NetworkError' || /^5\d{2}/.test(error.message);
    }
    return false;
  }
};

export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TimeoutError';
  }
}

export class DomainAuditError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: Error
  ) {
    super(message);
    this.name = 'DomainAuditError';
  }
}

export interface DomainAuditValidationRules {
  required: string[];
  numeric: string[];
  string: string[];
  status: {
    validValues: string[];
  };
}

export const DEFAULT_VALIDATION_RULES: DomainAuditValidationRules = {
  required: ['domain', 'status', 'enrichment_status'],
  numeric: [
    'r1_gads_health_score',
    'r1_bounce_rate',
    'r1_traffic_rank',
    'r1_avg_time_on_site',
    'r1_total_visits',
    'r1_paid_visits',
    'r1_organic_visits'
  ],
  string: [
    'domain',
    'status',
    'enrichment_status',
    'r1_health_score_analysis',
    'r1_analysis'
  ],
  status: {
    validValues: ['pending', 'processing', 'completed', 'failed']
  }
};

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export interface DomainAuditServiceConfig {
  timeout: number;
  retryConfig: RetryConfig;
}

export const DEFAULT_SERVICE_CONFIG: DomainAuditServiceConfig = {
  timeout: 30000,
  retryConfig: DEFAULT_RETRY_CONFIG
};
