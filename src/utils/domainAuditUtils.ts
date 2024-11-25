import { logger } from '../services/logger';
import type { DomainAudit } from '../types/database';
import {
  RetryConfig,
  DEFAULT_RETRY_CONFIG,
  ValidationError,
  DomainAuditValidationRules,
  DEFAULT_VALIDATION_RULES,
  ValidationResult
} from '../types/services';

// Retry utility with exponential backoff
export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<T> {
  let lastError: unknown;
  let delay = config.initialDelay;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      if (!config.shouldRetry(error) || attempt === config.maxRetries) {
        throw error;
      }

      logger.warn(`Retry attempt ${attempt}/${config.maxRetries}`, {
        error,
        nextDelay: delay
      });

      await new Promise(resolve => setTimeout(resolve, delay));
      delay = Math.min(delay * 2, config.maxDelay);
    }
  }

  throw lastError;
}

// Timestamp validation and utilities
export const ISO_FORMAT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[-+]\d{2}(?::?\d{2})?|Z)?$/;
export const POSTGRES_FORMAT = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(?:\.\d+)?(?:[-+]\d{2}(?::?\d{2})?|Z)?$/;

export function isValidISODate(dateString: string): boolean {
  try {
    logger.debug('Validating timestamp', { timestamp: dateString });

    // Handle both Postgres timestamp format and ISO format
    const date = new Date(dateString);
    if (date instanceof Date && !isNaN(date.getTime())) {
      const isValidFormat = ISO_FORMAT.test(dateString) || POSTGRES_FORMAT.test(dateString);
      
      if (!isValidFormat) {
        logger.warn('Timestamp format validation failed', {
          timestamp: dateString,
          expectedFormats: ['ISO 8601', 'Postgres timestamp']
        });
      }
      
      return isValidFormat;
    }

    logger.warn('Invalid date object created from timestamp', { timestamp: dateString });
    return false;
  } catch (error) {
    logger.error('Error validating timestamp', { timestamp: dateString, error });
    return false;
  }
}

// Type guard for timestamp validation
export function isTimestamp(value: unknown): value is string {
  return typeof value === 'string' && isValidISODate(value);
}

// Normalize timestamp to ISO format
export function normalizeTimestamp(timestamp: string): string {
  try {
    const date = new Date(timestamp);
    if (!isNaN(date.getTime())) {
      return date.toISOString();
    }
    throw new Error('Invalid date');
  } catch (error) {
    logger.error('Failed to normalize timestamp', { timestamp, error });
    throw new ValidationError(`Invalid timestamp format: ${timestamp}`);
  }
}

// Generate valid timestamp
export function generateTimestamp(): string {
  return new Date().toISOString();
}

// Validation utilities
export function validateDomainAudit(
  data: unknown,
  rules: DomainAuditValidationRules = DEFAULT_VALIDATION_RULES
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    errors.push(new ValidationError('Data must be an object'));
    return { isValid: false, errors };
  }

  const audit = data as Partial<DomainAudit>;

  // Required fields validation
  for (const field of rules.required) {
    if (!(field in audit)) {
      errors.push(new ValidationError(`Missing required field`, field));
    }
  }

  // Numeric fields validation
  for (const field of rules.numeric) {
    const value = (audit as Record<string, unknown>)[field];
    if (value !== null && value !== undefined && typeof value !== 'number') {
      errors.push(new ValidationError(`Field must be a number or null`, field));
    }
  }

  // String fields validation
  for (const field of rules.string) {
    const value = (audit as Record<string, unknown>)[field];
    if (value !== null && value !== undefined && typeof value !== 'string') {
      errors.push(new ValidationError(`Field must be a string or null`, field));
    }
  }

  // Status validation
  if (audit.status && !rules.status.validValues.includes(audit.status)) {
    errors.push(
      new ValidationError(
        `Invalid status. Must be one of: ${rules.status.validValues.join(', ')}`,
        'status'
      )
    );
  }

  if (audit.enrichment_status && !rules.status.validValues.includes(audit.enrichment_status)) {
    errors.push(
      new ValidationError(
        `Invalid enrichment_status. Must be one of: ${rules.status.validValues.join(', ')}`,
        'enrichment_status'
      )
    );
  }

  // Timestamp validation with detailed logging
  const timestampFields = ['created_at', 'updated_at'];
  for (const field of timestampFields) {
    const value = (audit as Record<string, unknown>)[field];
    if (value) {
      logger.debug('Validating timestamp field', { field, value });
      
      if (!isValidISODate(value as string)) {
        logger.error('Timestamp validation failed', { field, value });
        errors.push(new ValidationError(
          `Invalid timestamp format for ${field}. Expected ISO 8601 or Postgres timestamp format`,
          field
        ));
      }
    }
  }

  // Metadata timestamp validation if present
  if (audit.metadata?.timestamp) {
    logger.debug('Validating metadata timestamp', { timestamp: audit.metadata.timestamp });
    
    if (!isValidISODate(audit.metadata.timestamp)) {
      logger.error('Metadata timestamp validation failed', { timestamp: audit.metadata.timestamp });
      errors.push(new ValidationError(
        'Invalid timestamp format in metadata. Expected ISO 8601 or Postgres timestamp format',
        'metadata.timestamp'
      ));
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Timeout utility
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  operation: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Operation ${operation} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(timeoutId));
  });
}

// Data sanitization utility
export function sanitizeDomainAudit(data: Partial<DomainAudit>): Partial<DomainAudit> {
  const sanitized = {
    ...data,
    r1_gads_health_score: data.r1_gads_health_score ? 
      Math.max(0, Math.min(100, data.r1_gads_health_score)) : null,
    r1_bounce_rate: data.r1_bounce_rate ? 
      Math.max(0, Math.min(100, data.r1_bounce_rate)) : null,
    domain: data.domain?.toLowerCase().trim()
  };

  // Normalize timestamps if present
  if (data.created_at) {
    sanitized.created_at = normalizeTimestamp(data.created_at);
  }
  if (data.updated_at) {
    sanitized.updated_at = normalizeTimestamp(data.updated_at);
  }
  if (data.metadata?.timestamp) {
    sanitized.metadata = {
      ...data.metadata,
      timestamp: normalizeTimestamp(data.metadata.timestamp)
    };
  }

  return sanitized;
}
