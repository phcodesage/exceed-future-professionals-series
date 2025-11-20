import { Stethoscope, Palette, ChefHat, FlaskConical, PawPrint, Pill, Scale, Ruler } from 'lucide-react';
import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import WaitlistForm from './components/WaitlistForm';
import AdminDashboard from './components/AdminDashboard';

const programs = [
  { name: 'Future Dentist', icon: Stethoscope },
  { name: 'Young Artist', icon: Palette },
  { name: 'Young Chef', icon: ChefHat },
  { name: 'Future Scientist', icon: FlaskConical },
  { name: 'Future Vet', icon: PawPrint },
  { name: 'Future Pharmacist', icon: Pill },
  { name: 'Future Lawyer', icon: Scale },
  { name: 'Young Designer', icon: Ruler },
];

const galleryItems = [
  {
    name: 'Future Dentist',
    role: 'Future Dentist',
    image: '/images/kid-dentist.png',
  },
  {
    name: 'Young Artist',
    role: 'Young Artist',
    image: '/images/kid-artist.png',
  },
  {
    name: 'Young Chef',
    role: 'Young Chef',
    image: '/images/kid-chef.png',
  },
  {
    name: 'Future Scientist',
    role: 'Future Scientist',
    image: '/images/kid-scientist.png',
  },
  {
    name: 'Future Vet',
    role: 'Future Vet / Doctor',
    image: '/images/kid-doctor.jpg',
  },
  {
    name: 'Future Pharmacist',
    role: 'Future Pharmacist',
    image: '/images/kid-pharmacist.png',
  },
  {
    name: 'Future Lawyer',
    role: 'Future Lawyer',
    image: '/images/kid-lawyer.png',
  },
  {
    name: 'Young Designer',
    role: 'Young Designer',
    image: '/images/kid-designer.png',
  },
];

function App() {
  const [isAdminRoute, setIsAdminRoute] = useState(false);

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

    return () => {
      window.removeEventListener('hashchange', updateRoute);
      window.removeEventListener('popstate', updateRoute);
      lenis.destroy();
    };
  }, []);

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
                  href="#join"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-[#ca3433] text-white text-base sm:text-lg font-semibold shadow-md hover:bg-[#b1302f] transition-colors"
                >
                  Join the interest list
                </a>
                <a
                  href="#about"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-white/80 text-[#0e1f3e] text-sm sm:text-base font-semibold shadow-sm hover:bg-white transition-colors"
                >
                  See programs
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

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {programs.map((program) => {
                  const Icon = program.icon;
                  return (
                    <div
                      key={program.name}
                      className="flex flex-col items-center p-5 bg-[#f7e0e0] rounded-2xl hover:shadow-lg transition-shadow"
                    >
                      <Icon className="w-12 h-12 text-[#ca3433] mb-3" />
                      <span className="text-sm sm:text-base font-semibold text-[#0e1f3e] text-center">
                        {program.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          <section id="gallery">
            <div className="-mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
              <h2 className="text-4xl font-bold text-[#0e1f3e] mb-6 text-center">
                Kids in action
              </h2>
              <p className="text-lg sm:text-xl text-gray-700 mb-10 text-center max-w-2xl mx-auto">
                A peek at the kinds of hands-on adventures your child might experience  來
                from lab coats and chef hats to sketchbooks and stethoscopes.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 md:gap-6 auto-rows-[160px] sm:auto-rows-[200px] md:auto-rows-[220px] lg:auto-rows-[240px]">
                {galleryItems.map((item, index) => (
                  <div
                    key={item.name}
                    className={`relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#ffe0e7] via-[#fff3c9] to-[#e0f3ff] border border-white shadow-md group col-span-1 md:col-span-2 ${
                      index === 0
                        ? 'md:row-span-2 lg:col-span-3'
                        : index === 3
                        ? 'lg:row-span-2'
                        : index === 4
                        ? 'lg:col-span-3'
                        : index === 7
                        ? 'md:col-span-4 lg:col-span-6 md:row-span-3 lg:row-span-3'
                        : ''
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2 text-white">
                      <div>
                        <p className="text-[11px] sm:text-xs uppercase tracking-wide font-semibold opacity-80">
                          {item.role}
                        </p>
                        <p className="text-sm sm:text-base font-bold">Future Professionals Series</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="join">
            <WaitlistForm />
          </section>
        </main>

        <footer className="mt-12 text-center text-gray-600 text-base">
          <p>&copy; 2025 Exceed&apos;s Future Professionals Series. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
