# Filters Code For Grok

## 1) src/components/ShipFilter.tsx
```tsx
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
  'Solo Pod': 'РЎРѕР»Рѕ-РїРѕРґ',
  'Duo Skiff': 'Р”СѓРѕ-СЃРєРёС„С„',
  'Tri Cabin': 'РўСЂРё-РєР°Р±РёРЅР°',
  'Quad Shuttle': 'РљРІР°РґСЂРѕ-С€Р°С‚С‚Р»',
};

const availabilityLabels: Record<Ship['availability'], string> = {
  'In Stock': 'Р’ РЅР°Р»РёС‡РёРё',
  Limited: 'РћРіСЂР°РЅРёС‡РµРЅРЅРѕ',
  Prototype: 'РџСЂРѕС‚РѕС‚РёРї',
  'On Request': 'РџРѕРґ Р·Р°РєР°Р·',
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
      tokens.push(`Р­РєРёРїР°Р¶ РґРѕ ${filters.crewMax}`);
    }
    if (filters.maxPrice !== null) {
      tokens.push(`Р”Рѕ $${(filters.maxPrice / 1000).toFixed(0)}K`);
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
          aria-label={allExpanded ? 'РЎРІРµСЂРЅСѓС‚СЊ РІСЃРµ Р±Р»РѕРєРё С„РёР»СЊС‚СЂР°' : 'РћС‚РєСЂС‹С‚СЊ РІСЃРµ Р±Р»РѕРєРё С„РёР»СЊС‚СЂР°'}
          className={`inline-flex items-center gap-2 font-orbitron uppercase text-amber-ui transition hover:text-amber-ui/85 ${
            isSidebar ? 'text-base tracking-[0.06em]' : 'text-xl tracking-[0.1em]'
          }`}
        >
          <Filter size={isSidebar ? 15 : 18} /> Р¤РёР»СЊС‚СЂС‹
        </button>
        <button
          onClick={resetFilters}
          className={`inline-flex items-center gap-1.5 rounded-lg border border-amber-ui/28 bg-dark-navy/18 px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-amber-ui/88 transition hover:border-amber-ui/40 hover:bg-dark-navy/28 hover:text-amber-ui ${
            isSidebar ? 'w-full justify-center' : ''
          }`}
          type="button"
        >
          <RotateCcw size={12} /> РЎР±СЂРѕСЃРёС‚СЊ
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
              Р‘РµР· РѕРіСЂР°РЅРёС‡РµРЅРёР№
            </span>
          )}
        </div>
      )}

      <div className={isSidebar ? 'grid grid-cols-1 gap-2.5' : 'grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4'}>
        {renderSection(
          'class',
          'РљР»Р°СЃСЃ',
          <div className={isSidebar ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'}>
            <button
              onClick={() => updateFilter({ shipClass: 'all' })}
              className={getOptionClass(filters.shipClass === 'all')}
              type="button"
            >
              Р’СЃРµ
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
          'Р­РєРёРїР°Р¶',
          <div className={isSidebar ? 'grid grid-cols-3 gap-2' : 'flex flex-wrap gap-2'}>
            <button
              onClick={() => updateFilter({ crewMax: null })}
              className={getOptionClass(filters.crewMax === null, true)}
              type="button"
            >
              Р›СЋР±РѕР№
            </button>
            {[1, 2, 3, 4].map((crew) => (
              <button
                key={crew}
                onClick={() => updateFilter({ crewMax: crew })}
                className={getOptionClass(filters.crewMax === crew, true)}
                type="button"
              >
                Р”Рѕ {crew}
              </button>
            ))}
          </div>,
        )}

        {renderSection(
          'price',
          'Р¦РµРЅР°',
          <div className={isSidebar ? 'grid grid-cols-2 gap-2' : 'flex flex-wrap gap-2'}>
            <button
              onClick={() => updateFilter({ maxPrice: null })}
              className={getOptionClass(filters.maxPrice === null, true)}
              type="button"
            >
              Р›СЋР±Р°СЏ
            </button>
            {priceOptions.map((price) => (
              <button
                key={price}
                onClick={() => updateFilter({ maxPrice: price })}
                className={getOptionClass(filters.maxPrice === price, true)}
                type="button"
              >
                Р”Рѕ ${(price / 1000).toFixed(0)}K
              </button>
            ))}
          </div>,
        )}

        {renderSection(
          'status',
          'РЎС‚Р°С‚СѓСЃ',
          <div className={isSidebar ? 'grid grid-cols-1 gap-2' : 'flex flex-wrap gap-2'}>
            <button
              onClick={() => updateFilter({ availability: 'all' })}
              className={getOptionClass(filters.availability === 'all')}
              type="button"
            >
              Р’СЃРµ
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

```

