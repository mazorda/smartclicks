interface EnvVar {
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean';
}

const requiredEnvVars: EnvVar[] = [
  { name: 'VITE_SUPABASE_URL', required: true, type: 'string' },
  { name: 'VITE_SUPABASE_ANON_KEY', required: true, type: 'string' },
  { name: 'VITE_APP_URL', required: true, type: 'string' },
  { name: 'VITE_ANALYTICS_ID', required: false, type: 'string' },
  { name: 'VITE_DOMAIN_API_KEY', required: false, type: 'string' },
  { name: 'VITE_MEETING_SCHEDULER_API', required: false, type: 'string' },
];

export function validateEnvVars(): void {
  const errors: string[] = [];

  requiredEnvVars.forEach((envVar) => {
    const value = import.meta.env[envVar.name];

    // Check if required variables are present
    if (envVar.required && !value) {
      errors.push(`Missing required environment variable: ${envVar.name}`);
      return;
    }

    // Skip type checking if value is not present and not required
    if (!value && !envVar.required) {
      return;
    }

    // Type checking
    switch (envVar.type) {
      case 'number':
        if (isNaN(Number(value))) {
          errors.push(`Environment variable ${envVar.name} must be a number`);
        }
        break;
      case 'boolean':
        if (typeof value !== 'boolean' && value !== 'true' && value !== 'false') {
          errors.push(`Environment variable ${envVar.name} must be a boolean`);
        }
        break;
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`Environment variable ${envVar.name} must be a string`);
        }
        break;
    }
  });

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }
}

// Type definitions for environment variables
declare global {
  interface ImportMetaEnv {
    VITE_SUPABASE_URL: string;
    VITE_SUPABASE_ANON_KEY: string;
    VITE_APP_URL: string;
    VITE_ANALYTICS_ID?: string;
    VITE_DOMAIN_API_KEY?: string;
    VITE_MEETING_SCHEDULER_API?: string;
  }
}

export function getEnvVar(name: keyof ImportMetaEnv): string {
  const value = import.meta.env[name];
  if (!value && requiredEnvVars.find(v => v.name === name)?.required) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}
