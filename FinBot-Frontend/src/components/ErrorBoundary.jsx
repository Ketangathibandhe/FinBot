import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
              <AlertTriangle size={32} className="text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
            <p className="text-gray-400 mb-8 text-sm">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                <RefreshCw size={18} />
                Refresh Page
              </button>
              <Link
                to="/"
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white px-6 py-3 rounded-xl font-semibold transition"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
