import { ChevronDown, ChevronUp } from 'lucide-react';

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
  const canShiftUp = activeIndex > 0;
  const canShiftDown = activeIndex < sections.length - 1;

  const shift = (direction: 1 | -1) => {
    const nextIndex = Math.min(sections.length - 1, Math.max(0, activeIndex + direction));
    const nextSection = sections[nextIndex];
    if (nextSection) {
      onJump(nextSection.id);
    }
  };

  return (
    <nav className="section-orbit" aria-label="Быстрая навигация по разделам">
      <div className="section-orbit-shell">
        <div className="section-orbit-arrows">
          <button
            type="button"
            aria-label="Перейти к разделу выше"
            onClick={() => shift(-1)}
            disabled={!canShiftUp}
            className="section-orbit-arrow"
          >
            <ChevronUp size={14} />
          </button>
          <button
            type="button"
            aria-label="Перейти к разделу ниже"
            onClick={() => shift(1)}
            disabled={!canShiftDown}
            className="section-orbit-arrow"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        <div className="section-orbit-track">
          <span className="section-orbit-line" aria-hidden="true" />
          <span
            className="section-orbit-progress"
            aria-hidden="true"
            style={{ height: `${8 + activeIndex * 24}px` }}
          />
          <span
            className="section-orbit-focus"
            aria-hidden="true"
            style={{ top: `${activeIndex * 24 - 6}px` }}
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
      </div>
    </nav>
  );
}
