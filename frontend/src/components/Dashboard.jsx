import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const APP_VERSION = 'v1.0.0';
const GITHUB_REPO = 'ghostintheprompt/eye-in-the-sky';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [updateStatus, setUpdateStatus] = useState(null); // null, 'checking', 'up-to-date', 'available'

  const checkForUpdates = async (silent = false) => {
    if (!silent) setUpdateStatus('checking');
    try {
      const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`);
      const data = await response.json();
      
      if (data.tag_name && data.tag_name !== APP_VERSION) {
        setUpdateStatus('available');
        if (!silent) {
          window.open(`https://github.com/ghostintheprompt/eye-in-the-sky/releases/tag/${data.tag_name}`, '_blank');
        }
      } else {
        setUpdateStatus('up-to-date');
        if (!silent) alert('Eye in the Sky is up to date.');
      }
    } catch (error) {
      console.error('Update check failed:', error);
      if (!silent) alert('Could not reach orbit for update check.');
    }
  };

  useEffect(() => {
    // 3s delay silent check on launch
    const timer = setTimeout(() => {
      checkForUpdates(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Eye in the Sky
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => checkForUpdates(false)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {updateStatus === 'available' ? 'Update Available' : 'Check for Updates...'}
              </button>
              <div className="h-4 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-600">
                Logged in as: <span className="font-semibold">{user?.username || 'admin'}</span>
              </span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-200 text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto h-24 w-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="h-12 w-12 text-blue-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Orbit Established
          </h2>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Connection secure. Eye in the Sky is monitoring your local perimeter from the digital high ground.
          </p>
          <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100">
            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
            Authentication Service Active
          </div>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-400">
        Eye in the Sky {APP_VERSION} • Built by MDRN Corp
      </footer>
    </div>
  );
}
