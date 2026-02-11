import { useCallback, useMemo, useState } from 'react';
import { Manufacturer, Ship } from '../data/ships';

interface ShipCardProps {
  ship: Ship;
  onClick: (ship: Ship) => void;
  onCompare: (ship: Ship) => void;
  onQuickView: (ship: Ship) => void;
  onAddToCart: (ship: Ship) => void;
  onManufacturerClick: (manufacturerId: string) => void;
  isCompared: boolean;
  manufacturer?: Manufacturer;
}

const badgeColors: Record<string, string> = {
  LIMITED: 'border-amber-ui/60 bg-amber-ui/20 text-amber-ui',
  PROTOTYPE: 'border-cyan-holo/60 bg-cyan-holo/20 text-cyan-holo',
  CERTIFIED: 'border-text-light/45 bg-text-light/10 text-text-light',
  'NEW DROP': 'border-ember-core/60 bg-ember-core/20 text-amber-ui',
};

const classLabels: Record<Ship['class'], string> = {
  'Solo Pod': 'Соло-под',
  'Duo Skiff': 'Дуо-скифф',
  'Tri Cabin': 'Три-кабина',
  'Quad Shuttle': 'Квадро-шаттл',
};

const availabilityLabels: Record<Ship['availability'], string> = {
  'In Stock': 'В наличии',
  Limited: 'Ограниченно',
  Prototype: 'Прототип',
  'On Request': 'Под заказ',
};

const badgeLabels: Record<Ship['badges'][number], string> = {
  LIMITED: 'Лимит',
  PROTOTYPE: 'Прототип',
  CERTIFIED: 'Проверено',
  'NEW DROP': 'Новый дроп',
};

export default function ShipCard({
  ship,
  onClick,
  onCompare,
  onQuickView,
  onAddToCart,
  onManufacturerClick,
  isCompared,
  manufacturer,
}: ShipCardProps) {
  const [activeImage, setActiveImage] = useState(0);

  const availabilityClass =
    ship.availability === 'In Stock'
      ? 'border-cyan-holo/55 bg-cyan-holo/15 text-cyan-holo'
      : ship.availability === 'Limited'
        ? 'border-amber-ui/55 bg-amber-ui/15 text-amber-ui'
        : ship.availability === 'Prototype'
          ? 'border-magenta-neon/55 bg-magenta-neon/15 text-magenta-neon'
          : 'border-text-light/25 bg-text-light/10 text-text-light/70';

  const image = ship.images[activeImage] ?? ship.images[0];

  const handleMove = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--zoom-x', `${x}%`);
    event.currentTarget.style.setProperty('--zoom-y', `${y}%`);
  }, []);

  const variants = useMemo(() => ship.images.map((_, idx) => idx), [ship.images]);
  const shortDescription = useMemo(() => {
    const normalized = ship.description.replace(/\s+/g, ' ').trim();
    if (normalized.length <= 96) {
      return normalized;
    }
    return `${normalized.slice(0, 93).trimEnd()}...`;
  }, [ship.description]);

  return (
    <article className="group cursor-pointer" onClick={() => onClick(ship)}>
      <div className="panel-shell overflow-hidden p-0 transition duration-300 group-hover:-translate-y-1">
        <div
          className="zoomable relative h-64 overflow-hidden sm:h-72"
          onMouseMove={handleMove}
          onMouseEnter={(event) => event.currentTarget.classList.add('is-active')}
          onMouseLeave={(event) => event.currentTarget.classList.remove('is-active')}
        >
          <img src={image} alt={ship.name} className="h-full w-full object-cover" loading="lazy" />

          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-dark-navy/85 via-dark-navy/40 to-transparent" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
            {ship.badges.map((badge) => (
              <span
                key={badge}
                className={`rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] ${badgeColors[badge]}`}
              >
                {badgeLabels[badge]}
              </span>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="font-orbitron text-xl uppercase tracking-[0.08em] text-text-light sm:text-2xl">{ship.name}</h3>
            <p className="font-rajdhani text-base text-text-light/75">
              {classLabels[ship.class]} / Экипаж {ship.crewMin}-{ship.crewMax}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-cyan-holo/25 px-4 py-3">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.11em] text-text-light/55">Дальность</p>
              <p className="spec-text">{ship.specs.rangeKm}</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.11em] text-text-light/55">Крейсер</p>
              <p className="spec-text">{ship.specs.cruiseKmS}</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.11em] text-text-light/55">Готовность</p>
              <p className="spec-text">{ship.specs.launchReadyMin}м</p>
            </div>
          </div>

          {ship.images.length > 1 && (
            <div className="flex items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-light/45">Цвет</p>
              <div className="flex gap-1">
                {variants.map((idx) => (
                  <button
                    key={`${ship.id}-variant-${idx}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveImage(idx);
                    }}
                    onMouseEnter={() => setActiveImage(idx)}
                    className={`h-3.5 w-3.5 rounded-full border transition ${
                      idx === activeImage
                        ? 'border-amber-ui bg-amber-ui/40'
                        : 'border-cyan-holo/40 bg-cyan-holo/15'
                    }`}
                    type="button"
                    aria-label={`Вариант ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between border-t border-cyan-holo/20 p-4">
          <div>
            <p className="font-rajdhani text-sm uppercase tracking-[0.1em] text-text-light/55">Цена от</p>
            <p className="font-orbitron text-2xl tracking-[0.06em] text-amber-ui">${(ship.priceUsd / 1000).toFixed(0)}K</p>
            {manufacturer && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onManufacturerClick(manufacturer.id);
                }}
                className="mt-2 rounded-md border border-cyan-holo/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-holo hover:border-amber-ui/50 hover:text-amber-ui"
              >
                {manufacturer.short} {manufacturer.name}
              </button>
            )}
            <div className="mt-2 max-w-[300px] rounded-md border border-cyan-holo/22 bg-dark-navy/35 px-2.5 py-2">
              <p className="font-rajdhani text-sm leading-snug text-text-light/72">{shortDescription}</p>
            </div>
            {ship.marketNote && (
              <p className="mt-2 max-w-[280px] font-rajdhani text-sm italic text-text-light/65">{ship.marketNote}</p>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span
              className={`rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] ${availabilityClass}`}
            >
              {availabilityLabels[ship.availability]}
            </span>
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onQuickView(ship);
                }}
                className="rounded-md border border-cyan-holo/35 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-holo hover:border-cyan-holo/60"
              >
                Быстрый
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onCompare(ship);
                }}
                className={`rounded-md border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${
                  isCompared
                    ? 'border-amber-ui/60 bg-amber-ui/18 text-amber-ui'
                    : 'border-magenta-neon/35 text-magenta-neon hover:border-magenta-neon/60'
                }`}
              >
                {isCompared ? 'В сравнении' : 'Сравнить'}
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onAddToCart(ship);
                }}
                className="rounded-md border border-amber-ui/45 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-ui hover:border-amber-ui/70"
              >
                В корзину
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
