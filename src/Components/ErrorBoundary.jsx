import { Component } from 'react';
import './ErrorBoundary.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Something went wrong' };
  }

  componentDidCatch(error) {
    // Keep console logging for debugging without crashing the whole app.
    // eslint-disable-next-line no-console
    console.error('UI crashed:', error);
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      // Reset when navigating so users can keep using the app.
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({ hasError: false, message: '' });
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="ui-error">
        <h2 className="ui-error-title">Page failed to load</h2>
        <p className="ui-error-message">{this.state.message}</p>
        <div className="ui-error-actions">
          <button type="button" className="ui-error-btn" onClick={() => window.location.reload()}>
            Reload
          </button>
          <button type="button" className="ui-error-btn secondary" onClick={() => window.location.assign('/admindashboard')}>
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

