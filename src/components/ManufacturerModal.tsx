import { useRef } from 'react';
import type { Manufacturer, Ship } from '../data/ships';
import { useDialogFocusTrap } from '../hooks/useDialogFocusTrap';

type ManufacturerModalProps = {
  manufacturer: Manufacturer;
  ships: Ship[];
  onClose: () => void;
  onFocusManufacturer: (manufacturerId: string, shipToOpen?: Ship) => void;
};

export default function ManufacturerModal({
  manufacturer,
  ships,
  onClose,
  onFocusManufacturer,
}: ManufacturerModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useDialogFocusTrap({
    isOpen: true,
    containerRef: dialogRef,
    onClose,
  });

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-dark-navy/70 px-4" onClick={onClose} role="presentation">
      <div
        ref={dialogRef}
        className="panel-shell max-w-xl p-6"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manufacturer-modal-title"
        tabIndex={-1}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-holo">{manufacturer.short}</p>
            <h3 id="manufacturer-modal-title" className="mt-2 font-orbitron text-2xl uppercase tracking-[0.08em] text-text-light">
              {manufacturer.name}
            </h3>
            <p className="mt-1 font-rajdhani text-base text-amber-ui">{manufacturer.origin}</p>
          </div>
          <button
            type="button"
            className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
            onClick={onClose}
            aria-label="Закрыть окно бренда"
          >
            Закрыть
          </button>
        </div>
        <p className="mt-4 font-rajdhani text-lg leading-relaxed text-text-light/75">{manufacturer.summary}</p>
        <div className="mt-4">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-light/55">Линейки в каталоге</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {ships.map((ship) => (
              <button
                key={ship.id}
                type="button"
                onClick={() => onFocusManufacturer(manufacturer.id, ship)}
                className="rounded-md border border-cyan-holo/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text-light/80 hover:border-amber-ui/45 hover:text-amber-ui"
              >
                {ship.name}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-md border border-amber-ui/45 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-amber-ui"
            onClick={() => onFocusManufacturer(manufacturer.id)}
          >
            Показать модели
          </button>
          <button
            type="button"
            className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
            onClick={onClose}
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
