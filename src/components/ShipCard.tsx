import { useCallback, useMemo, useState } from 'react';
import { Manufacturer, Ship } from '../data/ships';
import { useTiltEffect } from '../hooks/useTiltEffect';
import { useIsVisible } from '../hooks/useIsVisible';

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
  LIMITED: 'badge-pulse border-amber-ui/70 bg-amber-ui/25 text-amber-ui',
  PROTOTYPE: 'badge-pulse prototype border-cyan-holo/70 bg-cyan-holo/25 text-cyan-holo',
  CERTIFIED: 'border-text-light/50 bg-text-light/12 text-text-light',
  'NEW DROP': 'badge-pulse border-ember-core/70 bg-ember-core/25 text-amber-ui',
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
  const { ref: visRef, isVisible } = useIsVisible();
  const { onMouseMove: onCardTiltMove, onMouseLeave: onCardTiltLeave } = useTiltEffect({ intensity: 1 });

  const availabilityClass =
    ship.availability === 'In Stock'
      ? 'border-cyan-holo/65 bg-cyan-holo/20 text-cyan-holo'
      : ship.availability === 'Limited'
        ? 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui'
        : ship.availability === 'Prototype'
          ? 'border-magenta-neon/65 bg-magenta-neon/20 text-magenta-neon'
          : 'border-text-light/35 bg-text-light/12 text-text-light/75';

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
    if (normalized.length <= 96) return normalized;
    return `${normalized.slice(0, 93).trimEnd()}...`;
  }, [ship.description]);

  return (
    <article
      ref={visRef}
      className={`group card-tilt-reactive cursor-pointer${isVisible ? '' : ' paused-offscreen'}`}
      onClick={() => onClick(ship)}
      onMouseMove={onCardTiltMove}
      onMouseLeave={onCardTiltLeave}
    >
      <div className="panel-shell ship-card-glow overflow-hidden p-0 transition-all duration-[400ms] group-hover:-translate-y-2">
        <div
          className="zoomable relative h-64 overflow-hidden sm:h-72"
          onMouseMove={handleMove}
          onMouseEnter={(event) => event.currentTarget.classList.add('is-active')}
          onMouseLeave={(event) => event.currentTarget.classList.remove('is-active')}
        >
          <img
            src={image}
            alt={ship.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-navy/90 via-dark-navy/30 to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-ui/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
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
            <h3 className="font-orbitron text-xl uppercase tracking-[0.08em] text-text-light drop-shadow-lg sm:text-2xl">{ship.name}</h3>
            <p className="font-rajdhani text-base text-text-light/80 drop-shadow-md">
              {classLabels[ship.class]} / Экипаж {ship.crewMin}-{ship.crewMax}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-cyan-holo/30 px-4 py-3 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.11em] text-text-light/60">Дальность</p>
              <p className="spec-text spec-glow">{ship.specs.rangeKm}</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.11em] text-text-light/60">Крейсер</p>
              <p className="spec-text spec-glow">{ship.specs.cruiseKmS}</p>
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.11em] text-text-light/60">Готовность</p>
              <p className="spec-text spec-glow">{ship.specs.launchReadyMin}м</p>
            </div>
          </div>
          {ship.images.length > 1 && (
            <div className="flex items-center gap-2">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-text-light/50">Цвет</p>
              <div className="flex gap-1">
                {variants.map((idx) => (
                  <button
                    key={`${ship.id}-variant-${idx}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setActiveImage(idx);
                    }}
                    onMouseEnter={() => setActiveImage(idx)}
                    className={`h-3.5 w-3.5 rounded-full border-2 transition-all ${
                      idx === activeImage
                        ? 'border-amber-ui bg-amber-ui/60 shadow-[0_0_14px_rgba(255,80,40,0.7)]'
                        : 'border-cyan-holo/50 bg-cyan-holo/20'
                    }`}
                    type="button"
                    aria-label={`Вариант ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-end justify-between border-t border-cyan-holo/25 p-4">
          <div>
            <p className="font-rajdhani text-sm uppercase tracking-[0.1em] text-text-light/60">Цена от</p>
            <p className="font-orbitron text-2xl tracking-[0.06em] text-amber-ui drop-shadow-lg">${(ship.priceUsd / 1000).toFixed(0)}K</p>
            {manufacturer && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onManufacturerClick(manufacturer.id);
                }}
                className="ship-card-maker-pill mt-2"
              >
                РџСЂРѕРёР·РІРѕРґРёС‚РµР»СЊ: {manufacturer.name}
              </button>
            )}
            <div className="ship-copy-box mt-3 max-w-[300px] px-3 py-2.5 backdrop-blur-[2px]">
              <p className="ship-copy-text">{shortDescription}</p>
            </div>
            {ship.marketNote && (
              <p className="mt-2 max-w-[280px] font-rajdhani text-sm italic text-text-light/70">{ship.marketNote}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <span
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] shadow-md ${availabilityClass}`}
            >
              {availabilityLabels[ship.availability]}
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onQuickView(ship);
                }}
                className="rounded-md border border-cyan-holo/45 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-holo transition hover:border-cyan-holo/75 hover:shadow-[0_0_16px_rgba(0,238,255,0.4)]"
              >
                Быстрый
              </button>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onCompare(ship);
                }}
                className={`rounded-md border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] transition ${
                  isCompared
                    ? 'border-amber-ui/70 bg-amber-ui/25 text-amber-ui shadow-[0_0_16px_rgba(255,80,40,0.5)]'
                    : 'border-magenta-neon/45 text-magenta-neon hover:border-amber-ui/60 hover:text-amber-ui hover:shadow-[0_0_16px_rgba(255,80,40,0.4)]'
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
                className="rounded-md border border-amber-ui/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-ui transition hover:border-amber-ui/80 hover:bg-amber-ui/15 hover:shadow-[0_0_18px_rgba(255,80,40,0.5)]"
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
