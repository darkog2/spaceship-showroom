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

const GLIDE_RESPONSIVENESS = 18;
const GLIDE_SNAP = 0.001;

export default function SectionOrbitNav({ sections, activeId, onJump }: Props) {
  const activeIndex = Math.max(0, sections.findIndex((section) => section.id === activeId));
  const [displayIndex, setDisplayIndex] = useState(activeIndex);

  const displayIndexRef = useRef(activeIndex);
  const targetIndexRef = useRef(activeIndex);
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number | null>(null);

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
    const clampedDisplay = Math.min(maxIndex, Math.max(0, displayIndexRef.current));
    const clampedTarget = Math.min(maxIndex, Math.max(0, targetIndexRef.current));

    if (clampedDisplay !== displayIndexRef.current) {
      displayIndexRef.current = clampedDisplay;
      setDisplayIndex(clampedDisplay);
    }

    targetIndexRef.current = clampedTarget;
  }, [sections.length]);

  useEffect(() => {
    const hasWindow = typeof window !== 'undefined';
    const prefersReducedMotion = hasWindow && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const maxIndex = Math.max(0, sections.length - 1);
    const clampedTarget = Math.min(maxIndex, Math.max(0, activeIndex));

    targetIndexRef.current = clampedTarget;

    if (prefersReducedMotion) {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      displayIndexRef.current = clampedTarget;
      setDisplayIndex(clampedTarget);
      lastFrameRef.current = null;
      return;
    }

    const step = (timestamp: number) => {
      const previousTimestamp = lastFrameRef.current ?? timestamp;
      const dt = Math.min(0.04, Math.max(0.008, (timestamp - previousTimestamp) / 1000));
      lastFrameRef.current = timestamp;

      const current = displayIndexRef.current;
      const target = targetIndexRef.current;
      const displacement = target - current;

      if (Math.abs(displacement) < GLIDE_SNAP) {
        displayIndexRef.current = target;
        setDisplayIndex(target);
        frameRef.current = null;
        lastFrameRef.current = null;
        return;
      }

      const alpha = 1 - Math.exp(-GLIDE_RESPONSIVENESS * dt);
      const nextIndex = current + displacement * alpha;
      displayIndexRef.current = Math.min(maxIndex, Math.max(0, nextIndex));
      setDisplayIndex(displayIndexRef.current);

      frameRef.current = requestAnimationFrame(step);
    };

    if (frameRef.current === null) {
      frameRef.current = requestAnimationFrame(step);
    }

    return () => {
      // keep animation loop alive between target updates
    };
  }, [activeIndex, sections.length]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastFrameRef.current = null;
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
