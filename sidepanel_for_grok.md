# Side Panel Code for Grok

Актуальный код боковой панели навигации (orbit), который сейчас используется в проекте.

## 1) Компонент `src/components/SectionOrbitNav.tsx`

```tsx
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export type OrbitSection = {
  id: string;
  label: string;
};

type Props = {
  sections: readonly OrbitSection[];
  activeId: string;
  onJump: (id: string) => void;
};

export default function SectionOrbitNav({ sections, activeId, onJump }: Props) {
  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === activeId));
  const [displayIndex, setDisplayIndex] = useState(activeIndex);
  const displayIndexRef = useRef(activeIndex);
  const frameRef = useRef<number | null>(null);
  const targetIndexRef = useRef(activeIndex);
  const lastFrameTimeRef = useRef(0);
  const canShiftUp = activeIndex > 0;
  const canShiftDown = activeIndex < sections.length - 1;

  const ORBIT_STEP = 36;
  const ORBIT_BASE = 14;
  const ORBIT_FOCUS_SHIFT = -11;

  useEffect(() => {
    displayIndexRef.current = displayIndex;
  }, [displayIndex]);

  useEffect(() => {
    const maxIndex = Math.max(0, sections.length - 1);
    if (displayIndexRef.current > maxIndex) {
      displayIndexRef.current = maxIndex;
      setDisplayIndex(maxIndex);
    }
    targetIndexRef.current = Math.min(maxIndex, targetIndexRef.current);
  }, [sections.length]);

  useEffect(() => {
    const hasWindow = typeof window !== 'undefined';
    const prefersReducedMotion = hasWindow && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const maxIndex = Math.max(0, sections.length - 1);
    const clampedTarget = Math.min(maxIndex, Math.max(0, activeIndex));

    if (prefersReducedMotion) {
      targetIndexRef.current = clampedTarget;
      displayIndexRef.current = clampedTarget;
      setDisplayIndex(clampedTarget);
      return;
    }

    targetIndexRef.current = clampedTarget;
    const glideRatePerMs = 0.024;
    const precision = 0.0018;

    const animate = (now: number) => {
      const dt = lastFrameTimeRef.current
        ? Math.min(34, Math.max(8, now - lastFrameTimeRef.current))
        : 16;
      lastFrameTimeRef.current = now;

      const alpha = 1 - Math.exp(-glideRatePerMs * dt);
      const target = targetIndexRef.current;
      const current = displayIndexRef.current;
      const nextIndex = Math.min(maxIndex, Math.max(0, current + (target - current) * alpha));
      displayIndexRef.current = nextIndex;
      setDisplayIndex(nextIndex);

      if (Math.abs(target - nextIndex) < precision) {
        displayIndexRef.current = target;
        setDisplayIndex(target);
        frameRef.current = null;
        lastFrameTimeRef.current = 0;
        return;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(animate);
    }

    return () => {
      // no-op: keep current frame alive between target updates for smoother glide
    };
  }, [activeIndex, sections.length]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastFrameTimeRef.current = 0;
    },
    [],
  );

  const shift = (direction: 1 | -1) => {
    const nextIndex = Math.min(sections.length - 1, Math.max(0, activeIndex + direction));
    const nextSection = sections[nextIndex];
    if (nextSection) {
      onJump(nextSection.id);
    }
  };

  return (
    <nav className="section-orbit section-orbit-enhanced" aria-label="Р‘С‹СЃС‚СЂР°СЏ РЅР°РІРёРіР°С†РёСЏ РїРѕ СЂР°Р·РґРµР»Р°Рј">
      <div className="section-orbit-arrows">
        <button
          type="button"
          aria-label="РџРµСЂРµР№С‚Рё Рє СЂР°Р·РґРµР»Сѓ РІС‹С€Рµ"
          onClick={() => shift(-1)}
          disabled={!canShiftUp}
          className="section-orbit-arrow"
        >
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          aria-label="РџРµСЂРµР№С‚Рё Рє СЂР°Р·РґРµР»Сѓ РЅРёР¶Рµ"
          onClick={() => shift(1)}
          disabled={!canShiftDown}
          className="section-orbit-arrow"
        >
          <ChevronDown size={16} />
        </button>
      </div>

      <div className="section-orbit-shell">
        <div className="section-orbit-track">
          <span className="section-orbit-line" aria-hidden="true" />
          <span
            className="section-orbit-progress"
            aria-hidden="true"
            style={{ height: `${ORBIT_BASE + displayIndex * ORBIT_STEP}px` }}
          />
          <span
            className="section-orbit-focus"
            aria-hidden="true"
            style={{ top: `${displayIndex * ORBIT_STEP + ORBIT_FOCUS_SHIFT}px` }}
          />
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <button
                key={section.id}
                type="button"
                title={section.label}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => onJump(section.id)}
                className={`section-orbit-node${isActive ? ' is-active' : ''}`}
              >
                <span className="section-orbit-label">{section.label}</span>
              </button>
            );
          })}
        </div>
        <div className="orbit-particle" aria-hidden="true" />
        <div className="orbit-particle" aria-hidden="true" />
        <div className="orbit-particle" aria-hidden="true" />
      </div>
    </nav>
  );
}

```

