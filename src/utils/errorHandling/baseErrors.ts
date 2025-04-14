
import { ErrorType } from './errorTypes';

export class AppError extends Error {
  type: ErrorType;
  originalError?: Error | unknown;
  context?: Record<string, unknown>;
  
  constructor(
    message: string,
    type: ErrorType = ErrorType.UNKNOWN,
    originalError?: Error | unknown,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'AppError';
    this.type = type;
    this.originalError = originalError;
    this.context = context;
  }
  
  getLogDetails() {
    return {
      type: this.type,
      message: this.message,
      stack: this.stack,
      originalError: this.originalError instanceof Error ? {
        name: this.originalError.name,
        message: this.originalError.message,
        stack: this.originalError.stack
      } : this.originalError,
      context: this.context
    };
  }
}
