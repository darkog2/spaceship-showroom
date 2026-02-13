import { type ChangeEvent, type ReactNode, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Filter, RotateCcw, X } from 'lucide-react';
import { Ship } from '../data/ships';

interface ShipFilterProps {
  ships: Ship[];
  onFilter: (filtered: Ship[]) => void;
  variant?: 'default' | 'sidebar';
}

type FilterState = {
  shipClass: string;
  crewMax: number | null;
  minPrice: number;
  maxPrice: number;
  availability: string;
};

type SectionKey = 'price' | 'class' | 'crew' | 'status';

const allSectionsOpen: Record<SectionKey, boolean> = {
  price: true,
  class: true,
  crew: true,
  status: true,
};

const allSectionsClosed: Record<SectionKey, boolean> = {
  price: false,
  class: false,
  crew: false,
  status: false,
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

const clampNumber = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const formatPriceK = (price: number) => `$${Math.round(price / 1000)}K`;

const createDefaultFilters = (minPrice: number, maxPrice: number): FilterState => ({
  shipClass: 'all',
  crewMax: null,
  minPrice,
  maxPrice,
  availability: 'all',
});

export default function ShipFilter({ ships, onFilter, variant = 'default' }: ShipFilterProps) {
  const isSidebar = variant === 'sidebar';

  const minAvailablePrice = useMemo(() => {
    if (ships.length === 0) {
      return 0;
    }
    return Math.min(...ships.map((ship) => ship.priceUsd));
  }, [ships]);

  const maxAvailablePrice = useMemo(() => {
    if (ships.length === 0) {
      return 0;
    }
    return Math.max(...ships.map((ship) => ship.priceUsd));
  }, [ships]);

  const [filters, setFilters] = useState<FilterState>(() => createDefaultFilters(minAvailablePrice, maxAvailablePrice));
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>(
    isSidebar ? allSectionsClosed : allSectionsOpen,
  );

  const classOptions = useMemo(() => [...new Set(ships.map((ship) => ship.class))], [ships]);
  const availabilityOptions = useMemo(() => [...new Set(ships.map((ship) => ship.availability))], [ships]);

  const maxCrew = useMemo(() => {
    if (ships.length === 0) {
      return 1;
    }
    return Math.max(...ships.map((ship) => ship.crewMax));
  }, [ships]);

  const crewOptions = Array.from({ length: maxCrew }, (_, index) => index + 1);
  const crewPercent = filters.crewMax === null ? 100 : (filters.crewMax / maxCrew) * 100;

  const filterShips = (nextFilters: FilterState) => {
    return ships.filter((ship) => {
      const classMatch = nextFilters.shipClass === 'all' || ship.class === nextFilters.shipClass;
      const crewMatch = nextFilters.crewMax === null || ship.crewMax <= nextFilters.crewMax;
      const priceMatch = ship.priceUsd >= nextFilters.minPrice && ship.priceUsd <= nextFilters.maxPrice;
      const availabilityMatch =
        nextFilters.availability === 'all' || ship.availability === nextFilters.availability;

      return classMatch && crewMatch && priceMatch && availabilityMatch;
    });
  };

  const applyFilters = (nextFilters: FilterState) => {
    setFilters(nextFilters);
    onFilter(filterShips(nextFilters));
  };

  const updateFilter = (patch: Partial<FilterState>) => {
    applyFilters({ ...filters, ...patch });
  };

  const resetFilters = () => {
    const next = createDefaultFilters(minAvailablePrice, maxAvailablePrice);
    applyFilters(next);
  };

  useEffect(() => {
    setExpandedSections(isSidebar ? allSectionsClosed : allSectionsOpen);
  }, [isSidebar]);

  useEffect(() => {
    setFilters((prev) => {
      const clampedMin = clampNumber(prev.minPrice, minAvailablePrice, maxAvailablePrice);
      const clampedMax = clampNumber(prev.maxPrice, minAvailablePrice, maxAvailablePrice);
      const nextMin = Math.min(clampedMin, clampedMax);
      const nextMax = Math.max(clampedMin, clampedMax);

      if (nextMin === prev.minPrice && nextMax === prev.maxPrice) {
        return prev;
      }

      const nextFilters = {
        ...prev,
        minPrice: nextMin,
        maxPrice: nextMax,
      };
      onFilter(filterShips(nextFilters));
      return nextFilters;
    });
  }, [minAvailablePrice, maxAvailablePrice]);

  const activeFilters = useMemo(() => {
    const list: { label: string; remover: () => void }[] = [];

    if (filters.minPrice !== minAvailablePrice || filters.maxPrice !== maxAvailablePrice) {
      list.push({
        label: `${formatPriceK(filters.minPrice)} - ${formatPriceK(filters.maxPrice)}`,
        remover: () => updateFilter({ minPrice: minAvailablePrice, maxPrice: maxAvailablePrice }),
      });
    }

    if (filters.shipClass !== 'all') {
      list.push({
        label: classLabels[filters.shipClass as Ship['class']],
        remover: () => updateFilter({ shipClass: 'all' }),
      });
    }

    if (filters.crewMax !== null) {
      list.push({
        label: `Экипаж до ${filters.crewMax}`,
        remover: () => updateFilter({ crewMax: null }),
      });
    }

    if (filters.availability !== 'all') {
      list.push({
        label: availabilityLabels[filters.availability as Ship['availability']],
        remover: () => updateFilter({ availability: 'all' }),
      });
    }

    return list;
  }, [filters, minAvailablePrice, maxAvailablePrice]);

  const allExpanded = useMemo(() => Object.values(expandedSections).every(Boolean), [expandedSections]);

  const toggleAllSections = () => {
    setExpandedSections(allExpanded ? allSectionsClosed : allSectionsOpen);
  };

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getOptionClass = (active: boolean, dense = false) => {
    const base = isSidebar
      ? `w-full rounded-lg border px-2 py-1.5 font-rajdhani text-[12px] font-semibold leading-[1.15] tracking-[0.01em] text-center transition-colors duration-200 ${
          dense ? 'min-h-[30px]' : 'min-h-[34px]'
        } whitespace-normal break-words [word-break:break-word]`
      : 'rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-200';

    const activeStyle = 'border-amber-ui/60 bg-amber-ui/14 text-amber-ui';
    const idleStyle = isSidebar
      ? 'border-text-light/14 bg-dark-navy/22 text-text-light/72 hover:border-amber-ui/35 hover:text-text-light'
      : 'border-cyan-holo/28 text-text-light/70 hover:border-cyan-holo/45 hover:text-text-light';

    return `${base} ${active ? activeStyle : idleStyle}`;
  };

  const sectionLabelClass = `font-oxanium uppercase tracking-[0.08em] text-text-light/80 ${
    isSidebar ? 'text-xs' : 'text-base'
  }`;

  const handlePriceInputChange =
    (bound: 'min' | 'max') =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value);
      if (Number.isNaN(value)) {
        return;
      }

      const clampedValue = clampNumber(value, minAvailablePrice, maxAvailablePrice);
      if (bound === 'min') {
        const nextMin = Math.min(clampedValue, filters.maxPrice);
        updateFilter({ minPrice: nextMin });
      } else {
        const nextMax = Math.max(clampedValue, filters.minPrice);
        updateFilter({ maxPrice: nextMax });
      }
    };

  const renderActiveFilters = () => (
    <div className="flex flex-wrap gap-2">
      {activeFilters.length > 0 ? (
        activeFilters.map((item, idx) => (
          <button
            key={`${item.label}-${idx}`}
            onClick={item.remover}
            type="button"
            className="group flex items-center gap-2 rounded-full border border-amber-ui/35 bg-dark-navy/45 px-3.5 py-1.5 text-xs font-semibold text-amber-ui transition-colors hover:border-amber-ui/55 hover:bg-dark-navy/62"
          >
            {item.label}
            <X size={14} className="opacity-70 transition-opacity group-hover:opacity-100" />
          </button>
        ))
      ) : (
        <span className="text-sm text-text-light/60">Без активных фильтров</span>
      )}
    </div>
  );

  const renderSection = (key: SectionKey, title: string, content: ReactNode) => (
    <div className={`rounded-lg border border-text-light/10 bg-dark-navy/14 ${isSidebar ? 'px-2 py-1.5' : 'px-2.5 py-2'}`}>
      <button
        type="button"
        onClick={() => toggleSection(key)}
        aria-expanded={expandedSections[key]}
        className="flex w-full items-center justify-between gap-2 text-left transition-colors hover:text-amber-ui"
      >
        <span className={sectionLabelClass}>{title}</span>
        <ChevronDown
          size={14}
          className={`text-text-light/50 transition-transform duration-300 ${expandedSections[key] ? 'rotate-180' : ''}`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-all duration-300 ease-out ${
          expandedSections[key]
            ? `${isSidebar ? 'mt-2' : 'mt-3'} grid-rows-[1fr] opacity-100`
            : 'mt-0 grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">{content}</div>
      </div>
    </div>
  );

  return (
    <section
      className={`panel-shell ship-filter-panel ${isSidebar ? 'ship-filter-panel--sidebar p-2.5' : 'ship-filter-panel--default mb-8 p-5 sm:p-6'}`}
    >
      <div className={`flex flex-wrap items-center justify-between gap-2 ${isSidebar ? 'mb-3 border-b border-text-light/10 pb-2.5' : 'mb-4'}`}>
        <button
          type="button"
          onClick={toggleAllSections}
          className={`filter-toggle-btn ${allExpanded ? 'is-open' : ''} ${isSidebar ? 'is-sidebar' : ''}`}
          aria-pressed={allExpanded}
        >
          <Filter size={isSidebar ? 15 : 18} />
          <span className="filter-toggle-btn__label">Фильтры</span>
          <span className="filter-toggle-btn__state">{allExpanded ? 'Свернуть' : 'Раскрыть'}</span>
          <ChevronDown size={14} className="filter-toggle-btn__chevron" />
        </button>
        <button
          onClick={resetFilters}
          type="button"
          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-ui/35 bg-dark-navy/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-amber-ui transition-colors hover:border-amber-ui/55 hover:bg-dark-navy/35"
        >
          <RotateCcw size={12} /> Сбросить
        </button>
      </div>

      {!isSidebar && (
        <div className="mb-6">
          <div className="mb-2 text-sm uppercase tracking-wider text-text-light/70">Активные фильтры</div>
          {renderActiveFilters()}
        </div>
      )}

      {isSidebar && <div className="mb-3">{renderActiveFilters()}</div>}

      <div className={isSidebar ? 'grid grid-cols-1 gap-2.5' : 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'}>
        {renderSection(
          'price',
          'Цена',
          <div className={isSidebar ? 'space-y-3' : 'space-y-4'}>
            <p className="text-xs text-text-light/55">
              Фактический диапазон: {formatPriceK(minAvailablePrice)} - {formatPriceK(maxAvailablePrice)}
            </p>
            <div className={isSidebar ? 'grid grid-cols-2 gap-1.5' : 'grid grid-cols-2 gap-2'}>
              <label className="filter-price-field">
                <span className="filter-price-caption">От</span>
                <input
                  type="number"
                  value={filters.minPrice}
                  min={minAvailablePrice}
                  max={filters.maxPrice}
                  step={1000}
                  onChange={handlePriceInputChange('min')}
                  className="filter-price-input"
                />
              </label>
              <label className="filter-price-field">
                <span className="filter-price-caption">До</span>
                <input
                  type="number"
                  value={filters.maxPrice}
                  min={filters.minPrice}
                  max={maxAvailablePrice}
                  step={1000}
                  onChange={handlePriceInputChange('max')}
                  className="filter-price-input"
                />
              </label>
            </div>
            <div className={isSidebar ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'}>
              <button
                type="button"
                onClick={() => updateFilter({ minPrice: minAvailablePrice, maxPrice: maxAvailablePrice })}
                className={getOptionClass(filters.minPrice === minAvailablePrice && filters.maxPrice === maxAvailablePrice, true)}
              >
                Весь диапазон
              </button>
              <button
                type="button"
                onClick={() => updateFilter({ minPrice: minAvailablePrice })}
                className={getOptionClass(filters.minPrice === minAvailablePrice, true)}
              >
                Мин
              </button>
              <button
                type="button"
                onClick={() => updateFilter({ maxPrice: maxAvailablePrice })}
                className={getOptionClass(filters.maxPrice === maxAvailablePrice, true)}
              >
                Макс
              </button>
            </div>
          </div>,
        )}

        {renderSection(
          'class',
          'Класс',
          <div className={isSidebar ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'}>
            <button onClick={() => updateFilter({ shipClass: 'all' })} className={getOptionClass(filters.shipClass === 'all')} type="button">
              Все
            </button>
            {classOptions.map((shipClass) => (
              <button
                key={shipClass}
                onClick={() => updateFilter({ shipClass })}
                className={getOptionClass(filters.shipClass === shipClass)}
                type="button"
              >
                {classLabels[shipClass]}
              </button>
            ))}
          </div>,
        )}

        {renderSection(
          'crew',
          'Экипаж',
          <div className={isSidebar ? 'space-y-3' : 'space-y-5'}>
            <div className="range-slider-wrapper">
              <div className="range-track" />
              <div className="range-progress" style={{ width: `${crewPercent}%` }} />
              <input
                type="range"
                min={1}
                max={maxCrew}
                step={1}
                value={filters.crewMax ?? maxCrew}
                onChange={(event) => {
                  const value = Number(event.target.value);
                  updateFilter({ crewMax: value === maxCrew ? null : value });
                }}
                className="range-input"
              />
            </div>
            <div className="flex justify-between text-xs text-text-light/60">
              <span>1</span>
              <span className="text-sm font-bold text-amber-ui">{filters.crewMax !== null ? `До ${filters.crewMax}` : 'Любой'}</span>
              <span>{maxCrew}</span>
            </div>
            <div className={isSidebar ? 'grid grid-cols-3 gap-2' : 'flex flex-wrap gap-2'}>
              <button onClick={() => updateFilter({ crewMax: null })} className={getOptionClass(filters.crewMax === null, true)} type="button">
                Любой
              </button>
              {crewOptions.map((crew) => (
                <button
                  key={crew}
                  onClick={() => updateFilter({ crewMax: crew })}
                  className={getOptionClass(filters.crewMax === crew, true)}
                  type="button"
                >
                  До {crew}
                </button>
              ))}
            </div>
          </div>,
        )}

        {renderSection(
          'status',
          'Статус',
          <div className={isSidebar ? 'grid grid-cols-1 gap-2' : 'flex flex-wrap gap-2'}>
            <button onClick={() => updateFilter({ availability: 'all' })} className={getOptionClass(filters.availability === 'all')} type="button">
              Все
            </button>
            {availabilityOptions.map((status) => (
              <button
                key={status}
                onClick={() => updateFilter({ availability: status })}
                className={getOptionClass(filters.availability === status)}
                type="button"
              >
                {availabilityLabels[status]}
              </button>
            ))}
          </div>,
        )}
      </div>
    </section>
  );
}


