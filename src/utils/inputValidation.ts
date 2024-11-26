import { z } from 'zod';

// Basic validation schemas
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .min(5, 'Email must be at least 5 characters')
  .max(255, 'Email must be less than 255 characters');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be less than 72 characters')
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  );

export const domainSchema = z
  .string()
  .min(4, 'Domain must be at least 4 characters')
  .max(255, 'Domain must be less than 255 characters')
  .regex(
    /^([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
    'Invalid domain format'
  );

export const urlSchema = z
  .string()
  .url('Invalid URL format')
  .max(2048, 'URL must be less than 2048 characters');

// Sanitization helpers
export const sanitizeHtml = (input: string): string => {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

export const sanitizeFilename = (filename: string): string => {
  return filename.replace(/[^a-zA-Z0-9.-]/g, '_');
};

// Input validation helper
export const validateInput = async <T>(
  schema: z.ZodType<T>,
  input: unknown
): Promise<{ data: T | null; error: string | null }> => {
  try {
    const data = await schema.parseAsync(input);
    return { data, error: null };
  } catch (err) {
    if (err instanceof z.ZodError) {
      return { data: null, error: err.errors[0].message };
    }
    if (err instanceof Error) {
      return { data: null, error: err.message };
    }
    return { data: null, error: 'Invalid input' };
  }
};

// Common validation schemas for forms
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const domainAuditFormSchema = z.object({
  domain: domainSchema,
  includeSubdomains: z.boolean().optional(),
  scanDepth: z.number().min(1).max(10).optional(),
});

export const userProfileSchema = z.object({
  name: z.string().min(2).max(100),
  company: z.string().min(2).max(100).optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format')
    .optional(),
  website: urlSchema.optional(),
});

// Type definitions for form data
export type LoginFormData = z.infer<typeof loginFormSchema>;
export type DomainAuditFormData = z.infer<typeof domainAuditFormSchema>;
export type UserProfileData = z.infer<typeof userProfileSchema>;

// Example usage:
/*
import { validateInput, loginFormSchema, type LoginFormData } from './inputValidation';

async function handleLogin(formData: unknown) {
  const { data, error } = await validateInput<LoginFormData>(loginFormSchema, formData);
  
  if (error) {
    // Handle validation error
    console.error(error);
    return;
  }
  
  // Proceed with login using validated data
  await signInWithEmail(data.email, data.password);
}
*/
