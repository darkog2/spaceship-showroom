import { useRef } from 'react';
import type { Ship } from '../data/ships';
import SkeletonImage from './SkeletonImage';
import { formatShipClassCrew } from '../constants/shipMeta';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';

type CompareModalProps = {
  compareList: Ship[];
  onClose: () => void;
  onOpenShip: (ship: Ship) => void;
  onRemoveFromCompare: (id: string) => void;
};

export default function CompareModal({ compareList, onClose, onOpenShip, onRemoveFromCompare }: CompareModalProps) {
  const dialogRef = useRef<HTMLElement | null>(null);

  useDialogFocusTrap({
    isOpen: true,
    containerRef: dialogRef,
    onClose,
  });

  return (
    <div className="fixed inset-0 z-[74] bg-dark-navy/70 backdrop-blur-sm" onClick={onClose} role="presentation">
      <aside
        ref={dialogRef}
        className="mx-auto mt-20 w-[min(980px,96vw)] rounded-2xl border border-cyan-holo/25 bg-dark-navy/95 p-5 sm:p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="compare-modal-title"
        aria-describedby="compare-modal-description"
        tabIndex={-1}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 id="compare-modal-title" className="font-orbitron text-xl uppercase tracking-[0.1em] text-text-light">
              Сравнение моделей
            </h3>
            <p id="compare-modal-description" className="mt-1 font-rajdhani text-sm text-text-light/65">
              Сопоставьте до трёх кораблей и откройте детальную карточку лучшего варианта.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
            aria-label="Закрыть сравнение"
          >
            Закрыть
          </button>
        </div>
        {compareList.length === 0 ? (
          <p className="font-rajdhani text-lg text-text-light/70">Список пуст. Добавьте до трёх кораблей в сравнение.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {compareList.map((item) => (
              <article key={item.id} className="panel-shell p-4">
                <div className="mb-3 overflow-hidden rounded-lg border border-cyan-holo/25 bg-dark-navy/45">
                  <SkeletonImage
                    src={item.images[0]}
                    alt={item.name}
                    className="h-24 w-full object-cover"
                    wrapperClassName="h-24 w-full"
                    loading="lazy"
                    draggable={false}
                  />
                </div>
                <h4 className="font-orbitron text-lg uppercase tracking-[0.08em] text-amber-ui">{item.name}</h4>
                <p className="mt-1 font-rajdhani text-sm text-text-light/65">{formatShipClassCrew(item)}</p>
                <div className="mt-3 space-y-1 font-rajdhani text-base text-text-light/75">
                  <p>Дальность: {item.specs.rangeKm} км</p>
                  <p>Скорость: {item.specs.cruiseKmS} км/с</p>
                  <p>Подготовка: {item.specs.launchReadyMin} мин</p>
                </div>
                <button
                  type="button"
                  onClick={() => onOpenShip(item)}
                  className="mt-4 rounded-md border border-amber-ui/45 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-amber-ui"
                >
                  Открыть карточку
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveFromCompare(item.id)}
                  className="mt-2 rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
                >
                  Удалить из сравнения
                </button>
              </article>
            ))}
          </div>
        )}
      </aside>
    </div>
  );
}
