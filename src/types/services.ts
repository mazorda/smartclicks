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
    'semrush_traffic_rank',
    'semrush_bounce_rate',
    'semrush_time_on_site',
    'semrush_total_visits',
    'semrush_paid_visits',
    'semrush_organic_visits',
    'semrush_direct_visits',
    'semrush_social_visits',
    'semrush_mobile_traffic_share',
    'semrush_mobile_bounce_rate',
    'semrush_pages_per_visit',
    'similarweb_visits',
    'linkedin_follower_count',
    'founded_year'
  ],
  string: [
    'domain',
    'status',
    'enrichment_status',
    'linkedin_url',
    'company_name',
    'country',
    'city_locality',
    'company_description'
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
