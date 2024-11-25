import {
  isValidISODate,
  isTimestamp,
  normalizeTimestamp,
  generateTimestamp,
  validateDomainAudit,
  ISO_FORMAT,
  POSTGRES_FORMAT
} from '../domainAuditUtils';
import { ValidationError } from '../../types/services';
import type { DomainAudit } from '../../types/database';

describe('Timestamp Validation', () => {
  describe('isValidISODate', () => {
    it('should validate ISO 8601 format', () => {
      const timestamp = '2024-03-27T10:30:00.000Z';
      expect(isValidISODate(timestamp)).toBe(true);
    });

    it('should validate Postgres timestamp format', () => {
      const timestamp = '2024-03-27 10:30:00+00';
      expect(isValidISODate(timestamp)).toBe(true);
    });

    it('should validate timestamps with milliseconds', () => {
      const timestamp = '2024-03-27 10:30:00.123+00';
      expect(isValidISODate(timestamp)).toBe(true);
    });

    it('should validate timestamps with timezone offsets', () => {
      const timestamps = [
        '2024-03-27T10:30:00+02:00',
        '2024-03-27 10:30:00-05:00',
        '2024-03-27T10:30:00.123+02:00',
        '2024-03-27 10:30:00.123-05:00'
      ];
      timestamps.forEach(timestamp => {
        expect(isValidISODate(timestamp)).toBe(true);
      });
    });

    it('should reject invalid formats', () => {
      const invalidTimestamps = [
        '2024-03-27', // date only
        '10:30:00', // time only
        '2024/03/27 10:30:00', // wrong separator
        '2024-03-27 25:30:00+00', // invalid hour
        '2024-03-27 10:60:00+00', // invalid minute
        'invalid date',
        '',
        null,
        undefined
      ];
      invalidTimestamps.forEach(timestamp => {
        expect(isValidISODate(timestamp as string)).toBe(false);
      });
    });
  });

  describe('isTimestamp', () => {
    it('should validate string timestamps', () => {
      const timestamp = '2024-03-27T10:30:00.000Z';
      expect(isTimestamp(timestamp)).toBe(true);
    });

    it('should reject non-string values', () => {
      const invalidValues = [
        123,
        new Date(),
        true,
        {},
        [],
        null,
        undefined
      ];
      invalidValues.forEach(value => {
        expect(isTimestamp(value)).toBe(false);
      });
    });
  });

  describe('normalizeTimestamp', () => {
    it('should normalize Postgres format to ISO', () => {
      const input = '2024-03-27 10:30:00+00';
      const normalized = normalizeTimestamp(input);
      expect(normalized).toMatch(ISO_FORMAT);
    });

    it('should preserve ISO format', () => {
      const input = '2024-03-27T10:30:00.000Z';
      const normalized = normalizeTimestamp(input);
      expect(normalized).toBe(input);
    });

    it('should throw error for invalid timestamps', () => {
      const invalidTimestamp = 'invalid date';
      expect(() => normalizeTimestamp(invalidTimestamp))
        .toThrow(ValidationError);
    });
  });

  describe('generateTimestamp', () => {
    it('should generate valid ISO timestamp', () => {
      const timestamp = generateTimestamp();
      expect(isValidISODate(timestamp)).toBe(true);
      expect(timestamp).toMatch(ISO_FORMAT);
    });
  });

  describe('validateDomainAudit', () => {
    const validAudit: Partial<DomainAudit> = {
      domain: 'example.com',
      status: 'pending',
      enrichment_status: 'pending',
      metadata: {
        source: 'test',
        timestamp: '2024-03-27T10:30:00.000Z'
      },
      created_at: '2024-03-27T10:30:00.000Z',
      updated_at: '2024-03-27T10:30:00.000Z'
    };

    it('should validate correct timestamps', () => {
      const result = validateDomainAudit(validAudit);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate Postgres format timestamps', () => {
      const audit = {
        ...validAudit,
        created_at: '2024-03-27 10:30:00+00',
        updated_at: '2024-03-27 10:30:00+00'
      };
      const result = validateDomainAudit(audit);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid timestamps', () => {
      const audit = {
        ...validAudit,
        created_at: 'invalid date'
      };
      const result = validateDomainAudit(audit);
      expect(result.isValid).toBe(false);
      const error = result.errors.find(e => e.field === 'created_at');
      expect(error).toBeDefined();
      expect(error?.message).toContain('Invalid timestamp format');
    });

    it('should validate metadata timestamp', () => {
      const audit = {
        ...validAudit,
        metadata: {
          ...validAudit.metadata,
          timestamp: '2024-03-27 10:30:00+00' // Postgres format
        }
      };
      const result = validateDomainAudit(audit);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should validate both timestamp formats in the same audit', () => {
      const audit = {
        ...validAudit,
        created_at: '2024-03-27T10:30:00.000Z', // ISO format
        updated_at: '2024-03-27 10:30:00+00',    // Postgres format
        metadata: {
          ...validAudit.metadata,
          timestamp: '2024-03-27 10:30:00.123+00' // Postgres format with ms
        }
      };
      const result = validateDomainAudit(audit);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });
  });
});
