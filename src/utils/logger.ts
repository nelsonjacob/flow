
// Define log levels for better organization
export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
  }
  
  // Colors for different log levels
  const LOG_COLORS = {
    [LogLevel.DEBUG]: '#6c757d', // gray
    [LogLevel.INFO]: '#0d6efd',  // blue
    [LogLevel.WARN]: '#ffc107',  // yellow/amber
    [LogLevel.ERROR]: '#dc3545', // red
    COMPONENT: '#20c997',        // teal for component logs
  };
  
  export const logger = {
    debug: (message: string, ...data: unknown[]) => {
      console.debug(`%c[${LogLevel.DEBUG}] ${message}`, `color: ${LOG_COLORS[LogLevel.DEBUG]}; font-weight: bold;`, ...data);
    },
    
    info: (message: string, ...data: unknown[]) => {
      console.info(`%c[${LogLevel.INFO}] ${message}`, `color: ${LOG_COLORS[LogLevel.INFO]}; font-weight: bold;`, ...data);
    },
    
    warn: (message: string, ...data: unknown[]) => {
      console.warn(`%c[${LogLevel.WARN}] ${message}`, `color: ${LOG_COLORS[LogLevel.WARN]}; font-weight: bold;`, ...data);
    },
    
    error: (message: string, ...data: unknown[]) => {
      console.error(`%c[${LogLevel.ERROR}] ${message}`, `color: ${LOG_COLORS[LogLevel.ERROR]}; font-weight: bold;`, ...data);
    },
    
    // Add a specific log type for component lifecycle
    component: (componentName: string, action: string, ...data: unknown[]) => {
      console.log(`%c[COMPONENT] ${componentName}: ${action}`, `color: ${LOG_COLORS.COMPONENT}; font-weight: bold;`, ...data);
    },
    
    // Add a log type for state changes
    state: (description: string, ...data: unknown[]) => {
      console.log(`%c[STATE] ${description}`, 'color: #9c27b0; font-weight: bold;', ...data);
    }
  };