## 2) src/index.css (filters-related styles)
```css
.catalog-layout-anchor {
  position: relative;
}

.catalog-side-filter-dock {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: clamp(286px, 18vw, 332px);
  transform: translateX(calc(-100% - clamp(14px, 2vw, 26px)));
  pointer-events: none;
  z-index: 6;
}

.catalog-side-filter-sticky {
  position: sticky;
  top: 94px;
  max-height: calc(100vh - 106px);
  pointer-events: auto;
}

.catalog-side-filter-sticky > .panel-shell {
  margin-bottom: 0 !important;
  max-height: calc(100vh - 106px);
  overflow: auto;
  overscroll-behavior: contain;
}

.catalog-side-filter-sticky > .panel-shell::-webkit-scrollbar {
  width: 7px;
}

.catalog-side-filter-sticky > .panel-shell::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, rgba(0, 238, 255, 0.44), rgba(255, 143, 31, 0.44));
  border-radius: 999px;
}

.catalog-side-filter-sticky > .panel-shell::-webkit-scrollbar-track {
  background: rgba(8, 6, 18, 0.24);
}

.ship-filter-panel {
  position: relative;
  isolation: isolate;
  background:
    linear-gradient(152deg, rgba(11, 8, 23, 0.72), rgba(8, 6, 18, 0.6)),
    radial-gradient(120% 80% at 12% 10%, rgba(118, 96, 175, 0.12), transparent 68%),
    radial-gradient(120% 90% at 88% 12%, rgba(255, 143, 31, 0.08), transparent 72%);
  border-color: rgba(126, 104, 178, 0.34) !important;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.03),
    0 10px 26px rgba(3, 3, 10, 0.44),
    0 0 0 1px rgba(255, 143, 31, 0.04);
}

.ship-filter-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  border-radius: inherit;
  background: linear-gradient(120deg, transparent 30%, rgba(255, 255, 255, 0.03) 50%, transparent 70%);
  opacity: 0.14;
}

.ship-filter-panel--sidebar {
  backdrop-filter: blur(12px);
}

.ship-filter-panel--sidebar button:focus-visible,
.ship-filter-panel--default button:focus-visible {
  outline: 1px solid rgba(255, 143, 31, 0.35);
  outline-offset: 1px;
}


```

## 3) src/App.tsx (catalog section usage)
```tsx
<section id="catalog" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="catalog-layout-anchor relative">
              <div className="catalog-side-filter-dock hidden xl:block">
                <div className="catalog-side-filter-sticky">
                  <ShipFilter ships={ships} onFilter={handleFilter} variant="sidebar" />
                </div>
              </div>

              <div className="mb-8 sm:mb-10">
                <h2 className="heading-lg text-text-light">Р”РѕСЃС‚СѓРїРЅС‹Рµ РєРѕСЂР°Р±Р»Рё</h2>
                <p className="soft-copy mt-3 max-w-3xl font-rajdhani text-xl leading-relaxed">
                  РџРѕРіСЂСѓР¶Р°Р№С‚РµСЃСЊ РІ РєР°СЂС‚РѕС‡РєРё, СЃСЂР°РІРЅРёРІР°Р№С‚Рµ РєР»СЋС‡РµРІС‹Рµ РїР°СЂР°РјРµС‚СЂС‹ Рё РјРіРЅРѕРІРµРЅРЅРѕ РїРµСЂРµС…РѕРґРёС‚Рµ Рє РґРµС‚Р°Р»СЊРЅС‹Рј
                  С…Р°СЂР°РєС‚РµСЂРёСЃС‚РёРєР°Рј, СѓРЅРёРєР°Р»СЊРЅС‹Рј РІРѕР·РјРѕР¶РЅРѕСЃС‚СЏРј Рё СЌРєСЃРєР»СЋР·РёРІРЅС‹Рј РєРѕРјРїР»РµРєС‚Р°С†РёСЏРј.
                </p>
              </div>

              <div className="xl:hidden">
                <ShipFilter ships={ships} onFilter={handleFilter} variant="default" />
              </div>

              {manufacturerFocus && (
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-holo/30 bg-dark-navy/50 px-4 py-3">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-holo">Р¤РёР»СЊС‚СЂ РїРѕ РєРѕСЂРїРѕСЂР°С†РёРё</p>
                    <p className="mt-1 font-orbitron text-lg uppercase tracking-[0.08em] text-text-light">
                      {manufacturerFocus.name}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setManufacturerFocusId(null)}
                    className="rounded-md border border-amber-ui/45 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-amber-ui transition hover:border-amber-ui/70"
                  >
                    РЎР±СЂРѕСЃРёС‚СЊ С„РёР»СЊС‚СЂ
                  </button>
                </div>
              )}

              {displayedShips.length > 0 ? (
                <div className="catalog-step-grid grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                  {displayedShips.map((ship) => (
                    <ShipCard
                      key={ship.id}
                      ship={ship}
                      onClick={setSelectedShip}
                      onCompare={toggleCompare}
                      onQuickView={setQuickViewShip}
                      onAddToCart={addToCart}
                      onManufacturerClick={(id) => focusManufacturer(id)}
                      isCompared={compareList.some((item) => item.id === ship.id)}
                      manufacturer={getManufacturer(ship.manufacturerId)}
                    />
                  ))}
                </div>
              ) : (
                <div className="panel-shell p-8 text-center">
                  <p className="font-rajdhani text-2xl text-text-light/80">РџРѕРґ С‚РµРєСѓС‰РёРµ С„РёР»СЊС‚СЂС‹ РјРѕРґРµР»Рё РЅРµ РЅР°Р№РґРµРЅС‹.</p>
                  <p className="mt-2 font-rajdhani text-lg text-text-light/60">
                    РЎР±СЂРѕСЃСЊС‚Рµ С„РёР»СЊС‚СЂС‹ - РєР°С‚Р°Р»РѕРі СЃРЅРѕРІР° РѕС‚РєСЂРѕРµС‚СЃСЏ РїРѕР»РЅРѕСЃС‚СЊСЋ.
                  </p>
                  {manufacturerFocusId && (
                    <button
                      type="button"
                      onClick={() => setManufacturerFocusId(null)}
                      className="mt-4 rounded-md border border-amber-ui/45 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-amber-ui"
                    >
                      РЎР±СЂРѕСЃРёС‚СЊ С„РёР»СЊС‚СЂ Р±СЂРµРЅРґР°
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
```
