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
  const velocityRef = useRef(0);
  const frameRef = useRef<number | null>(null);
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
  }, [sections.length]);

  useEffect(() => {
    const hasWindow = typeof window !== 'undefined';
    const prefersReducedMotion = hasWindow && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      velocityRef.current = 0;
      displayIndexRef.current = activeIndex;
      setDisplayIndex(activeIndex);
      return;
    }

    const maxIndex = Math.max(0, sections.length - 1);
    const stiffness = 0.25;
    const damping = 0.78;
    const precision = 0.002;

    const animate = () => {
      const delta = activeIndex - displayIndexRef.current;
      velocityRef.current = (velocityRef.current + delta * stiffness) * damping;

      const nextIndex = Math.min(maxIndex, Math.max(0, displayIndexRef.current + velocityRef.current));
      displayIndexRef.current = nextIndex;
      setDisplayIndex(nextIndex);

      if (Math.abs(delta) < precision && Math.abs(velocityRef.current) < precision) {
        displayIndexRef.current = activeIndex;
        velocityRef.current = 0;
        setDisplayIndex(activeIndex);
        frameRef.current = null;
        return;
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };
  }, [activeIndex, sections.length]);

  const shift = (direction: 1 | -1) => {
    const nextIndex = Math.min(sections.length - 1, Math.max(0, activeIndex + direction));
    const nextSection = sections[nextIndex];
    if (nextSection) {
      onJump(nextSection.id);
    }
  };

  return (
    <nav className="section-orbit section-orbit-enhanced" aria-label="Быстрая навигация по разделам">
      <div className="section-orbit-arrows">
        <button
          type="button"
          aria-label="Перейти к разделу выше"
          onClick={() => shift(-1)}
          disabled={!canShiftUp}
          className="section-orbit-arrow"
        >
          <ChevronUp size={16} />
        </button>
        <button
          type="button"
          aria-label="Перейти к разделу ниже"
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
