import { type ReactNode, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Filter, RotateCcw } from 'lucide-react';
import { Ship } from '../data/ships';

interface ShipFilterProps {
  ships: Ship[];
  onFilter: (filtered: Ship[]) => void;
  variant?: 'default' | 'sidebar';
}

type FilterState = {
  shipClass: string;
  crewMax: number | null;
  maxPrice: number | null;
  availability: string;
};

type SectionKey = 'class' | 'crew' | 'price' | 'status';

const allSectionsOpen: Record<SectionKey, boolean> = {
  class: true,
  crew: true,
  price: true,
  status: true,
};

const allSectionsClosed: Record<SectionKey, boolean> = {
  class: false,
  crew: false,
  price: false,
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

const defaultFilters: FilterState = {
  shipClass: 'all',
  crewMax: null,
  maxPrice: null,
  availability: 'all',
};

export default function ShipFilter({ ships, onFilter, variant = 'default' }: ShipFilterProps) {
  const isSidebar = variant === 'sidebar';
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [expandedSections, setExpandedSections] = useState<Record<SectionKey, boolean>>(
    isSidebar ? allSectionsClosed : allSectionsOpen,
  );

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

  useEffect(() => {
    setExpandedSections(isSidebar ? allSectionsClosed : allSectionsOpen);
  }, [isSidebar]);

  const allExpanded = useMemo(
    () => Object.values(expandedSections).every((expanded) => expanded),
    [expandedSections],
  );

  const toggleAllSections = () => {
    setExpandedSections(allExpanded ? allSectionsClosed : allSectionsOpen);
  };

  const toggleSection = (section: SectionKey) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeTokens = useMemo(() => {
    const tokens: string[] = [];
    if (filters.shipClass !== 'all') {
      tokens.push(classLabels[filters.shipClass as Ship['class']]);
    }
    if (filters.crewMax !== null) {
      tokens.push(`Экипаж до ${filters.crewMax}`);
    }
    if (filters.maxPrice !== null) {
      tokens.push(`До $${(filters.maxPrice / 1000).toFixed(0)}K`);
    }
    if (filters.availability !== 'all') {
      tokens.push(availabilityLabels[filters.availability as Ship['availability']]);
    }
    return tokens;
  }, [filters]);

  const getOptionClass = (active: boolean, dense = false) => {
    const base = isSidebar
      ? `w-full rounded-lg border px-2 py-1.5 font-rajdhani text-[12px] font-semibold leading-[1.15] tracking-[0.01em] text-center transition-colors duration-200 ${
          dense ? 'min-h-[34px]' : 'min-h-[38px]'
        } whitespace-normal break-words [word-break:break-word]`
      : 'rounded-md border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition';

    const activeStyle = isSidebar
      ? 'border-amber-ui/42 bg-amber-ui/14 text-amber-ui shadow-[0_0_10px_rgba(255,143,31,0.11)]'
      : 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui';

    const idleStyle = isSidebar
      ? 'border-text-light/16 bg-dark-navy/24 text-text-light/70 hover:border-amber-ui/28 hover:bg-dark-navy/32 hover:text-text-light/86'
      : 'border-cyan-holo/30 text-text-light/70 hover:border-cyan-holo/50';

    return `${base} ${active ? activeStyle : idleStyle}`;
  };

  const sectionLabelClass = `font-oxanium uppercase tracking-[0.08em] text-text-light/80 ${
    isSidebar ? 'text-xs' : 'text-base'
  }`;

  const renderSection = (key: SectionKey, title: string, content: ReactNode) => (
    <div className="rounded-lg border border-text-light/10 bg-dark-navy/14 px-2.5 py-2">
      <button
        type="button"
        onClick={() => toggleSection(key)}
        aria-expanded={expandedSections[key]}
        className="flex w-full items-center justify-between gap-2 text-left"
      >
        <span className={sectionLabelClass}>{title}</span>
        <ChevronDown
          size={14}
          className={`text-text-light/50 transition-transform duration-200 ${
            expandedSections[key] ? 'rotate-180' : 'rotate-0'
          }`}
        />
      </button>
      <div
        className={`grid overflow-hidden transition-[grid-template-rows,opacity,margin] duration-250 ${
          expandedSections[key] ? 'mt-2 grid-rows-[1fr] opacity-100' : 'mt-0 grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">{content}</div>
      </div>
    </div>
  );

  return (
    <section
      className={`panel-shell ship-filter-panel ${isSidebar ? 'ship-filter-panel--sidebar p-3' : 'ship-filter-panel--default mb-8 p-5 sm:p-6'}`}
    >
      <div
        className={`mb-4 flex flex-wrap items-center justify-between gap-2 ${
          isSidebar ? 'border-b border-text-light/10 pb-2' : ''
        }`}
      >
        <button
          type="button"
          onClick={toggleAllSections}
          aria-label={allExpanded ? 'Свернуть все блоки фильтра' : 'Открыть все блоки фильтра'}
          className={`inline-flex items-center gap-2 font-orbitron uppercase text-amber-ui transition hover:text-amber-ui/85 ${
            isSidebar ? 'text-base tracking-[0.06em]' : 'text-xl tracking-[0.1em]'
          }`}
        >
          <Filter size={isSidebar ? 15 : 18} /> Фильтры
        </button>
        <button
          onClick={resetFilters}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-amber-ui/28 bg-dark-navy/18 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-amber-ui/88 transition hover:border-amber-ui/40 hover:bg-dark-navy/28 hover:text-amber-ui ${
            isSidebar ? 'w-full justify-center' : ''
          }`}
          type="button"
        >
          <RotateCcw size={12} /> Сбросить
        </button>
      </div>

      {isSidebar && (
        <div className="mb-2.5 flex flex-wrap gap-1.5">
          {activeTokens.length > 0 ? (
            activeTokens.map((token) => (
              <span
                key={token}
                className="rounded-full border border-text-light/16 bg-dark-navy/28 px-2 py-0.5 font-rajdhani text-[11px] text-text-light/66"
              >
                {token}
              </span>
            ))
          ) : (
            <span className="rounded-full border border-text-light/14 bg-dark-navy/20 px-2 py-0.5 font-rajdhani text-[11px] text-text-light/56">
              Без ограничений
            </span>
          )}
        </div>
      )}

      <div className={isSidebar ? 'grid grid-cols-1 gap-2.5' : 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'}>
        {renderSection(
          'class',
          'Класс',
          <div className={isSidebar ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'}>
            <button
              onClick={() => updateFilter({ shipClass: 'all' })}
              className={getOptionClass(filters.shipClass === 'all')}
              type="button"
            >
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
          <div className={isSidebar ? 'grid grid-cols-3 gap-2' : 'flex flex-wrap gap-2'}>
            <button
              onClick={() => updateFilter({ crewMax: null })}
              className={getOptionClass(filters.crewMax === null, true)}
              type="button"
            >
              Любой
            </button>
            {[1, 2, 3, 4].map((crew) => (
              <button
                key={crew}
                onClick={() => updateFilter({ crewMax: crew })}
                className={getOptionClass(filters.crewMax === crew, true)}
                type="button"
              >
                До {crew}
              </button>
            ))}
          </div>,
        )}

        {renderSection(
          'price',
          'Цена',
          <div className={isSidebar ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'}>
            <button
              onClick={() => updateFilter({ maxPrice: null })}
              className={getOptionClass(filters.maxPrice === null, true)}
              type="button"
            >
              Любая
            </button>
            {priceOptions.map((price) => (
              <button
                key={price}
                onClick={() => updateFilter({ maxPrice: price })}
                className={getOptionClass(filters.maxPrice === price, true)}
                type="button"
              >
                До ${(price / 1000).toFixed(0)}K
              </button>
            ))}
          </div>,
        )}

        {renderSection(
          'status',
          'Статус',
          <div className={isSidebar ? 'grid grid-cols-1 gap-2' : 'flex flex-wrap gap-2'}>
            <button
              onClick={() => updateFilter({ availability: 'all' })}
              className={getOptionClass(filters.availability === 'all')}
              type="button"
            >
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