## 2) Стили `src/index.css` (блок orbit-nav)

```css
/* Section orbit nav - Ultimate Sith Edition */
@keyframes orbitScan {
  0% {
    transform: translateY(-70%) scaleY(1.2);
    opacity: 0;
  }
  15% {
    opacity: 0.9;
  }
  50% {
    opacity: 0.4;
  }
  100% {
    transform: translateY(70%) scaleY(1.2);
    opacity: 0;
  }
}

@keyframes orbitPulse {
  0%,
  100% {
    box-shadow: 0 0 30px rgba(255, 60, 20, 0.7);
  }
  50% {
    box-shadow: 0 0 50px rgba(255, 80, 40, 1);
  }
}

@keyframes haloRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes activeFlicker {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.85;
  }
}

@keyframes particleOrbit {
  0% {
    transform: translate(-50%, -50%) rotate(0deg) translateX(60px) rotate(0deg);
  }
  100% {
    transform: translate(-50%, -50%) rotate(360deg) translateX(60px) rotate(-360deg);
  }
}

.section-orbit {
  position: fixed;
  right: 1.5rem;
  top: 50%;
  z-index: 58;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.section-orbit-enhanced {
  right: 2rem;
  gap: 16px;
}

.section-orbit-shell {
  position: relative;
  border-radius: 999px;
  border: 2px solid rgba(0, 238, 255, 0.45);
  background: linear-gradient(180deg, rgba(11, 8, 25, 0.95), rgba(8, 6, 19, 0.9));
  padding: 28px 20px;
  backdrop-filter: blur(20px);
  box-shadow:
    inset 0 0 0 2px rgba(255, 255, 255, 0.1),
    0 20px 50px rgba(0, 0, 0, 0.8),
    0 0 80px rgba(255, 60, 20, 0.25),
    0 0 50px rgba(0, 238, 255, 0.18);
}

.section-orbit-shell::before {
  content: "";
  position: absolute;
  inset: -8px;
  border-radius: inherit;
  border: 1px solid rgba(255, 80, 40, 0.4);
  background: radial-gradient(circle, transparent 60%, rgba(255, 60, 20, 0.15));
  box-shadow: 0 0 40px rgba(255, 60, 20, 0.6);
  animation: orbitPulse 4.8s ease-in-out infinite;
  pointer-events: none;
}

.section-orbit-shell::after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  top: 50%;
  height: 90px;
  border-radius: 999px;
  background: linear-gradient(180deg, transparent, rgba(255, 80, 40, 0.6), transparent);
  box-shadow: 0 0 30px rgba(255, 80, 40, 0.8);
  pointer-events: none;
  animation: orbitScan 2.8s linear infinite;
}

.section-orbit-shell > .orbit-particle {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 4px;
  height: 4px;
  background: rgba(255, 80, 40, 0.9);
  border-radius: 50%;
  box-shadow: 0 0 12px rgba(255, 80, 40, 1);
  animation: particleOrbit 12s linear infinite;
  pointer-events: none;
  z-index: 3;
}

.section-orbit-shell > .orbit-particle:nth-child(2) {
  animation-delay: 0s;
}

.section-orbit-shell > .orbit-particle:nth-child(3) {
  animation-delay: -4s;
}

.section-orbit-shell > .orbit-particle:nth-child(4) {
  animation-delay: -8s;
}

.section-orbit-arrows {
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.section-orbit-arrow {
  width: 32px;
  height: 32px;
  border-radius: 999px;
  border: 2px solid rgba(0, 238, 255, 0.7);
  background: rgba(8, 7, 19, 0.9);
  color: rgba(220, 240, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 0 20px rgba(0, 238, 255, 0.3),
    inset 0 0 12px rgba(0, 238, 255, 0.15);
  transition: all 220ms ease;
}

.section-orbit-arrow:hover:not(:disabled),
.section-orbit-arrow:focus-visible:not(:disabled) {
  transform: scale(1.1) translateY(-2px);
  border-color: rgba(255, 60, 20, 1);
  color: #ffe8d0;
  box-shadow:
    0 0 30px rgba(255, 60, 20, 0.8),
    0 0 20px rgba(0, 238, 255, 0.4);
}

.section-orbit-arrow:disabled {
  opacity: 0.25;
  cursor: not-allowed;
}

.section-orbit-track {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  z-index: 4;
}

.section-orbit-line,
.section-orbit-progress {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  border-radius: 999px;
  pointer-events: none;
}

.section-orbit-line {
  top: 10px;
  bottom: 10px;
  background: linear-gradient(180deg, rgba(120, 200, 255, 0.35), rgba(255, 100, 40, 0.35));
  box-shadow: 0 0 15px rgba(0, 238, 255, 0.4);
}

.section-orbit-progress {
  top: 10px;
  background: linear-gradient(180deg, rgba(0, 238, 255, 1), rgba(255, 60, 20, 1));
  box-shadow:
    0 0 30px rgba(0, 238, 255, 0.9),
    0 0 40px rgba(255, 60, 20, 0.8);
  transition: none;
  will-change: height;
  animation: activeFlicker 3s ease-in-out infinite;
}

.section-orbit-focus {
  position: absolute;
  left: 50%;
  width: 40px;
  height: 40px;
  transform: translate(-50%, 0);
  border-radius: 999px;
  border: 3px solid rgba(255, 60, 20, 1);
  background: radial-gradient(circle, rgba(255, 100, 40, 0.55), transparent 65%);
  box-shadow:
    0 0 40px rgba(255, 60, 20, 1),
    0 0 60px rgba(0, 238, 255, 0.4);
  transition: none;
  will-change: top;
  animation: orbitPulse 2s ease-in-out infinite;
  pointer-events: none;
}

.section-orbit-focus::before {
  content: "";
  position: absolute;
  inset: -10px;
  border: 1px solid rgba(255, 80, 40, 0.7);
  border-radius: inherit;
  animation: haloRotate 8s linear infinite;
  box-shadow: 0 0 20px rgba(255, 80, 40, 0.6);
}

.section-orbit-node {
  position: relative;
  z-index: 5;
  width: 18px;
  height: 18px;
  border-radius: 999px;
  border: 2px solid rgba(200, 220, 255, 0.75);
  background: linear-gradient(180deg, rgba(11, 9, 26, 0.98), rgba(13, 11, 25, 0.9));
  transition: all 220ms ease;
}

.section-orbit-node:hover,
.section-orbit-node:focus-visible {
  transform: scale(1.3);
  border-color: rgba(0, 238, 255, 1);
  box-shadow: 0 0 25px rgba(0, 238, 255, 0.7);
}

.section-orbit-node.is-active {
  border-color: rgba(255, 60, 20, 1);
  background: radial-gradient(circle at 30% 30%, rgba(255, 140, 80, 1), rgba(255, 40, 0, 0.95));
  box-shadow:
    0 0 35px rgba(255, 60, 20, 1),
    0 0 50px rgba(255, 100, 40, 0.8);
  animation: activeFlicker 3.5s ease-in-out infinite;
}

.section-orbit-label {
  position: absolute;
  right: calc(100% + 22px);
  top: 50%;
  transform: translate3d(8px, -50%, 0);
  opacity: 0;
  pointer-events: none;
  white-space: nowrap;
  border-radius: 999px;
  border: 1px solid rgba(0, 238, 255, 0.5);
  background: rgba(6, 5, 14, 0.95);
  backdrop-filter: blur(8px);
  padding: 6px 14px;
  font-family: "Share Tech Mono", monospace;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  color: rgba(231, 241, 255, 0.95);
  text-shadow: 0 0 10px rgba(231, 241, 255, 0.8);
  transition: all 220ms ease;
}

.section-orbit-node:hover .section-orbit-label,
.section-orbit-node:focus-visible .section-orbit-label,
.section-orbit-node.is-active .section-orbit-label {
  transform: translate3d(0, -50%, 0);
  opacity: 1;
}

.section-orbit-node.is-active .section-orbit-label {
  border-color: rgba(255, 60, 20, 0.85);
  color: #ffb380;
  text-shadow: 0 0 12px rgba(255, 80, 40, 0.9);
}

@media (max-width: 1279px) {
  .section-orbit,
  .section-orbit-enhanced {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .section-orbit-shell::before,
  .section-orbit-shell::after,
  .section-orbit-progress,
  .section-orbit-focus,
  .section-orbit-focus::before,
  .section-orbit-node.is-active,
  .orbit-particle {
    animation: none !important;
  }

  .section-orbit *,
  .section-orbit *::before,
  .section-orbit *::after {
    transition: none !important;
  }
}
```

