type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any>;
}

class Logger {
  private static instance: Logger;
  private readonly MAX_LOGS = 100;
  private logs: LogEntry[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, context?: Record<string, any>): LogEntry {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context
    };

    // Keep only the last MAX_LOGS entries
    this.logs = [...this.logs, entry].slice(-this.MAX_LOGS);
    
    return entry;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry = this.formatMessage(level, message, context);
    
    switch (level) {
      case 'debug':
        console.debug(`[${entry.timestamp}] DEBUG:`, message, context || '');
        break;
      case 'info':
        console.info(`[${entry.timestamp}] INFO:`, message, context || '');
        break;
      case 'warn':
        console.warn(`[${entry.timestamp}] WARN:`, message, context || '');
        break;
      case 'error':
        console.error(`[${entry.timestamp}] ERROR:`, message, context || '');
        break;
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context);
  }

  error(message: string, context?: Record<string, any>) {
    this.log('error', message, context);
  }

  getLogs(): LogEntry[] {
    return this.logs;
  }

  getLogsByLevel(level: LogLevel): LogEntry[] {
    return this.logs.filter(log => log.level === level);
  }

  clearLogs() {
    this.logs = [];
  }
}

export const logger = Logger.getInstance();
