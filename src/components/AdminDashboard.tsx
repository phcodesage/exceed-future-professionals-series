import { FormEvent, useEffect, useState, useCallback } from 'react';
import {
    Users,
    Calendar,
    LogOut,
    RefreshCw,
    Download,
    Menu,
    ClipboardList,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Eye,
    EyeOff,
    Phone,
    Mail,
    BarChart3,
    Activity,
    TrendingUp,
    Globe,
    Monitor,
    Smartphone,
    Tablet,
} from 'lucide-react';

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

interface ExperienceRegistration {
    _id: string;
    fullName: string;
    emailOrContact: string;
    selectedDate: string;
    selectedTime: string;
    createdAt?: string;
}

interface AnalyticsSummary {
    realTimeVisitors: number;
    today: { visits: number; uniqueVisitors: number };
    week: { visits: number; uniqueVisitors: number };
    total: { visits: number; uniqueVisitors: number };
}

interface DailyVisit {
    date: string;
    visits: number;
    uniqueVisitors: number;
}

interface BrowserStat {
    name: string;
    count: number;
}

interface DeviceStat {
    name: string;
    count: number;
}

interface BrowserDeviceData {
    browsers: BrowserStat[];
    devices: DeviceStat[];
}

type ActiveSection = 'waitlist' | 'experience' | 'analytics';

function getApiBaseUrl() {
    const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    if (!rawBaseUrl) {
        return '';
    }
    if (!rawBaseUrl.startsWith('http://') && !rawBaseUrl.startsWith('https://')) {
        return `http://${rawBaseUrl.replace(/\/+$|\/$/, '')}`;
    }
    return rawBaseUrl.replace(/\/+$|\/$/, '');
}