## 3) Интеграция в `src/App.tsx`

### Секции и типы

```tsx
const quickNavSections = [
  { id: 'home', label: 'Р“Р»Р°РІРЅР°СЏ' },
  { id: 'featured', label: 'Р’РёС‚СЂРёРЅР°' },
  { id: 'catalog', label: 'РљР°С‚Р°Р»РѕРі' },
  { id: 'about', label: 'РџСЂРµРёРјСѓС‰РµСЃС‚РІР°' },
  { id: 'journey', label: 'РЎС†РµРЅР°СЂРёРё' },
  { id: 'contact', label: 'РљРѕРЅС‚Р°РєС‚С‹' },
] as const;

type QuickNavSectionId = (typeof quickNavSections)[number]['id'];
type ManufacturerChipPreview = {
```

### Состояние активной секции

```tsx
  const [activeQuickNavSection, setActiveQuickNavSection] = useState<QuickNavSectionId>('home');
```

### Прокрутка к секции по клику

```tsx
  const scrollToQuickNavSection = (id: QuickNavSectionId) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }
    const headerOffset = 92;
    const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;
    smoothScrollToY(top, 300);
    setActiveQuickNavSection(id);
  };
```

### Определение активной секции по scroll

```tsx
  useEffect(() => {
    const sectionNodes = quickNavSections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (sectionNodes.length === 0) {
      return;
    }

    let frameId: number | null = null;
    const updateActiveSection = () => {
      const probe = window.scrollY + window.innerHeight * 0.42;
      let currentId = sectionNodes[0].id as QuickNavSectionId;

      for (const section of sectionNodes) {
        if (probe >= section.offsetTop - 96) {
          currentId = section.id as QuickNavSectionId;
          continue;
        }
        break;
      }

      setActiveQuickNavSection((prev) => (prev === currentId ? prev : currentId));
    };

    const onScroll = () => {
      if (frameId !== null) {
        return;
      }
      frameId = requestAnimationFrame(() => {
        frameId = null;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection);
    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);
```

### Рендер боковой панели

```tsx
      {!overlayOpen && (
        <SectionOrbitNav
          sections={quickNavSections}
          activeId={activeQuickNavSection}
          onJump={(id) => scrollToQuickNavSection(id as QuickNavSectionId)}
        />
      )}
```

### Исключение wheel-обработки для orbit-панели

```tsx
    const onWindowWheel = (event: globalThis.WheelEvent) => {
      if (overlayOpen || window.innerWidth < 1200) {
        return;
      }
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      if (target.closest('#catalog, .featured-loop-track, .section-orbit')) {
        return;
```

