import { FormEvent, useEffect, useState } from 'react';

interface WaitlistEntry {
  _id: string;
  parentName: string;
  childName: string;
  email: string;
  phone: string;
  gradeLevel: string;
  programInterests: string[];
  interests: string;
  createdAt?: string;
}

function getApiBaseUrl() {
  const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return rawBaseUrl.replace(/\/+$/, '');
}

export default function AdminDashboard() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);

  const baseUrl = getApiBaseUrl();

  const isAuthenticated = Boolean(token);

  const fetchEntries = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${baseUrl}/api/admin/waitlist`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setToken(null);
          localStorage.removeItem('adminToken');
          setError('Session expired. Please log in again.');
          return;
        }
        throw new Error('Failed to fetch entries');
      }

      const data = (await response.json()) as WaitlistEntry[];
      setEntries(data);
    } catch (err) {
      console.error('Error fetching entries', err);
      setError('Failed to load entries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchEntries();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${baseUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Invalid credentials');
          return;
        }
        throw new Error('Login failed');
      }

      const data = (await response.json()) as { token: string };
      setToken(data.token);
      localStorage.setItem('adminToken', data.token);
      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Error logging in', err);
      setError('Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('adminToken');
    setEntries([]);
  };

  const handleDownloadTxt = () => {
    if (!entries.length) return;

    const lines = entries.map((entry) => {
      const programs = entry.programInterests?.join('; ') ?? '';
      const created = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : '';
      return [
        `Parent: ${entry.parentName}`,
        `Child: ${entry.childName}`,
        `Email: ${entry.email}`,
        `Phone: ${entry.phone}`,
        `Grade: ${entry.gradeLevel}`,
        `Programs: ${programs}`,
        `Interests: ${entry.interests}`,
        `Created: ${created}`,
      ].join(' | ');
    });

    const content = lines.join('\n');

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'waitlist.txt');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 px-4 py-6 flex flex-col items-center justify-center">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }}
          className="mb-6 inline-flex items-center justify-center"
        >
          <img src="/images/logo.png" alt="Exceed logo" className="h-16 sm:h-20 w-auto" />
        </button>
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
          {error && <p className="mb-4 text-sm text-red-600 text-center">{error}</p>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ca3433]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-[#ca3433]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 px-3 text-xs font-semibold text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex justify-center px-4 py-2 rounded-full bg-[#ca3433] text-white text-sm font-semibold shadow-md hover:bg-[#b1302f] transition-colors disabled:opacity-60"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <div className="max-w-5xl mx-auto mb-6 flex items-center justify-between">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.location.href = '/';
            }
          }}
          className="inline-flex items-center gap-2"
        >
          <img src="/images/logo.png" alt="Exceed logo" className="h-9 w-auto" />
        </button>
      </div>
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Waitlist Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchEntries}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-sm font-semibold hover:bg-gray-200"
            >
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={handleDownloadTxt}
              disabled={!entries.length}
              className="inline-flex items-center px-4 py-2 rounded-full bg-[#ca3433] text-white text-sm font-semibold shadow-md hover:bg-[#b1302f] disabled:opacity-60"
            >
              Download TXT
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center px-3 py-2 rounded-full bg-gray-100 text-xs font-semibold hover:bg-gray-200"
            >
              Log out
            </button>
          </div>
        </div>

        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {!entries.length && !loading ? (
          <p className="text-sm text-gray-600">No entries yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-3 py-2">Parent</th>
                  <th className="px-3 py-2">Child</th>
                  <th className="px-3 py-2">Email</th>
                  <th className="px-3 py-2">Phone</th>
                  <th className="px-3 py-2">Grade</th>
                  <th className="px-3 py-2">Programs</th>
                  <th className="px-3 py-2">Interests</th>
                  <th className="px-3 py-2">Created</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry._id} className="border-t border-gray-100 align-top">
                    <td className="px-3 py-2 whitespace-nowrap">{entry.parentName}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{entry.childName}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{entry.email}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{entry.phone}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{entry.gradeLevel}</td>
                    <td className="px-3 py-2">
                      {entry.programInterests && entry.programInterests.length
                        ? entry.programInterests.join(', ')
                        : ''}
                    </td>
                    <td className="px-3 py-2 max-w-xs text-xs text-gray-700">
                      {entry.interests}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                      {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
