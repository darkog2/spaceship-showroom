import { useState } from 'react';
import { Menu, Rocket, X } from 'lucide-react';

const navItems = [
  { label: 'Главная', id: 'home' },
  { label: 'Каталог', id: 'catalog' },
  { label: 'Преимущества', id: 'about' },
  { label: 'Контакты', id: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-amber-ui/30 bg-dark-navy/75 backdrop-blur-xl">
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
              className="font-oxanium text-sm uppercase tracking-[0.12em] text-text-light/85 transition-colors hover:text-amber-ui"
              type="button"
            >
              {item.label}
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
                className="block w-full rounded-md px-3 py-2 text-left font-oxanium text-sm uppercase tracking-[0.1em] text-text-light/85 transition hover:bg-cyan-holo/10 hover:text-amber-ui"
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