// Color mapping for program tags
const programColors: Record<string, { bg: string; text: string; border: string }> = {
    'Future Doctor': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    'Future Dentist': { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' },
    'Young Chef': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    'Young Artist': { bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-200' },
    'Future Scientist': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    'Future Vet': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    'Future Pharmacist': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
    'Future Lawyer': { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Young Designer': { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
};

function getProgramColor(program: string) {
    return programColors[program] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };
}

export default function AdminDashboard() {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('adminToken'));
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [entries, setEntries] = useState<WaitlistEntry[]>([]);
    const [experienceRegistrations, setExperienceRegistrations] = useState<ExperienceRegistration[]>([]);
    const [activeSection, setActiveSection] = useState<ActiveSection>('analytics');
    const [analyticsSummary, setAnalyticsSummary] = useState<AnalyticsSummary | null>(null);
    const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([]);
    const [browserDeviceData, setBrowserDeviceData] = useState<BrowserDeviceData | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        // Start with sidebar closed on mobile
        if (typeof window !== 'undefined') {
            return window.innerWidth >= 1024;
        }
        return true;
    });

    const baseUrl = getApiBaseUrl();
    const isAuthenticated = Boolean(token);

    const fetchEntries = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/api/admin/waitlist`, {
                headers: { Authorization: `Bearer ${token}` },
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

    const fetchExperienceRegistrations = async () => {
        if (!token) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${baseUrl}/api/admin/experience-registrations`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setToken(null);
                    localStorage.removeItem('adminToken');
                    setError('Session expired. Please log in again.');
                    return;
                }
                throw new Error('Failed to fetch experience registrations');
            }

            const data = (await response.json()) as ExperienceRegistration[];
            setExperienceRegistrations(data);
        } catch (err) {
            console.error('Error fetching experience registrations', err);
            setError('Failed to load experience registrations.');
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = useCallback(async () => {
        if (!token) return;
        try {
            const [summaryRes, visitsRes, browsersRes] = await Promise.all([
                fetch(`${baseUrl}/api/admin/analytics/summary`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${baseUrl}/api/admin/analytics/visits`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
                fetch(`${baseUrl}/api/admin/analytics/browsers`, {
                    headers: { Authorization: `Bearer ${token}` },
                }),
            ]);

            if (summaryRes.ok) {
                const summaryData = await summaryRes.json();
                setAnalyticsSummary(summaryData);
            }

            if (visitsRes.ok) {
                const visitsData = await visitsRes.json();
                setDailyVisits(visitsData);
            }

            if (browsersRes.ok) {
                const browsersData = await browsersRes.json();
                setBrowserDeviceData(browsersData);
            }
        } catch (err) {
            console.error('Error fetching analytics', err);
        }
    }, [token, baseUrl]);

    useEffect(() => {
        if (token) {
            fetchEntries();
            fetchExperienceRegistrations();
            fetchAnalytics();
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
                headers: { 'Content-Type': 'application/json' },
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
        setExperienceRegistrations([]);
    };

    const handleRefresh = () => {
        if (activeSection === 'waitlist') {
            fetchEntries();
        } else if (activeSection === 'experience') {
            fetchExperienceRegistrations();
        } else {
            fetchAnalytics();
        }
    };

    // Auto-refresh analytics every 10 seconds when on analytics tab
    useEffect(() => {
        if (activeSection === 'analytics' && token) {
            const interval = setInterval(() => {
                fetchAnalytics();
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [activeSection, token, fetchAnalytics]);

    const handleDownloadWaitlistTxt = () => {
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
        downloadFile(content, 'waitlist.txt');
    };

    const handleDownloadExperienceTxt = () => {
        if (!experienceRegistrations.length) return;

        const lines = experienceRegistrations.map((reg) => {
            const created = reg.createdAt ? new Date(reg.createdAt).toLocaleString() : '';
            return [
                `Name: ${reg.fullName}`,
                `Contact: ${reg.emailOrContact}`,
                `Date: ${reg.selectedDate}`,
                `Time: ${reg.selectedTime}`,
                `Created: ${created}`,
            ].join(' | ');
        });

        const content = lines.join('\n');
        downloadFile(content, 'experience-registrations.txt');
    };

    const downloadFile = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return '—';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    // Login Screen
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0e1f3e] via-[#1a2d4f] to-[#0e1f3e] flex items-center justify-center p-4">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#ca3433]/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#ca3433]/10 rounded-full blur-3xl" />
                </div>

                <div className="relative w-full max-w-md">
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-3xl" />
                    <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
                        <button
                            type="button"
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    window.location.href = '/';
                                }
                            }}
                            className="flex items-center justify-center w-full mb-8"
                        >
                            <img src="/images/logo.png" alt="Exceed logo" className="h-20 w-auto" />
                        </button>

                        <h1 className="text-3xl font-bold text-[#0e1f3e] mb-2 text-center">Admin Portal</h1>
                        <p className="text-gray-500 text-center mb-8">Sign in to access the dashboard</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-[#0e1f3e] mb-2" htmlFor="username">
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-[#0e1f3e] focus:outline-none focus:border-[#ca3433] focus:bg-white transition-all"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-[#0e1f3e] mb-2" htmlFor="password">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        className="w-full px-4 py-3 pr-12 bg-gray-50 border-2 border-gray-200 rounded-xl text-[#0e1f3e] focus:outline-none focus:border-[#ca3433] focus:bg-white transition-all"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 px-4 flex items-center text-gray-400 hover:text-[#ca3433] transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-[#ca3433] to-[#e85653] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:from-[#b1302f] hover:to-[#ca3433] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="w-5 h-5 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    // Main Dashboard
    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? 'w-72 translate-x-0' : 'w-0 -translate-x-full'} lg:translate-x-0 ${sidebarOpen ? 'lg:w-72' : 'lg:w-20'}`}
            >
                <div className="h-screen bg-gradient-to-b from-[#0e1f3e] via-[#152847] to-[#0e1f3e] text-white flex flex-col shadow-2xl overflow-hidden">
                    {/* Logo Section */}
                    <div className="p-6 border-b border-white/10">
                        <button
                            type="button"
                            onClick={() => {
                                if (typeof window !== 'undefined') {
                                    window.location.href = '/';
                                }
                            }}
                            className="flex items-center gap-3 w-full"
                        >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg shrink-0">
                                <img src="/images/logo.png" alt="Exceed logo" className="h-8 w-8 object-contain" />
                            </div>
                            {sidebarOpen && (
                                <div className="text-left overflow-hidden">
                                    <div className="font-bold text-lg leading-tight">Exceed Admin</div>
                                    <div className="text-xs text-white/60">Dashboard</div>
                                </div>
                            )}
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-2">
                        <div className={`text-xs font-semibold text-white/40 uppercase tracking-wider mb-4 ${!sidebarOpen && 'lg:hidden'}`}>
                            Navigation
                        </div>

                        <button
                            onClick={() => { setActiveSection('waitlist'); setCurrentPage(1); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeSection === 'waitlist'
                                ? 'bg-[#ca3433] text-white shadow-lg shadow-[#ca3433]/30'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <ClipboardList className="w-5 h-5 shrink-0" />
                            {sidebarOpen && (
                                <>
                                    <span className="font-medium flex-1 text-left">Waitlist Entries</span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === 'waitlist' ? 'rotate-90' : ''}`} />
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => { setActiveSection('experience'); setCurrentPage(1); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeSection === 'experience'
                                ? 'bg-[#ca3433] text-white shadow-lg shadow-[#ca3433]/30'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <Sparkles className="w-5 h-5 shrink-0" />
                            {sidebarOpen && (
                                <>
                                    <span className="font-medium flex-1 text-left">60-Min Experience</span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === 'experience' ? 'rotate-90' : ''}`} />
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => { setActiveSection('analytics'); setCurrentPage(1); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeSection === 'analytics'
                                ? 'bg-[#ca3433] text-white shadow-lg shadow-[#ca3433]/30'
                                : 'text-white/70 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            <BarChart3 className="w-5 h-5 shrink-0" />
                            {sidebarOpen && (
                                <>
                                    <span className="font-medium flex-1 text-left">Analytics</span>
                                    <ChevronRight className={`w-4 h-4 transition-transform ${activeSection === 'analytics' ? 'rotate-90' : ''}`} />
                                </>
                            )}
                        </button>
                    </nav>

                    {/* Logout */}
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-red-500/20 hover:text-red-400 transition-all"
                        >
                            <LogOut className="w-5 h-5 shrink-0" />
                            {sidebarOpen && <span className="font-medium">Log Out</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content */}
            <main className={`flex-1 min-w-0 min-h-0 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'lg:ml-20'}`}>
                {/* Header - Fixed */}
                <header className="bg-white shadow-sm border-b border-gray-100 shrink-0 z-20">
                    <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                        {/* Left: Hamburger */}
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                        >
                            <Menu className="w-5 h-5 text-gray-600" />
                        </button>

                        {/* Center: Title */}
                        <div className="flex-1 text-center px-2">
                            <h1 className="text-base sm:text-xl font-bold text-[#0e1f3e] truncate">
                                {activeSection === 'waitlist' ? 'Waitlist Entries' : activeSection === 'experience' ? '60-Min Experience' : 'Site Analytics'}
                            </h1>
                            <p className="text-xs text-gray-500 hidden sm:block">
                                {activeSection === 'waitlist'
                                    ? 'Manage program waitlist registrations'
                                    : activeSection === 'experience'
                                        ? 'Manage experience day registrations'
                                        : 'Track visits, clicks, and real-time visitors'}
                            </p>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={handleRefresh}
                                disabled={loading}
                                className="p-2 sm:px-4 sm:py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50"
                            >
                                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            </button>
                            {activeSection !== 'analytics' && (
                                <button
                                    onClick={activeSection === 'waitlist' ? handleDownloadWaitlistTxt : handleDownloadExperienceTxt}
                                    disabled={activeSection === 'waitlist' ? !entries.length : !experienceRegistrations.length}
                                    className="p-2 sm:px-4 sm:py-2 bg-gradient-to-r from-[#ca3433] to-[#e85653] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                {/* Stats Cards - Fixed */}
                <div className="p-4 sm:p-6 pb-0 shrink-0 bg-gray-50">
                    {error && (
                        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold text-[#0e1f3e]">{entries.length}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">Waitlist</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold text-[#0e1f3e]">{experienceRegistrations.length}</div>
                                    <div className="text-xs sm:text-sm text-gray-500">Experience</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold text-[#0e1f3e]">
                                        {entries.length + experienceRegistrations.length}
                                    </div>
                                    <div className="text-xs sm:text-sm text-gray-500">Total</div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-[#ca3433] to-[#e85653] rounded-2xl p-4 sm:p-6 shadow-lg text-white">
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <ClipboardList className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                                <div>
                                    <div className="text-xl sm:text-2xl font-bold">Active</div>
                                    <div className="text-xs sm:text-sm text-white/80">Programs: 2</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Data Display - Full Height with Pagination */}
                <div className="flex-1 flex flex-col min-h-0 p-4 sm:p-6 pt-4">
                    {(() => {
                        // Pagination logic
                        const currentData = activeSection === 'waitlist' ? entries : experienceRegistrations;
                        const totalItems = currentData.length;
                        const totalPages = Math.ceil(totalItems / itemsPerPage);
                        const startIndex = (currentPage - 1) * itemsPerPage;
                        const endIndex = startIndex + itemsPerPage;
                        const paginatedEntries = entries.slice(startIndex, endIndex);
                        const paginatedExperience = experienceRegistrations.slice(startIndex, endIndex);

                        return (
                            <>
                                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto min-h-0">
                                    {activeSection === 'analytics' ? (
                                        /* Analytics Section */
                                        <div className="p-6 space-y-6">
                                            {/* Real-time Visitors Banner */}
                                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative">
                                                            <div className="w-4 h-4 bg-white rounded-full animate-ping absolute" />
                                                            <div className="w-4 h-4 bg-white rounded-full relative" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-white/80">Real-time Visitors</div>
                                                            <div className="text-4xl font-bold">{analyticsSummary?.realTimeVisitors ?? 0}</div>
                                                        </div>
                                                    </div>
                                                    <Activity className="w-12 h-12 text-white/30" />
                                                </div>
                                                <div className="mt-3 text-sm text-white/70">
                                                    Active in the last 5 minutes • Auto-refreshes every 10s
                                                </div>
                                            </div>

                                            {/* Stats Grid */}
                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                                                {/* Today's Visits */}
                                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                            <Eye className="w-5 h-5 text-blue-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-500">Today's Views</span>
                                                    </div>
                                                    <div className="text-3xl font-bold text-[#0e1f3e]">{analyticsSummary?.today.visits ?? 0}</div>
                                                </div>

                                                {/* Today's Unique */}
                                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                            <Users className="w-5 h-5 text-purple-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-500">Unique Today</span>
                                                    </div>
                                                    <div className="text-3xl font-bold text-[#0e1f3e]">{analyticsSummary?.today.uniqueVisitors ?? 0}</div>
                                                </div>

                                                {/* Week's Views */}
                                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                                            <TrendingUp className="w-5 h-5 text-orange-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-500">This Week</span>
                                                    </div>
                                                    <div className="text-3xl font-bold text-[#0e1f3e]">{analyticsSummary?.week.visits ?? 0}</div>
                                                </div>

                                                {/* Total All-time */}
                                                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                            <Globe className="w-5 h-5 text-green-600" />
                                                        </div>
                                                        <span className="text-sm font-medium text-gray-500">All-time</span>
                                                    </div>
                                                    <div className="text-3xl font-bold text-[#0e1f3e]">{analyticsSummary?.total.visits ?? 0}</div>
                                                </div>
                                            </div>

                                            {/* Weekly Chart */}
                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                                <h3 className="text-lg font-bold text-[#0e1f3e] mb-4 flex items-center gap-2">
                                                    <BarChart3 className="w-5 h-5 text-[#ca3433]" />
                                                    Last 7 Days
                                                </h3>
                                                {dailyVisits.length > 0 ? (
                                                    <div className="flex items-end gap-2 h-40">
                                                        {dailyVisits.map((day, index) => {
                                                            const maxVisits = Math.max(...dailyVisits.map(d => d.visits), 1);
                                                            const heightPercent = (day.visits / maxVisits) * 100;
                                                            const date = new Date(day.date);
                                                            const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
                                                            return (
                                                                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                                                                    <div className="text-xs font-semibold text-[#0e1f3e]">{day.visits}</div>
                                                                    <div
                                                                        className="w-full bg-gradient-to-t from-[#ca3433] to-[#e85653] rounded-t-lg transition-all hover:from-[#b1302f] hover:to-[#ca3433]"
                                                                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                                                                    />
                                                                    <div className="text-xs text-gray-500">{dayName}</div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="h-40 flex items-center justify-center text-gray-400">
                                                        <div className="text-center">
                                                            <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                                                            <p>No visit data yet</p>
                                                            <p className="text-sm">Data will appear as visitors come</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Browser & Device Breakdown */}
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                {/* Browsers */}
                                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                                    <h3 className="text-lg font-bold text-[#0e1f3e] mb-4">Browsers</h3>
                                                    {browserDeviceData && browserDeviceData.browsers.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {browserDeviceData.browsers.map((browser, index) => {
                                                                const total = browserDeviceData.browsers.reduce((sum, b) => sum + b.count, 0);
                                                                const percentage = ((browser.count / total) * 100).toFixed(1);
                                                                const getBrowserIcon = (name: string) => {
                                                                    switch (name) {
                                                                        case 'Chrome': return '🌐';
                                                                        case 'Safari': return '🧭';
                                                                        case 'Firefox': return '🦊';
                                                                        case 'Edge': return '🌊';
                                                                        default: return '🌍';
                                                                    }
                                                                };
                                                                return (
                                                                    <div key={index} className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            <span className="text-xl">{getBrowserIcon(browser.name)}</span>
                                                                            <span className="font-medium text-gray-700">{browser.name}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="text-sm text-gray-500">{percentage}%</div>
                                                                            <div className="font-bold text-[#0e1f3e]">{browser.count}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-gray-400 py-4">No browser data yet</div>
                                                    )}
                                                </div>

                                                {/* Devices */}
                                                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                                    <h3 className="text-lg font-bold text-[#0e1f3e] mb-4">Devices</h3>
                                                    {browserDeviceData && browserDeviceData.devices.length > 0 ? (
                                                        <div className="space-y-3">
                                                            {browserDeviceData.devices.map((device, index) => {
                                                                const total = browserDeviceData.devices.reduce((sum, d) => sum + d.count, 0);
                                                                const percentage = ((device.count / total) * 100).toFixed(1);
                                                                const getDeviceIcon = (name: string) => {
                                                                    switch (name) {
                                                                        case 'Desktop': return <Monitor className="w-5 h-5 text-blue-600" />;
                                                                        case 'Mobile': return <Smartphone className="w-5 h-5 text-green-600" />;
                                                                        case 'Tablet': return <Tablet className="w-5 h-5 text-purple-600" />;
                                                                        default: return <Monitor className="w-5 h-5 text-gray-600" />;
                                                                    }
                                                                };
                                                                return (
                                                                    <div key={index} className="flex items-center justify-between">
                                                                        <div className="flex items-center gap-2">
                                                                            {getDeviceIcon(device.name)}
                                                                            <span className="font-medium text-gray-700">{device.name}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="text-sm text-gray-500">{percentage}%</div>
                                                                            <div className="font-bold text-[#0e1f3e]">{device.count}</div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    ) : (
                                                        <div className="text-center text-gray-400 py-4">No device data yet</div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Summary Stats */}
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="bg-[#0e1f3e] rounded-xl p-5 text-white">
                                                    <div className="text-sm text-white/70 mb-1">Total Unique Visitors</div>
                                                    <div className="text-3xl font-bold">{analyticsSummary?.total.uniqueVisitors ?? 0}</div>
                                                </div>
                                                <div className="bg-gradient-to-r from-[#ca3433] to-[#e85653] rounded-xl p-5 text-white">
                                                    <div className="text-sm text-white/70 mb-1">Unique This Week</div>
                                                    <div className="text-3xl font-bold">{analyticsSummary?.week.uniqueVisitors ?? 0}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : activeSection === 'waitlist' ? (
                                        <>
                                            {!entries.length && !loading ? (
                                                <div className="p-12 text-center">
                                                    <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <p className="text-gray-500 text-lg">No waitlist entries yet</p>
                                                    <p className="text-gray-400 text-sm mt-2">Entries will appear here when users sign up</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Mobile Card View */}
                                                    <div className="md:hidden divide-y divide-gray-100">
                                                        {paginatedEntries.map((entry) => (
                                                            <div key={entry._id} className="p-4 space-y-3">
                                                                <div className="flex items-start justify-between">
                                                                    <div>
                                                                        <div className="font-semibold text-[#0e1f3e]">{entry.parentName}</div>
                                                                        <div className="text-sm text-gray-500">Child: {entry.childName}</div>
                                                                    </div>
                                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#0e1f3e] text-white">
                                                                        Grade {entry.gradeLevel}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                                    <span className="truncate">{entry.email}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <Phone className="w-4 h-4 text-gray-400" />
                                                                    <span>{entry.phone}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-1">
                                                                    {entry.programInterests?.map((program, i) => {
                                                                        const colors = getProgramColor(program);
                                                                        return (
                                                                            <span
                                                                                key={i}
                                                                                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
                                                                            >
                                                                                {program}
                                                                            </span>
                                                                        );
                                                                    })}
                                                                </div>
                                                                <div className="text-xs text-gray-400">
                                                                    Registered: {formatDate(entry.createdAt)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Desktop Table View */}
                                                    <div className="hidden md:block">
                                                        <table className="w-full">
                                                            <thead className="sticky top-0 z-10">
                                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Parent</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Child</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Grade</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Programs</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {paginatedEntries.map((entry, index) => (
                                                                    <tr
                                                                        key={entry._id}
                                                                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                                                    >
                                                                        <td className="px-6 py-4">
                                                                            <div className="font-medium text-[#0e1f3e]">{entry.parentName}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <div className="text-gray-700">{entry.childName}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <div className="text-sm text-gray-600">{entry.email}</div>
                                                                            <div className="text-xs text-gray-400">{entry.phone}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0e1f3e] text-white">
                                                                                {entry.gradeLevel}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <div className="flex flex-wrap gap-1 max-w-xs">
                                                                                {entry.programInterests?.map((program, i) => {
                                                                                    const colors = getProgramColor(program);
                                                                                    return (
                                                                                        <span
                                                                                            key={i}
                                                                                            className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border}`}
                                                                                        >
                                                                                            {program}
                                                                                        </span>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                                            {formatDate(entry.createdAt)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <>
                                            {!experienceRegistrations.length && !loading ? (
                                                <div className="p-12 text-center">
                                                    <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <p className="text-gray-500 text-lg">No experience registrations yet</p>
                                                    <p className="text-gray-400 text-sm mt-2">Registrations will appear here when users sign up</p>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Mobile Card View */}
                                                    <div className="md:hidden divide-y divide-gray-100">
                                                        {paginatedExperience.map((reg) => (
                                                            <div key={reg._id} className="p-4 space-y-3">
                                                                <div className="flex items-start justify-between">
                                                                    <div className="font-semibold text-[#0e1f3e]">{reg.fullName}</div>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                    <Mail className="w-4 h-4 text-gray-400" />
                                                                    <span className="truncate">{reg.emailOrContact}</span>
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-[#ca3433] to-[#e85653] text-white">
                                                                        <Calendar className="w-3 h-3" />
                                                                        {reg.selectedDate}
                                                                    </span>
                                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#0e1f3e] text-white">
                                                                        {reg.selectedTime}
                                                                    </span>
                                                                </div>
                                                                <div className="text-xs text-gray-400">
                                                                    Registered: {formatDate(reg.createdAt)}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* Desktop Table View */}
                                                    <div className="hidden md:block">
                                                        <table className="w-full">
                                                            <thead className="sticky top-0 z-10">
                                                                <tr className="bg-gray-50 border-b border-gray-100">
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Selected Date</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Time Slot</th>
                                                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Registered</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody className="divide-y divide-gray-100">
                                                                {paginatedExperience.map((reg, index) => (
                                                                    <tr
                                                                        key={reg._id}
                                                                        className={`hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                                                                    >
                                                                        <td className="px-6 py-4">
                                                                            <div className="font-medium text-[#0e1f3e]">{reg.fullName}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <div className="text-gray-700">{reg.emailOrContact}</div>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-[#ca3433] to-[#e85653] text-white">
                                                                                <Calendar className="w-3 h-3" />
                                                                                {reg.selectedDate}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4">
                                                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#0e1f3e] text-white">
                                                                                {reg.selectedTime}
                                                                            </span>
                                                                        </td>
                                                                        <td className="px-6 py-4 text-sm text-gray-500">
                                                                            {formatDate(reg.createdAt)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    )}
                                </div>

                                {/* Pagination Footer */}
                                {totalItems > 0 && (
                                    <div className="mt-4 bg-white rounded-xl shadow-sm border border-gray-100 px-4 py-3 flex items-center justify-between">
                                        <div className="text-sm text-gray-600">
                                            Showing <span className="font-semibold text-[#0e1f3e]">{startIndex + 1}</span> to{' '}
                                            <span className="font-semibold text-[#0e1f3e]">{Math.min(endIndex, totalItems)}</span> of{' '}
                                            <span className="font-semibold text-[#0e1f3e]">{totalItems}</span> items
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                                disabled={currentPage === 1}
                                                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Previous
                                            </button>
                                            <span className="px-3 py-2 text-sm font-medium text-[#0e1f3e] bg-gray-50 rounded-lg">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                                disabled={currentPage === totalPages}
                                                className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#ca3433] to-[#e85653] rounded-lg hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        );
                    })()}
                </div>
            </main>
        </div>
    );
}
