import { X, Calendar, Sparkles, Clock, CheckCircle, Loader2, ArrowLeft, MapPin, Mail, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import AdminDashboard from './components/AdminDashboard';
import { programs as rawPrograms } from './programsData';
import PaymentModal from './PaymentModal';

interface ProgramOption {
  label: string;
  time: string;
  dates: string;
}

interface ProgramSchedule {
  grades: string;
  options: ProgramOption[];
}

interface SyllabusWeek {
  week: string;
  title: string;
  desc: string;
}

interface ProgramPart {
  title: string;
  ceremony: string;
  schedules: ProgramSchedule[];
  syllabus: SyllabusWeek[];
}

interface Program {
  id: string;
  name: string;
  icon: any;
  startDate?: string;
  startDates?: string[];
  hasSyllabus: boolean;
  videos?: string[];
  content?: ProgramPart[];
}

const programs = rawPrograms as Program[];

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [modalImageSrc, setModalImageSrc] = useState<string>('');

  useEffect(() => {
    if (selectedProgram) {
      setModalImageSrc(`/images/future-${selectedProgram.id}/future-${selectedProgram.id}.png`);
    } else {
      setModalImageSrc('');
    }
  }, [selectedProgram]);

  const [showExperiencePopup, setShowExperiencePopup] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const IPOS_LINK = 'https://securelink-prod.valorpaytech.com:4430/?redirect=1&uid=4166692e-5304-11f1-a8e1-12a0879a85b1';

  // Experience registration form state
  const [experienceSelection, setExperienceSelection] = useState<{ date: string; time: string } | null>(null);
  const [expFormData, setExpFormData] = useState({ fullName: '', emailOrContact: '' });
  const [expFormStatus, setExpFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [expFormError, setExpFormError] = useState('');

  // Lock background scroll when any modal is open
  useEffect(() => {
    if (showExperiencePopup || selectedProgram) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showExperiencePopup, selectedProgram]);

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

    const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : '';

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
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        courseName={selectedProgram ? selectedProgram.name : "Future Professionals Series"}
        cashPrice="$559"
        cardPrice="$559"
        stripeLink={IPOS_LINK}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <header className="mb-20" id="hero">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <a href="#enroll" className="inline-flex items-center mb-5 rounded-full bg-[#ca3433] px-5 py-2 text-sm sm:text-base font-bold text-white shadow-sm animate-pulse hover:bg-[#b1302f] transition-colors">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-white" />
                Now Enrolling — Limited Spots!
              </a>
              <div className="flex items-center justify-center lg:justify-start gap-6 mb-6">
                <div className="inline-flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-3xl shadow-lg overflow-hidden">
                  <img
                    src="/images/logo.png"
                    alt="Exceed logo"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-left">
                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-3">
                    Now Enrolling —
                    <span className="block text-[#ca3433]">Limited Spots!</span>
                  </h1>
                  <p className="text-base sm:text-lg text-[#1f2a4d]/80 max-w-xl font-bold">
                    NOW ENROLLING DOCTOR AND DENTIST — SECURE YOUR SPOT TODAY!
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full max-w-md">
              <div className="rounded-3xl bg-white/70 shadow-xl overflow-hidden border-4 border-white">
                <img
                  src="/images/white-coat-ceremony-perfect.png"
                  alt="Children enrolled in the program"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </header>

        {/* White Coat Ceremony Prioritization Section */}
        <section className="mb-20">
          <div className="bg-white rounded-[3rem] shadow-2xl p-10 sm:p-16 border-b-8 border-[#ca3433] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Sparkles className="w-32 h-32 text-[#ca3433]" />
            </div>
            <div className="max-w-6xl mx-auto flex flex-col items-center">
              <h2 className="text-4xl sm:text-5xl font-black text-[#0e1f3e] mb-6 text-center leading-tight">
                Lead with <span className="text-[#ca3433]">Emotion</span>, Not Logistics.
              </h2>
              <p className="text-xl sm:text-2xl text-gray-700 text-center leading-relaxed font-medium italic mb-12 max-w-3xl">
                "Your child walks across the stage in a real white coat — a moment of pure pride they'll never forget."
              </p>

              {/* Photo Gallery Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 w-full">
                {/* Primary Featured Image */}
                <div className="md:col-span-2 lg:row-span-2 rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white md:rotate-1 hover:rotate-0 transition-transform duration-500 group">
                  <img
                    src="/images/white-coat-ceremony-perfect.png"
                    alt="White Coat Ceremony Highlight"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Gallery Slots */}
                {[
                  { src: '/images/gallery/Screenshot_23.png', alt: 'Ceremony Moment 1', rotate: 'md:-rotate-2' },
                  { src: '/images/gallery/Screenshot_24.png', alt: 'Ceremony Moment 2', rotate: 'md:rotate-3' },
                  { src: '/images/gallery/Screenshot_25.png', alt: 'Ceremony Moment 3', rotate: 'md:-rotate-1' },
                  { src: '/images/gallery/Screenshot_26.png', alt: 'Ceremony Moment 4', rotate: 'md:rotate-2' },
                ].map((img, i) => (
                  <div key={i} className={`aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-white ${img.rotate} hover:rotate-0 transition-transform duration-500 group bg-gray-100`}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      onError={(e) => {
                        // Fallback for missing images to show a nice placeholder
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=400&auto=format&fit=crop';
                        (e.target as HTMLImageElement).className = 'w-full h-full object-cover opacity-20 grayscale';
                      }}
                    />
                  </div>
                ))}
              </div>

              <div className="inline-block px-8 py-4 bg-[#f7e0e0] rounded-2xl border-2 border-[#ca3433]/20 mb-8 text-center">
                <p className="text-[#ca3433] font-bold text-lg">
                  The White Coat Ceremony is the heart of our program.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Hero CTA & Pricing Section */}
        <section className="py-10 -mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-[#ca3433]/5 rounded-full blur-3xl" />
            </div>

            <div className="relative text-center">
              <h2 className="text-3xl sm:text-4xl font-black text-[#0e1f3e] mb-2">
                Now Enrolling — <span className="text-[#ca3433]">Limited Spots!</span>
              </h2>
              <p className="text-lg sm:text-xl text-[#1f2a4d]/70 mb-6 font-medium">
                Now Enrolling Young Artist and Young Chef — Fill up the form to enroll today.
              </p>
              <button type="button"
                onClick={() => setPaymentModalOpen(true)}
                className="inline-flex items-center justify-center px-14 py-5 rounded-full bg-[#ca3433] text-white text-xl sm:text-2xl font-bold shadow-xl hover:bg-[#b1302f] hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <Sparkles className="w-6 h-6 mr-3" />
                Enroll Now
              </button>
              <p className="mt-4 text-sm text-[#ca3433] font-bold animate-pulse">
                ⚠️ Spots are limited and filling up fast for 2027 sessions!
              </p>

              {/* Pricing Block */}
              <div className="mt-10 max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-8 border border-[#f7e0e0] relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                  We offer cash discount program
                </div>
                <div className="text-4xl font-black text-[#ca3433] mb-1">$559</div>
                <div className="text-base text-[#0e1f3e]/60 font-medium mb-5">Full program — flat rate, no hidden fees</div>

                {/* White Coat Ceremony Highlight */}
                <div className="bg-gradient-to-r from-[#f7e0e0] to-[#fff7e5] rounded-2xl p-5 flex items-center gap-4 border-2 border-[#ca3433] mb-6">
                  <span className="text-4xl">🥼</span>
                  <div className="text-left">
                    <div className="font-bold text-[#ca3433] text-lg">White Coat Ceremony & Graduation</div>
                    <div className="text-sm text-[#0e1f3e]/70">The most emotional moment of the series. Your child is honored for their hard work and dedication.</div>
                  </div>
                </div>

                <ul className="space-y-3 text-left mb-6 bg-gray-50 p-6 rounded-2xl">
                  <li className="flex items-center gap-3 text-[#0e1f3e] font-medium">
                    <CheckCircle className="w-5 h-5 text-green-500" /> Hands-On Learning Every Session
                  </li>
                  <li className="flex items-center gap-3 text-[#0e1f3e] font-medium">
                    <CheckCircle className="w-5 h-5 text-green-500" /> Professional Syllabus &amp; Curriculum
                  </li>
                  <li className="flex items-center gap-3 text-[#0e1f3e] font-medium">
                    <CheckCircle className="w-5 h-5 text-green-500" /> Real Props &amp; Professional Tools
                  </li>
                  <li className="flex items-center gap-3 text-[#0e1f3e] font-medium">
                    <CheckCircle className="w-5 h-5 text-green-500" /> Taught by Real Professionals
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <main className="space-y-20">

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
              <div className="mb-12" id="enroll">
                <h3 className="text-3xl font-bold text-[#ca3433] mb-2 text-center">Now Enrolling</h3>
                <p className="text-center text-[#0e1f3e]/60 mb-6 text-sm font-medium">Young Artist &amp; Young Chef — Limited spots available</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {programs.filter(p => p.id === 'chef' || p.id === 'artist').map((program) => {
                    const Icon = program.icon;
                    const description = program.id === 'chef'
                      ? 'Kids cook, create, and learn kitchen confidence with fun culinary projects and healthy meal lessons.'
                      : 'Young artists explore color, texture, and creativity through guided drawing, painting, and mixed-media activities.';
                    return (
                      <div
                        key={program.name}
                        onClick={() => {
                          setSelectedProgram(program);
                        }}
                        className="group flex flex-col items-center p-6 bg-[#f7e0e0] rounded-2xl hover:shadow-lg transition-all cursor-pointer hover:bg-[#ca3433] hover:text-white hover:-translate-y-1"
                      >
                        <Icon className="w-16 h-16 text-[#ca3433] mb-3 group-hover:text-white transition-colors" />
                        <span className="text-base sm:text-lg font-semibold text-[#0e1f3e] text-center group-hover:text-white transition-colors">
                          {program.name}
                        </span>
                        {program.startDate && (
                          <span className="text-xs font-bold text-[#ca3433] mt-1 px-2 py-0.5 bg-white/50 rounded-full group-hover:bg-white group-hover:text-[#ca3433] transition-all">
                            Starts {program.startDate}
                          </span>
                        )}
                        <p className="text-xs sm:text-sm text-gray-600 mt-3 text-center leading-relaxed group-hover:text-white/90 transition-colors">
                          {description}
                        </p>
                        <span className="mt-4 text-xs sm:text-sm font-bold text-white bg-[#ca3433] group-hover:bg-white group-hover:text-[#ca3433] px-4 py-1.5 rounded-full transition-all">
                          Fill Up the Form to Enroll
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#0e1f3e] mb-2 text-center">Also Enrolling</h3>
                <p className="text-center text-[#0e1f3e]/60 mb-6 text-sm font-medium">Future Doctor &amp; Future Dentist — Click syllabus to register</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {programs.filter(p => p.id === 'doctor' || p.id === 'dentist').map((program) => {
                    const Icon = program.icon;
                    const description = program.id === 'doctor'
                      ? 'Your child will explore the world of medicine through hands-on activities, learning how real doctors diagnose, treat, and care for patients.'
                      : 'A fun, immersive journey into dentistry where kids learn about oral health, dental tools, and what it takes to keep smiles healthy.';
                    return (
                      <div
                        key={program.name}
                        onClick={() => {
                          setSelectedProgram(program);
                        }}
                        className="group flex flex-col items-center p-6 bg-[#fff7e5] rounded-2xl hover:shadow-lg transition-all cursor-pointer hover:bg-[#ffe0b2] hover:text-[#0e1f3e] hover:-translate-y-1"
                      >
                        <Icon className="w-16 h-16 text-[#ca3433] mb-3 group-hover:text-[#b1302f] transition-colors" />
                        <span className="text-base sm:text-lg font-semibold text-[#0e1f3e] text-center group-hover:text-[#0e1f3e] transition-colors">
                          {program.name}
                        </span>
                        {program.startDate && (
                          <span className="text-xs font-bold text-[#ca3433] mt-1 px-2 py-0.5 bg-white/50 rounded-full group-hover:bg-white group-hover:text-[#ca3433] transition-all">
                            Starts {program.startDate}
                          </span>
                        )}
                        <p className="text-xs sm:text-sm text-gray-600 mt-3 text-center leading-relaxed group-hover:text-[#0e1f3e]/90 transition-colors">
                          {description}
                        </p>
                        <span className="mt-4 text-xs sm:text-sm font-bold text-[#ca3433] bg-white border border-[#ca3433] px-4 py-1.5 rounded-full transition-all">
                          View Syllabus & Register
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

              {/* Upcoming Programs - Chef and Artist */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-[#0e1f3e] mb-2 text-center">Upcoming Programs</h3>
                <p className="text-sm text-gray-600 mb-4 text-center">
                  See the next start dates below and register early to secure your spot!
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
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
                        {(program.startDates || program.startDate) && (
                          <span className="text-xs font-bold text-[#0e1f3e]/70 mt-1 text-center">
                            Starts {program.startDates ? program.startDates[0] : program.startDate}
                          </span>
                        )}
                        <span className="text-xs sm:text-sm text-[#ca3433] mt-1 font-semibold">
                          Register Early
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
                    const dateLabel = program.startDates ? program.startDates.join(' / ') : program.startDate;
                    return (
                      <div
                        key={program.name}
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-2xl"
                      >
                        <Icon className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-xs sm:text-sm font-semibold text-gray-600 text-center">
                          {program.name}
                        </span>
                        {dateLabel && (
                          <span className="text-[10px] sm:text-xs text-[#ca3433] mt-2 font-semibold text-center">
                            {dateLabel}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Waitlist Form */}
              {/* Removed Waitlist Form */}
            </div>
          </section>
        </main>

        <footer className="mt-20 border-t border-gray-200/50 pt-10 pb-8 text-center text-gray-600 text-base">
          <div className="max-w-3xl mx-auto mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
            <div className="flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-white/80 shadow-sm backdrop-blur-sm">
              <MapPin className="w-5 h-5 text-[#ca3433] mb-2" />
              <span className="font-bold text-[#0e1f3e] mb-1">Our Location</span>
              <a href="https://maps.google.com/?q=1360+Willis+Ave,+Albertson,+NY+11507" target="_blank" rel="noopener noreferrer" className="hover:text-[#ca3433] transition-colors text-xs text-gray-500">
                1360 Willis Ave.<br />Albertson, NY 11507
              </a>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-white/80 shadow-sm backdrop-blur-sm">
              <Phone className="w-5 h-5 text-[#ca3433] mb-2" />
              <span className="font-bold text-[#0e1f3e] mb-1">Call Us</span>
              <a href="tel:+15162263114" className="hover:text-[#ca3433] transition-colors text-xs text-gray-500">
                +1 (516) 226-3114
              </a>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/50 rounded-2xl border border-white/80 shadow-sm backdrop-blur-sm">
              <Mail className="w-5 h-5 text-[#ca3433] mb-2" />
              <span className="font-bold text-[#0e1f3e] mb-1">Email Us</span>
              <a href="mailto:info@exceedlearningcenterny.com" className="hover:text-[#ca3433] transition-colors text-xs text-gray-500 break-all">
                info@exceedlearningcenterny.com
              </a>
            </div>
          </div>
          <p className="text-sm text-gray-400">&copy; 2026 Exceed&apos;s Future Professionals Series. All rights reserved.</p>
        </footer>
      </div>

      {/* Syllabus Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProgram(null)}>
          <div
            className="bg-white rounded-none sm:rounded-3xl w-full max-w-4xl h-full sm:h-auto max-h-screen sm:max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-300 overscroll-y-contain"
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            {/* Modal Hero Banner */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full bg-[#0e1f3e] overflow-hidden flex items-center justify-center">
              {/* Blurred Ambient Background */}
              <img
                src={modalImageSrc}
                alt=""
                className="absolute inset-0 w-full h-full object-cover blur-xl opacity-30 scale-105 pointer-events-none"
              />
              {/* Main Contained Image */}
              <img
                src={modalImageSrc}
                alt={selectedProgram.name}
                className="relative z-10 max-w-full max-h-full object-contain px-4 sm:px-8 py-2"
                onError={() => {
                  if (modalImageSrc && modalImageSrc.includes(`/images/future-${selectedProgram.id}`)) {
                    setModalImageSrc(`/images/${selectedProgram.id}_banner.png`);
                    return;
                  }
                  setModalImageSrc('/images/kids-group.png');
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent z-20 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-30 pointer-events-none">
                <div className="flex items-center gap-4 text-white">
                  <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20">
                    <selectedProgram.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-yellow-300 bg-[#ca3433] px-2.5 py-1 rounded-full">
                      Syllabus &amp; Schedule
                    </span>
                    <h3 className="text-2xl sm:text-4xl font-black mt-2 drop-shadow-md text-white">{selectedProgram.name}</h3>
                  </div>
                </div>
              </div>
            </div>

            <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#f7e0e0] rounded-xl">
                  <selectedProgram.icon className="w-8 h-8 text-[#ca3433]" />
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#0e1f3e]">{selectedProgram.name}</h3>
                  {(selectedProgram.startDates || selectedProgram.startDate) && (
                    <div className="text-sm font-bold text-[#ca3433] flex items-center gap-1 mt-1">
                      <Calendar className="w-4 h-4" />
                      Starts {selectedProgram.startDates ? selectedProgram.startDates.join(' / ') : selectedProgram.startDate}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {(selectedProgram.id === 'chef' || selectedProgram.id === 'artist' || selectedProgram.id === 'doctor' || selectedProgram.id === 'dentist') && (
                  <button
                    onClick={() => setPaymentModalOpen(true)}
                    className="px-5 py-2 bg-[#ca3433] text-white text-sm font-semibold rounded-full shadow-md hover:bg-[#b1302f] transition-colors"
                  >
                    Register Now
                  </button>
                )}
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 sm:p-10">


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

              {/* Registration Buttons at Bottom for all enrolling programs */}
              {(selectedProgram.id === 'chef' || selectedProgram.id === 'artist' || selectedProgram.id === 'doctor' || selectedProgram.id === 'dentist') && (
                <div className="mt-12 p-6 bg-gradient-to-r from-[#f7e0e0] to-[#fff7e5] rounded-2xl">
                  <h4 className="text-lg font-bold text-[#0e1f3e] mb-4 text-center">Ready to Register?</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {programs.filter(p => ['chef', 'artist', 'doctor', 'dentist'].includes(p.id)).map((prog) => {
                      const ProgIcon = prog.icon;
                      return (
                        <button
                          key={prog.id}
                          onClick={() => {
                            setSelectedProgram(prog);
                            setPaymentModalOpen(true);
                          }}
                          className={`flex flex-col items-center p-3 rounded-xl border-2 transition-all hover:shadow-md ${selectedProgram.id === prog.id
                            ? 'border-[#ca3433] bg-white shadow-md'
                            : 'border-gray-200 bg-white/60 hover:border-[#ca3433]/50'
                            }`}
                        >
                          <ProgIcon className="w-8 h-8 text-[#ca3433] mb-1" />
                          <span className="text-[10px] sm:text-xs font-bold text-[#0e1f3e] text-center leading-tight">
                            {prog.id === 'chef' ? 'Young Chef' : prog.id === 'artist' ? 'Young Artist' : prog.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-xs text-center text-gray-500 mb-3">Select a program above to enroll</p>

                  <div className="mt-3 text-center text-sm sm:text-base text-gray-700">
                    <div className="bg-white/60 rounded-xl p-4 inline-block shadow-sm border border-[#ca3433]/10">
                      <div className="font-bold text-[#0e1f3e] mb-1 leading-tight">Full Program — Flat Rate</div>
                      <div className="text-2xl font-black text-[#ca3433]">$559</div>
                      <div className="text-xs text-gray-500 mt-1">No hidden fees · Pay by cash or card</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row items-center justify-end gap-4">
              {/* Show registration button for Doctor/Dentist programs */}
              {(selectedProgram.id === 'doctor' || selectedProgram.id === 'dentist') && (
                <button
                  onClick={() => {
                    setPaymentModalOpen(true);
                  }}
                  className="px-8 py-3 bg-[#ca3433] text-white font-semibold rounded-full shadow-md hover:bg-[#b1302f] transition-colors"
                >
                  Register Early for This Program
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
            className="bg-white rounded-3xl w-full md:max-w-3xl lg:max-w-4xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-[#ca3433] via-[#d94140] to-[#e85653] p-5 sm:p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
                    <span className="text-[10px] sm:text-sm font-semibold bg-yellow-400 text-[#0e1f3e] px-2 sm:px-3 py-0.5 rounded-full">FREE</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold">60-Min Experience</h3>
                  <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                    {expFormStatus === 'success'
                      ? 'Registration complete!'
                      : experienceSelection
                        ? 'Complete your registration'
                        : 'Choose your session'}
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
                  className="p-1.5 sm:p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>
            </div>

            <div className="p-5 sm:p-6">
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
                        const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || '';
                        const baseUrl = rawBaseUrl ? rawBaseUrl.replace(/\/$/, '') : '';

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
                      <label className="block text-xs font-bold text-[#0e1f3e] uppercase tracking-wider mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={expFormData.fullName}
                        onChange={(e) => setExpFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Enter your full name"
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#ca3433] focus:outline-none transition-colors text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-[#0e1f3e] uppercase tracking-wider mb-2">
                        Email or Phone Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={expFormData.emailOrContact}
                        onChange={(e) => setExpFormData(prev => ({ ...prev, emailOrContact: e.target.value }))}
                        placeholder="Enter email or phone"
                        className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl focus:border-[#ca3433] focus:outline-none transition-colors text-base"
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
                    { date: 'February 8, 2026', day: 'Sunday' },
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

