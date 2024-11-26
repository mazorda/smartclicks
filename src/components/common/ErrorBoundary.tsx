import React, { Component, ErrorInfo, ReactNode } from 'react';
import { sanitizeHtml } from '../../utils/inputValidation';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error securely - remove any potential PII or sensitive data
    const sanitizedError = {
      name: error.name,
      message: sanitizeHtml(error.message || ''), // Provide default empty string
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined, // Only include stack trace in development
      componentStack: sanitizeHtml(errorInfo.componentStack || ''), // Provide default empty string
      timestamp: new Date().toISOString(),
    };

    // Log to your error tracking service (e.g., Sentry)
    console.error('Caught error:', sanitizedError);

    // You might want to send this to your logging service
    // logger.error('React Error Boundary caught an error:', sanitizedError);
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <div className="max-w-md p-6 bg-white rounded-lg shadow-lg">
            <h2 className="mb-4 text-xl font-semibold text-gray-800">
              Something went wrong
            </h2>
            <p className="mb-4 text-gray-600">
              {process.env.NODE_ENV === 'development' 
                ? `Error: ${this.state.error?.message || 'Unknown error'}`
                : 'An unexpected error occurred. Please try again later.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC to wrap components with ErrorBoundary
export const withErrorBoundary = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) => {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
};

// Example usage:
/*
// Wrap individual components
const SafeComponent = withErrorBoundary(UnsafeComponent);

// Or wrap entire routes/pages
const DashboardPage = withErrorBoundary(() => (
  <div>
    <Dashboard />
    <Analytics />
  </div>
));

// Or use directly in JSX
<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>
*/
