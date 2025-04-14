
import { toast } from '@/hooks/use-toast';
import { AppError } from './baseErrors';
import { ErrorType } from './errorTypes';

export const showErrorToast = (error: AppError): void => {
  const toastProps = {
    title: getTitleByErrorType(error.type),
    description: error.message,
    variant: "destructive" as const,
    duration: 5000,
  };
  
  toast(toastProps);
};

const getTitleByErrorType = (type: ErrorType): string => {
  const errorTitles = {
    [ErrorType.AUTHENTICATION]: 'Authentication Error',
    [ErrorType.NETWORK]: 'Network Error',
    [ErrorType.API]: 'API Error',
    [ErrorType.VALIDATION]: 'Validation Error',
    [ErrorType.PERMISSION]: 'Permission Error',
    [ErrorType.UNKNOWN]: 'Unknown Error'
  };
  
  return errorTitles[type] || 'Error';
};

export const handleError = (
  error: Error | unknown,
  options: { 
    showToast?: boolean, 
    logToConsole?: boolean, 
    type?: ErrorType 
  } = {}
): AppError => {
  const { 
    showToast = true, 
    logToConsole = true, 
    type = ErrorType.UNKNOWN 
  } = options;
  
  const appError = error instanceof AppError 
    ? error 
    : new AppError(
        error instanceof Error ? error.message : 'An error occurred',
        type,
        error
      );
  
  if (showToast) {
    showErrorToast(appError);
  }
  
  if (logToConsole) {
    console.error('[AppError]', appError.getLogDetails());
  }
  
  return appError;
};
