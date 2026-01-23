import { X, Calendar, Sparkles, Clock, MapPin, CheckCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import WaitlistForm from './components/WaitlistForm';
import AdminDashboard from './components/AdminDashboard';
import { programs } from './programsData';


function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<(typeof programs)[0] | null>(null);
  const [showExperiencePopup, setShowExperiencePopup] = useState(false);

  // Experience registration form state
  const [experienceSelection, setExperienceSelection] = useState<{ date: string; time: string } | null>(null);
  const [expFormData, setExpFormData] = useState({ fullName: '', emailOrContact: '' });
  const [expFormStatus, setExpFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [expFormError, setExpFormError] = useState('');

  useEffect(() => {
    const updateRoute = () => {
      if (typeof window !== 'undefined') {
        const { pathname, hash } = window.location;
        setIsAdminRoute(pathname.startsWith('/admin') || hash.startsWith('#/admin'));
      }
    };

    updateRoute();

    const lenis = new Lenis({
      lerp: 0.12,
      smoothWheel: true,
    });

    const onRaf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(onRaf);
    };

    requestAnimationFrame(onRaf);

    window.addEventListener('hashchange', updateRoute);
    window.addEventListener('popstate', updateRoute);

    // Store lenis instance on window for access in other effects
    (window as any).lenisInstance = lenis;

    return () => {
      window.removeEventListener('hashchange', updateRoute);
      window.removeEventListener('popstate', updateRoute);
      lenis.destroy();
      delete (window as any).lenisInstance;
    };
  }, []);

  // Analytics Tracking
  useEffect(() => {
    // Don't track admin routes
    if (isAdminRoute) return;

    // Generate or retrieve session ID
    let sessionId = localStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('analytics_session_id', sessionId);
    }

    const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const baseUrl = (rawBaseUrl.startsWith('http') ? rawBaseUrl : `http://${rawBaseUrl}`).replace(/\/$/, '');

    const trackVisit = async () => {
      try {
        await fetch(`${baseUrl}/api/analytics/track`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            page: window.location.pathname + window.location.hash,
            referrer: document.referrer,
            userAgent: navigator.userAgent,
          }),
        });
      } catch (err) {
        // Silently fail - analytics shouldn't break the app
        console.debug('Analytics tracking failed:', err);
      }
    };

    // Track initial page load
    trackVisit();

    // Heartbeat every 30 seconds to maintain "real-time" status
    const heartbeatInterval = setInterval(trackVisit, 30000);

    // Track hash changes (SPA navigation)
    const handleHashChange = () => trackVisit();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isAdminRoute]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProgram || showExperiencePopup) {
      // Stop Lenis smooth scroll
      const lenis = (window as any).lenisInstance;
      if (lenis) {
        lenis.stop();
      }
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    } else {
      // Resume Lenis smooth scroll
      const lenis = (window as any).lenisInstance;
      if (lenis) {
        lenis.start();
      }
      // Restore body scroll
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedProgram, showExperiencePopup]);

  if (isAdminRoute) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#ffe8f0] via-[#fff7e5] to-white text-[#0e1f3e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <header className="mb-20" id="hero">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center mb-5 rounded-full bg-white/70 px-5 py-2 text-sm sm:text-base font-semibold text-[#ca3433] shadow-sm">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[#ca3433]" />
                Big dreams for little professionals
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-6 mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl rotate-3 shadow-lg overflow-hidden">
                  <img
                    src="/images/logo.png"
                    alt="Exceed logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-3">
                    Exceed&apos;s Future
                    <span className="block text-[#ca3433]">Professionals Series</span>
                  </h1>
                  <p className="text-base sm:text-lg text-[#1f2a4d]/80 max-w-xl">
                    Fun, career-inspired adventures for curious kids in K-6 coming soon.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-5">
                <a
                  href="#about"
                  className="inline-flex items-center justify-center px-10 py-4 rounded-full bg-[#ca3433] text-white text-lg sm:text-xl font-bold shadow-lg hover:bg-[#b1302f] transition-colors"
                >
                  Register Now
                </a>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md">
              <div className="rounded-3xl bg-white/70 shadow-xl overflow-hidden">
                <img
                  src="/images/kids-group.png"
                  alt="Kids exploring future careers together"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        <main className="space-y-20">
          {/* FREE Experience Day Section - First/Top */}
          <section id="experience-day" className="relative">
            <div className="bg-gradient-to-r from-[#ca3433] via-[#d94140] to-[#e85653] rounded-3xl shadow-2xl p-8 sm:p-12 max-w-4xl mx-auto text-white overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

              <div className="relative z-10">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                  <span className="inline-block bg-yellow-400 text-[#0e1f3e] text-sm font-bold px-4 py-1 rounded-full uppercase tracking-wide">
                    FREE Event
                  </span>
                  <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                </div>

                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-center mb-4">
                  Future Professionals<br />
                  <span className="text-yellow-300">60-Minute Experience</span>
                </h2>

                <p className="text-lg sm:text-xl text-white/90 text-center max-w-2xl mx-auto mb-6">
                  Come experience what it means to be a <strong>Future Doctor</strong> or <strong>Future Dentist</strong>!
                  Kids dive into exciting hands-on activities while parents learn more about our programs.
                </p>

                <div className="flex flex-wrap justify-center gap-4 mb-8 text-sm sm:text-base">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Calendar className="w-5 h-5" />
                    <span>Jan 18, 19 & Feb 8</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <Clock className="w-5 h-5" />
                    <span>10:00 AM & 12:00 PM</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    <MapPin className="w-5 h-5" />
                    <span>Exceed Academy</span>
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    onClick={() => setShowExperiencePopup(true)}
                    className="group inline-flex items-center gap-3 px-10 py-4 bg-white text-[#ca3433] text-lg sm:text-xl font-bold rounded-full shadow-lg hover:bg-yellow-300 hover:text-[#0e1f3e] transition-all hover:scale-105 hover:shadow-xl"
                  >
                    <span>Join for FREE</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section id="about">
            <div className="bg-white rounded-3xl shadow-xl p-10 sm:p-12 lg:p-14 max-w-4xl mx-auto">
              <h2 className="text-4xl font-bold text-[#0e1f3e] mb-8 text-center">
                Discover Your Future Career Potential
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                This program helps children discover their future career potential by providing fun,
                hands-on, and immersive experiences that answer the question:
                <span className="font-semibold text-[#ca3433]"> "Who do you want to be when you grow up?"</span>
              </p>
              <p className="text-xl text-gray-700 leading-relaxed mb-10">
                Through engaging activities like role-playing, guest speaker sessions, and interactive projects,
                young students get an early, tangible sense of what different professions involve. The goal is to
                spark curiosity, connect their school subjects to real-world jobs, and build a foundational
                self-awareness of their interests, talents, and values. By experiencing a variety of careers at
                a young age, children can gain clarity and confidence in understanding the possibilities for their future.
              </p>

              {/* Active Programs - Doctor and Dentist */}
              <div className="mb-12">
                <h3 className="text-3xl font-bold text-[#ca3433] mb-6 text-center">Now Enrolling</h3>
                <div className="grid grid-cols-2 gap-5">
                  {programs.filter(p => p.id === 'doctor' || p.id === 'dentist').map((program) => {
                    const Icon = program.icon;
                    return (
                      <div
                        key={program.name}
                        onClick={() => setSelectedProgram(program)}
                        className="group flex flex-col items-center p-6 bg-[#f7e0e0] rounded-2xl hover:shadow-lg transition-all cursor-pointer hover:bg-[#ca3433] hover:text-white hover:-translate-y-1"
                      >
                        <Icon className="w-16 h-16 text-[#ca3433] mb-3 group-hover:text-white transition-colors" />
                        <span className="text-base sm:text-lg font-semibold text-[#0e1f3e] text-center group-hover:text-white transition-colors">
                          {program.name}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-600 mt-2 group-hover:text-white/90 transition-colors">
                          Register Now
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="bg-[#f7e0e0] rounded-2xl p-7 text-center">
                  <div className="text-5xl font-bold text-[#ca3433] mb-2">K-6</div>
                  <div className="text-base font-semibold text-[#0e1f3e]">Ages</div>
                </div>
                <div className="bg-[#f7e0e0] rounded-2xl p-7 text-center">
                  <div className="text-3xl font-bold text-[#ca3433] mb-2">Taught by</div>
                  <div className="text-base font-semibold text-[#0e1f3e]">Professionals</div>
                </div>
                <div className="bg-[#f7e0e0] rounded-2xl p-7 text-center">
                  <div className="text-3xl font-bold text-[#ca3433] mb-2">Hands-On</div>
                  <div className="text-base font-semibold text-[#0e1f3e]">Learning</div>
                </div>
              </div>

              {/* March 2026 Programs - Chef and Artist */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#0e1f3e] mb-2 text-center">March 2026 Programs</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  Interested in these programs? Join the waitlist to be notified!
                </p>
                <div className="grid grid-cols-2 gap-5 mb-6">
                  {programs.filter(p => p.id === 'chef' || p.id === 'artist').map((program) => {
                    const Icon = program.icon;
                    return (
                      <div
                        key={program.name}
                        onClick={() => setSelectedProgram(program)}
                        className="group flex flex-col items-center p-5 bg-[#fff7e5] border-2 border-[#ffe0b2] rounded-2xl hover:shadow-lg transition-all cursor-pointer hover:bg-[#ffe0b2] hover:-translate-y-1"
                      >
                        <Icon className="w-12 h-12 text-[#ca3433] mb-2 group-hover:text-[#b1302f] transition-colors" />
                        <span className="text-sm sm:text-base font-semibold text-[#0e1f3e] text-center">
                          {program.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Coming Soon Programs */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-400 mb-2 text-center">Coming Soon</h3>
                <p className="text-sm text-gray-500 mb-4 text-center">
                  More exciting programs are on the way!
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {programs.filter(p => p.id !== 'doctor' && p.id !== 'dentist' && p.id !== 'chef' && p.id !== 'artist').map((program) => {
                    const Icon = program.icon;
                    return (
                      <div
                        key={program.name}
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl opacity-60"
                      >
                        <Icon className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-xs sm:text-sm font-semibold text-gray-500 text-center">
                          {program.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Waitlist Form */}
              <div>
                <WaitlistForm />
              </div>
            </div>
          </section>
        </main>

        <footer className="mt-12 text-center text-gray-600 text-base">
          <p>&copy; 2025 Exceed&apos;s Future Professionals Series. All rights reserved.</p>
        </footer>
      </div>

      {/* Syllabus Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProgram(null)}>
          <div
            className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 overscroll-y-contain"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#f7e0e0] rounded-xl">
                  <selectedProgram.icon className="w-8 h-8 text-[#ca3433]" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-[#0e1f3e]">{selectedProgram.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProgram(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 sm:p-10">
              {/* Registration Buttons at Top for Doctor/Dentist */}
              {(selectedProgram.id === 'doctor' || selectedProgram.id === 'dentist') && (
                <div className="mb-8 p-6 bg-gradient-to-r from-[#f7e0e0] to-[#fff7e5] rounded-2xl">
                  <h4 className="text-lg font-bold text-[#0e1f3e] mb-4 text-center">Ready to Register?</h4>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <a
                      href="https://buy.stripe.com/14A14g8Gg47Uc0hgJ5dfG07"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 bg-[#ca3433] text-white font-semibold rounded-full shadow-md hover:bg-[#b1302f] transition-colors text-center"
                    >
                      {selectedProgram.content && selectedProgram.content.length > 1 ? 'Register for Semester 1' : 'Register Now'}
                    </a>
                    {selectedProgram.content && selectedProgram.content.length > 1 && (
                      <a
                        href="https://buy.stripe.com/3cI00c7Cc33Q1lDboLdfG09"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-[#0e1f3e] text-white font-semibold rounded-full shadow-md hover:bg-[#1f2a4d] transition-colors text-center"
                      >
                        Register for Both Semesters
                      </a>
                    )}
                  </div>
                </div>
              )}

              {selectedProgram.hasSyllabus && selectedProgram.content ? (
                <div className="space-y-12">
                  {selectedProgram.content.map((part, index) => (
                    <div key={index} className="space-y-6">
                      <h4 className="text-2xl font-bold text-[#ca3433] border-b border-[#ca3433]/20 pb-2">
                        {part.title}
                      </h4>

                      {/* Schedules */}
                      <div className="grid md:grid-cols-2 gap-6">
                        {part.schedules.map((schedule, sIndex) => (
                          <div key={sIndex} className="bg-[#fff7e5] rounded-xl p-5 border border-[#ffe0b2]">
                            <div className="text-lg font-bold text-[#0e1f3e] mb-3 flex items-center gap-2">
                              <span className="bg-[#ca3433] text-white text-xs px-2 py-1 rounded-md">Grades {schedule.grades}</span>
                            </div>
                            <div className="space-y-3">
                              {schedule.options.map((opt, oIndex) => (
                                <div key={oIndex} className="flex justify-between text-sm sm:text-base">
                                  <span className="font-semibold text-gray-700">{opt.label}:</span>
                                  <div className="text-right">
                                    <div className="font-medium text-[#0e1f3e]">{opt.time}</div>
                                    <div className="text-gray-500 text-xs">{opt.dates}</div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Weekly Syllabus */}
                      <div className="bg-gray-50 rounded-2xl p-6 sm:p-8">
                        <h5 className="text-lg font-bold text-[#0e1f3e] mb-4">Syllabus</h5>
                        <div className="grid gap-4">
                          {part.syllabus.map((week, wIndex) => (
                            <div key={wIndex} className="flex gap-4 p-3 hover:bg-white hover:shadow-sm rounded-lg transition-all">
                              <div className="shrink-0 w-20 font-bold text-[#ca3433]">{week.week}</div>
                              <div>
                                <div className="font-bold text-[#0e1f3e]">{week.title}</div>
                                {week.desc && <div className="text-gray-600 text-sm mt-1">{week.desc}</div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ceremony */}
                      {part.ceremony && (
                        <div className="bg-[#f7e0e0] text-[#ca3433] p-4 rounded-xl text-center font-bold">
                          🎉 {part.ceremony}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="inline-block p-6 bg-gray-50 rounded-full mb-4">
                    <selectedProgram.icon className="w-16 h-16 text-gray-300" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-400">Syllabus Coming Soon</h4>
                  <p className="text-gray-500 mt-2">We are finalizing the exciting details for this program!</p>
                </div>
              )}

              {/* Videos Section - At Bottom */}
              {selectedProgram.videos && selectedProgram.videos.length > 0 && (
                <div className="mt-10">
                  <h4 className="text-2xl font-bold text-[#0e1f3e] mb-6">Kids in Action</h4>
                  <div className="grid grid-cols-1 gap-6">
                    {selectedProgram.videos.map((video, index) => (
                      <div
                        key={index}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#ffe0e7] via-[#fff3c9] to-[#e0f3ff] border border-white shadow-md group aspect-[9/16] max-w-sm mx-auto"
                      >
                        <video
                          src={video}
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-4">
              {/* Show waitlist button for Chef/Artist programs */}
              {(selectedProgram.id === 'chef' || selectedProgram.id === 'artist') && (
                <button
                  onClick={() => {
                    setSelectedProgram(null);
                    document.getElementById('join')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-8 py-3 bg-[#ca3433] text-white font-semibold rounded-full shadow-md hover:bg-[#b1302f] transition-colors"
                >
                  Join Waitlist for This Program
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Experience Day Popup Modal */}
      {showExperiencePopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => {
          setShowExperiencePopup(false);
          setExperienceSelection(null);
          setExpFormData({ fullName: '', emailOrContact: '' });
          setExpFormStatus('idle');
          setExpFormError('');
        }}>
          <div
            className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#ca3433] via-[#d94140] to-[#e85653] p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-5 h-5 text-yellow-300" />
                    <span className="text-sm font-semibold bg-yellow-400 text-[#0e1f3e] px-3 py-0.5 rounded-full">FREE</span>
                  </div>
                  <h3 className="text-2xl font-bold">60-Minute Experience</h3>
                  <p className="text-white/80 text-sm mt-1">
                    {expFormStatus === 'success'
                      ? 'Registration complete!'
                      : experienceSelection
                        ? 'Complete your registration'
                        : 'Choose your preferred date & time'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowExperiencePopup(false);
                    setExperienceSelection(null);
                    setExpFormData({ fullName: '', emailOrContact: '' });
                    setExpFormStatus('idle');
                    setExpFormError('');
                  }}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Success State */}
              {expFormStatus === 'success' ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h4 className="text-2xl font-bold text-[#0e1f3e] mb-2">You&apos;re Registered!</h4>
                  <p className="text-gray-600 mb-4">
                    We've received your registration for the 60-minute experience on:
                  </p>
                  <div className="inline-block bg-[#fff7e5] rounded-xl px-6 py-3 mb-6">
                    <div className="font-bold text-[#ca3433]">{experienceSelection?.date}</div>
                    <div className="text-[#0e1f3e]">{experienceSelection?.time}</div>
                  </div>
                  <p className="text-sm text-gray-500">
                    We'll be in touch soon with more details!
                  </p>
                  <button
                    onClick={() => {
                      setShowExperiencePopup(false);
                      setExperienceSelection(null);
                      setExpFormData({ fullName: '', emailOrContact: '' });
                      setExpFormStatus('idle');
                    }}
                    className="mt-6 px-8 py-3 bg-[#ca3433] text-white font-semibold rounded-full hover:bg-[#b1302f] transition-colors"
                  >
                    Done
                  </button>
                </div>
              ) : experienceSelection ? (
                /* Registration Form */
                <div>
                  {/* Back Button */}
                  <button
                    onClick={() => setExperienceSelection(null)}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#ca3433] mb-4 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span className="text-sm">Change date/time</span>
                  </button>

                  {/* Selected Date/Time Display */}
                  <div className="bg-[#fff7e5] rounded-2xl p-4 mb-6 border-2 border-[#ca3433]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#ca3433] rounded-lg">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Your selected session</div>
                        <div className="font-bold text-[#0e1f3e]">{experienceSelection.date}</div>
                        <div className="text-[#ca3433] font-semibold">{experienceSelection.time}</div>
                      </div>
                    </div>
                  </div>

                  {/* Form Fields */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setExpFormStatus('loading');
                      setExpFormError('');

                      try {
                        // Get API URL from environment
                        const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
                        const baseUrl = (rawBaseUrl.startsWith('http') ? rawBaseUrl : `http://${rawBaseUrl}`).replace(/\/$/, '');

                        const response = await fetch(`${baseUrl}/api/experience-registration`, {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            fullName: expFormData.fullName,
                            emailOrContact: expFormData.emailOrContact,
                            selectedDate: experienceSelection.date,
                            selectedTime: experienceSelection.time,
                          }),
                        });

                        if (!response.ok) {
                          const data = await response.json();
                          throw new Error(data.message || 'Something went wrong');
                        }

                        setExpFormStatus('success');
                      } catch (err) {
                        setExpFormStatus('error');
                        setExpFormError(err instanceof Error ? err.message : 'Something went wrong');
                      }
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold text-[#0e1f3e] mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={expFormData.fullName}
                        onChange={(e) => setExpFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ca3433] focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#0e1f3e] mb-2">
                        Email or Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={expFormData.emailOrContact}
                        onChange={(e) => setExpFormData(prev => ({ ...prev, emailOrContact: e.target.value }))}
                        placeholder="Enter email or phone number"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-[#ca3433] focus:outline-none transition-colors"
                      />
                    </div>

                    {expFormError && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                        {expFormError}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={expFormStatus === 'loading'}
                      className="w-full py-4 bg-[#ca3433] text-white font-bold text-lg rounded-full hover:bg-[#b1302f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {expFormStatus === 'loading' ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Registering...
                        </>
                      ) : (
                        'Register for FREE'
                      )}
                    </button>
                  </form>
                </div>
              ) : (
                /* Date/Time Selection */
                <div className="space-y-4">
                  {[
                    { date: 'January 18, 2026', day: 'Saturday' },
                    { date: 'January 19, 2026', day: 'Sunday' },
                    { date: 'February 8, 2026', day: 'Saturday' },
                  ].map((item, index) => (
                    <div key={index} className="bg-[#fff7e5] rounded-2xl p-5 border-2 border-[#ffe0b2] hover:border-[#ca3433] transition-colors">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-[#ca3433] rounded-lg">
                          <Calendar className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="font-bold text-[#0e1f3e]">{item.date}</div>
                          <div className="text-sm text-gray-500">{item.day}</div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setExperienceSelection({ date: item.date, time: '10:00 AM' })}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#ca3433] text-white font-semibold rounded-full hover:bg-[#b1302f] transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                          10:00 AM
                        </button>
                        <button
                          onClick={() => setExperienceSelection({ date: item.date, time: '12:00 PM' })}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#0e1f3e] text-white font-semibold rounded-full hover:bg-[#1f2a4d] transition-colors"
                        >
                          <Clock className="w-4 h-4" />
                          12:00 PM
                        </button>
                      </div>
                    </div>
                  ))}

                  <p className="text-center text-sm text-gray-500 mt-4">
                    📍 Exceed Academy • 🕐 60 minutes • 👨‍👩‍👧‍👦 Ages K-6
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;

