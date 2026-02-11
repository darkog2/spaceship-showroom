import { useMemo, useState } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Ship } from '../data/ships';

interface ShipFilterProps {
  ships: Ship[];
  onFilter: (filtered: Ship[]) => void;
}

type FilterState = {
  shipClass: string;
  crewMax: number | null;
  maxPrice: number | null;
  availability: string;
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

const defaultFilters: FilterState = {
  shipClass: 'all',
  crewMax: null,
  maxPrice: null,
  availability: 'all',
};

export default function ShipFilter({ ships, onFilter }: ShipFilterProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  const classOptions = useMemo(() => [...new Set(ships.map((ship) => ship.class))], [ships]);
  const availabilityOptions = useMemo(() => [...new Set(ships.map((ship) => ship.availability))], [ships]);

  const maxPrice = useMemo(() => Math.max(...ships.map((ship) => ship.priceUsd)), [ships]);
  const priceOptions = useMemo(() => {
    const marks = [300000, 450000, 600000, maxPrice];
    return [...new Set(marks)].sort((a, b) => a - b);
  }, [maxPrice]);

  const applyFilters = (nextFilters: FilterState) => {
    setFilters(nextFilters);

    const filteredShips = ships.filter((ship) => {
      const classMatch = nextFilters.shipClass === 'all' || ship.class === nextFilters.shipClass;
      const crewMatch = nextFilters.crewMax === null || ship.crewMax <= nextFilters.crewMax;
      const priceMatch = nextFilters.maxPrice === null || ship.priceUsd <= nextFilters.maxPrice;
      const availabilityMatch =
        nextFilters.availability === 'all' || ship.availability === nextFilters.availability;

      return classMatch && crewMatch && priceMatch && availabilityMatch;
    });

    onFilter(filteredShips);
  };

  const updateFilter = (patch: Partial<FilterState>) => {
    applyFilters({ ...filters, ...patch });
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    onFilter(ships);
  };

  return (
    <section className="panel-shell mb-8 p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h3 className="inline-flex items-center gap-2 font-orbitron text-xl uppercase tracking-[0.1em] text-amber-ui">
          <Filter size={18} /> Фильтры
        </h3>
        <button
          onClick={resetFilters}
          className="inline-flex items-center gap-2 rounded-md border border-cyan-holo/40 px-3 py-2 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo transition hover:border-amber-ui/50 hover:text-amber-ui"
          type="button"
        >
          <RotateCcw size={14} /> Сбросить
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="mb-2 font-oxanium text-base uppercase tracking-[0.1em] text-text-light/80">Класс</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter({ shipClass: 'all' })}
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                filters.shipClass === 'all'
                  ? 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui'
                  : 'border-cyan-holo/30 text-text-light/70 hover:border-cyan-holo/50'
              }`}
              type="button"
            >
              Все
            </button>
            {classOptions.map((shipClass) => (
              <button
                key={shipClass}
                onClick={() => updateFilter({ shipClass })}
                className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                  filters.shipClass === shipClass
                    ? 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui'
                    : 'border-cyan-holo/30 text-text-light/70 hover:border-cyan-holo/50'
                }`}
                type="button"
              >
                {classLabels[shipClass]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-oxanium text-base uppercase tracking-[0.1em] text-text-light/80">Экипаж</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter({ crewMax: null })}
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                filters.crewMax === null
                  ? 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui'
                  : 'border-cyan-holo/30 text-text-light/70 hover:border-cyan-holo/50'
              }`}
              type="button"
            >
              Любой
            </button>
            {[1, 2, 3, 4].map((crew) => (
              <button
                key={crew}
                onClick={() => updateFilter({ crewMax: crew })}
                className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                  filters.crewMax === crew
                    ? 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui'
                    : 'border-cyan-holo/30 text-text-light/70 hover:border-cyan-holo/50'
                }`}
                type="button"
              >
                До {crew}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-oxanium text-base uppercase tracking-[0.1em] text-text-light/80">Цена</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter({ maxPrice: null })}
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                filters.maxPrice === null
                  ? 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui'
                  : 'border-cyan-holo/30 text-text-light/70 hover:border-cyan-holo/50'
              }`}
              type="button"
            >
              Любая
            </button>
            {priceOptions.map((price) => (
              <button
                key={price}
                onClick={() => updateFilter({ maxPrice: price })}
                className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                  filters.maxPrice === price
                    ? 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui'
                    : 'border-cyan-holo/30 text-text-light/70 hover:border-cyan-holo/50'
                }`}
                type="button"
              >
                До ${(price / 1000).toFixed(0)}K
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-oxanium text-base uppercase tracking-[0.1em] text-text-light/80">Статус</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => updateFilter({ availability: 'all' })}
              className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                filters.availability === 'all'
                  ? 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui'
                  : 'border-cyan-holo/30 text-text-light/70 hover:border-cyan-holo/50'
              }`}
              type="button"
            >
              Все
            </button>
            {availabilityOptions.map((status) => (
              <button
                key={status}
                onClick={() => updateFilter({ availability: status })}
                className={`rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition ${
                  filters.availability === status
                    ? 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui'
                    : 'border-cyan-holo/30 text-text-light/70 hover:border-cyan-holo/50'
                }`}
                type="button"
              >
                {availabilityLabels[status]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
