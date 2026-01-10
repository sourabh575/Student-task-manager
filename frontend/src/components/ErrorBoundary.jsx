import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={styles.container}>
          <h1 style={styles.title}>Oops! Something went wrong</h1>
          <details style={styles.details}>
            <summary style={styles.summary}>Click for error details</summary>
            <p style={styles.errorMessage}>
              {this.state.error && this.state.error.toString()}
            </p>
            <pre style={styles.errorStack}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </details>
          <button onClick={this.handleReset} style={styles.button}>
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    padding: '20px'
  },
  title: {
    fontSize: '32px',
    marginBottom: '20px'
  },
  details: {
    backgroundColor: '#fecaca',
    padding: '15px',
    borderRadius: '8px',
    maxWidth: '600px',
    marginBottom: '20px'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  errorMessage: {
    marginTop: '10px',
    color: '#7f1d1d'
  },
  errorStack: {
    backgroundColor: '#7f1d1d',
    color: '#fecaca',
    padding: '10px',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '12px',
    marginTop: '10px'
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#dc2626',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px'
  }
};

export default ErrorBoundary;
