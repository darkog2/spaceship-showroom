import { useEffect, useState } from 'react';
import { Menu, Rocket, X } from 'lucide-react';

const navItems = [
  { label: 'Главная', id: 'home' },
  { label: 'Каталог', id: 'catalog' },
  { label: 'Преимущества', id: 'about' },
  { label: 'Контакты', id: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const ids = navItems.map((i) => i.id);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        }
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? 'border-amber-ui/40 bg-dark-navy/85 backdrop-blur-2xl shadow-[0_4px_30px_rgba(0,0,0,0.5),0_0_15px_rgba(255,80,40,0.06)]'
          : 'border-amber-ui/20 bg-dark-navy/50 backdrop-blur-lg'
      }`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => handleNavClick('home')}
          className="group inline-flex items-center gap-2 text-left"
          type="button"
        >
          <Rocket size={18} className="text-amber-ui transition-transform group-hover:-translate-y-0.5" />
          <span className="font-orbitron text-xl tracking-[0.14em] text-text-light">
            VOID <span className="text-amber-ui">HANGAR</span>
          </span>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative font-oxanium text-sm uppercase tracking-[0.12em] transition-colors duration-200 ${
                activeSection === item.id
                  ? 'text-amber-ui'
                  : 'text-text-light/85 hover:text-amber-ui'
              }`}
              type="button"
            >
              {item.label}
              <span
                className={`absolute -bottom-1.5 left-0 h-[2px] bg-amber-ui transition-all duration-300 ${
                  activeSection === item.id ? 'w-full opacity-100' : 'w-0 opacity-0'
                }`}
              />
            </button>
          ))}
        </div>

        <button
          className="md:hidden text-cyan-holo"
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
          aria-label="Переключить меню"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="border-t border-cyan-holo/30 bg-panel-dark/95 md:hidden">
          <div className="space-y-1 px-3 py-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`block w-full rounded-md px-3 py-2 text-left font-oxanium text-sm uppercase tracking-[0.1em] transition ${
                  activeSection === item.id
                    ? 'bg-amber-ui/15 text-amber-ui'
                    : 'text-text-light/85 hover:bg-cyan-holo/10 hover:text-amber-ui'
                }`}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
