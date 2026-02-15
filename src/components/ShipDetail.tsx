import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, Gauge, Shield, Users, X } from 'lucide-react';
import { Manufacturer, Ship } from '../data/ships';
import SkeletonImage from './SkeletonImage';

interface ShipDetailProps {
  ship: Ship;
  onClose: () => void;
  manufacturer?: Manufacturer;
  onManufacturerClick: (manufacturerId: string) => void;
  onPrevShip: () => void;
  onNextShip: () => void;
  onReserveShip: (ship: Ship) => void;
  onRequestTechSheet: (ship: Ship) => void;
}

const badgeColors: Record<string, string> = {
  LIMITED: 'border-amber-ui/60 bg-amber-ui/18 text-amber-ui',
  PROTOTYPE: 'border-cyan-holo/60 bg-cyan-holo/18 text-cyan-holo',
  CERTIFIED: 'border-text-light/45 bg-text-light/10 text-text-light',
  'NEW DROP': 'border-ember-core/60 bg-ember-core/18 text-amber-ui',
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

const trimLabels: Record<Ship['trims'][number]['name'], string> = {
  Standard: 'Базовая',
  Executive: 'Премиум',
  Expedition: 'Экспедиция',
};

const badgeLabels: Record<Ship['badges'][number], string> = {
  LIMITED: 'Лимит',
  PROTOTYPE: 'Прототип',
  CERTIFIED: 'Проверено',
  'NEW DROP': 'Новый дроп',
};

const noiseLabels: Record<Ship['specs']['noise'], string> = {
  Whisper: 'Whisper-контур',
  Low: 'Пониженный акустический профиль',
  Standard: 'Стандартный уровень акустики',
};

const roleByClass: Record<Ship['class'], string> = {
  'Solo Pod': 'Персональный контур: быстрые одиночные вылеты и тактические задачи.',
  'Duo Skiff': 'Дуо-контур: повседневные миссии, деловые рейсы и парные экспедиции.',
  'Tri Cabin': 'Командный контур: семейные, корпоративные и дальние маршруты.',
  'Quad Shuttle': 'Экспедиционный контур: многоэтапные перелеты и смешанные миссии экипажа.',
};

const insuranceByAvailability: Record<Ship['availability'], string> = {
  'In Stock': 'Tier-A retail coverage',
  Limited: 'Tier-S collector coverage',
  Prototype: 'Tier-X research coverage',
  'On Request': 'Tier-A+ contract coverage',
};

export default function ShipDetail({
  ship,
  onClose,
  manufacturer,
  onManufacturerClick,
  onPrevShip,
  onNextShip,
  onReserveShip,
  onRequestTechSheet,
}: ShipDetailProps) {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setActiveImage(0);
  }, [ship.id]);

  const availabilityClass =
    ship.availability === 'In Stock'
      ? 'text-cyan-holo'
      : ship.availability === 'Limited'
        ? 'text-amber-ui'
        : ship.availability === 'Prototype'
          ? 'text-magenta-neon'
          : 'text-text-light/70';

  const activeImageSrc = ship.images[activeImage] ?? ship.images[0];

  const extendedStory = useMemo(() => {
    if (ship.id === 'solstice-r9') {
      return `${ship.description} Серия APEX VALKYR собирается на верфях Helios Transit Armada с использованием узлов, прошедших сертификацию в доках класса A-Prime. Корабль рассчитан на многолетнюю интенсивную эксплуатацию без потери тяговой мощности и стабильности.`;
    }

    const maker = manufacturer?.name ?? 'профильным производственным консорциумом';
    return `${ship.description} Серия ${ship.name} собирается ${maker} с сертификацией узлов в доках класса A-Prime и рассчитана на длительную эксплуатацию без потери тяговой стабильности.`;
  }, [manufacturer?.name, ship.description, ship.id, ship.name]);

  const missionProfile =
    ship.id === 'solstice-r9'
      ? 'Подходит для ежедневных перелётов, деловых миссий на дальние станции и парных экспедиций.'
      : roleByClass[ship.class];

  const technicalPassport = useMemo(() => {
    const cargoSlots =
      ship.class === 'Solo Pod'
        ? '1 легкий модуль'
        : ship.class === 'Duo Skiff'
          ? '2 стандартных модуля'
          : ship.class === 'Tri Cabin'
            ? '3 универсальных модуля'
            : '4 смешанных модуля';

    const dockingWindow =
      ship.specs.launchReadyMin <= 4 ? 'Priority Fast-Lane' : ship.specs.launchReadyMin <= 6 ? 'Standard Fast-Lane' : 'General Dockline';

    const routeNote =
      ship.specs.rangeKm >= 1200
        ? 'Допуск к дальним межорбитальным рейсам без промежуточной дозаправки.'
        : 'Оптимален для планетарных и ближнеорбитальных рейсов с коротким циклом.';

    return [
      { label: 'Акустический профиль', value: noiseLabels[ship.specs.noise] },
      { label: 'Страховой контур', value: insuranceByAvailability[ship.availability] },
      { label: 'Доковый протокол', value: dockingWindow },
      { label: 'Грузовые слоты', value: cargoSlots },
      { label: 'Корпусный стандарт', value: ship.specs.hull },
      { label: 'Режим эксплуатации', value: missionProfile },
      { label: 'Навигационный вывод', value: routeNote },
      { label: 'Реакторная группа', value: `Core-${ship.specs.cruiseKmS}${ship.specs.noise === 'Whisper' ? 'W' : 'L'}` },
    ];
  }, [missionProfile, ship]);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--zoom-x', `${x}%`);
    event.currentTarget.style.setProperty('--zoom-y', `${y}%`);
  };

  return (
    <div
      className="fixed inset-0 z-[70] overflow-y-auto overscroll-contain bg-dark-navy/92 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <header className="sticky top-0 z-10 border-b border-cyan-holo/25 bg-dark-navy/88 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 font-oxanium text-sm uppercase tracking-[0.12em] text-cyan-holo transition-colors hover:text-amber-ui"
            type="button"
          >
            <ChevronLeft size={18} /> Вернуться в каталог
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onPrevShip}
              className="rounded-md border border-cyan-holo/35 p-2 text-cyan-holo transition-colors hover:border-amber-ui/55 hover:text-amber-ui"
              type="button"
              aria-label="Предыдущий корабль"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={onNextShip}
              className="rounded-md border border-cyan-holo/35 p-2 text-cyan-holo transition-colors hover:border-amber-ui/55 hover:text-amber-ui"
              type="button"
              aria-label="Следующий корабль"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={onClose}
              className="rounded-md border border-cyan-holo/35 p-2 text-text-light transition-colors hover:border-amber-ui/55 hover:text-amber-ui"
              type="button"
              aria-label="Закрыть"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
          <div className="space-y-4 lg:col-span-7">
            <div className="panel-shell p-3">
              <div
                className="zoomable relative h-[340px] overflow-hidden rounded-xl sm:h-[450px] lg:h-[520px]"
                onMouseMove={handleMove}
                onMouseEnter={(event) => event.currentTarget.classList.add('is-active')}
                onMouseLeave={(event) => event.currentTarget.classList.remove('is-active')}
              >
                <SkeletonImage src={activeImageSrc} alt={ship.name} className="h-full w-full object-cover" draggable={false} />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-navy via-dark-navy/10 to-transparent" />
              </div>
            </div>



            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="btn-primary flex-1" type="button" onClick={() => onReserveShip(ship)}>
                ЗАБРОНИРОВАТЬ КОРАБЛЬ
              </button>
              <button className="btn-secondary flex-1" type="button" onClick={() => onRequestTechSheet(ship)}>
                ЗАПРОСИТЬ ПОЛНОЕ ТЗ
              </button>
            </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {ship.images.map((image, index) => (
                <button
                  key={`${ship.id}-${index}`}
                  onClick={() => setActiveImage(index)}
                  className={`panel-shell overflow-hidden p-0 transition ${
                    index === activeImage ? 'ring-2 ring-amber-ui/55' : 'opacity-80 hover:opacity-100'
                  }`}
                  type="button"
                  aria-label={`Открыть изображение ${index + 1}`}
                >
                  <SkeletonImage
                    src={image}
                    alt={`${ship.name} ракурс ${index + 1}`}
                    className="h-20 w-full object-cover sm:h-24"
                    wrapperClassName="h-20 w-full sm:h-24"
                    draggable={false}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-5 lg:col-span-5">
            <section className="panel-shell p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {ship.badges.map((badge) => (
                  <span
                    key={badge}
                    className={`rounded-md border px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.12em] ${badgeColors[badge]}`}
                  >
                    {badgeLabels[badge]}
                  </span>
                ))}
              </div>

              <h1 className="heading-lg text-text-light">{ship.name}</h1>
              <p className="mt-2 font-rajdhani text-xl text-text-light/75">
                {classLabels[ship.class]} / Экипаж {ship.crewMin}-{ship.crewMax}
              </p>
              <p className="mt-4 font-rajdhani text-lg leading-relaxed text-text-light/72">{extendedStory}</p>
              <p className="mt-3 rounded-lg border border-cyan-holo/25 bg-dark-navy/35 p-3 font-rajdhani text-base text-text-light/70">
                {missionProfile}
              </p>
              {ship.marketNote && <p className="mt-2 font-rajdhani text-base italic text-cyan-holo/80">{ship.marketNote}</p>}
              {manufacturer && (
                <button
                  type="button"
                  onClick={() => onManufacturerClick(manufacturer.id)}
                  className="mt-3 rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-cyan-holo hover:border-amber-ui/45 hover:text-amber-ui"
                >
                  Производитель: {manufacturer.name}
                </button>
              )}

              <div className="mt-6 flex items-end justify-between">
                <div>
                  <p className="font-rajdhani text-sm uppercase tracking-[0.1em] text-text-light/55">Цена от</p>
                  <p className="font-orbitron text-3xl tracking-[0.08em] text-amber-ui">${(ship.priceUsd / 1000).toFixed(0)}K</p>
                </div>
                <span className={`font-mono text-sm uppercase tracking-[0.12em] ${availabilityClass}`}>
                  {availabilityLabels[ship.availability]}
                </span>
              </div>
            </section>

            <section className="panel-shell p-6">
              <h2 className="mb-4 font-orbitron text-xl uppercase tracking-[0.08em] text-text-light">Характеристики</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-cyan-holo/25 bg-dark-navy/35 p-3">
                  <p className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-text-light/55">
                    <Gauge size={14} /> Дальность
                  </p>
                  <p className="spec-text">{ship.specs.rangeKm} км</p>
                </div>
                <div className="rounded-lg border border-cyan-holo/25 bg-dark-navy/35 p-3">
                  <p className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-text-light/55">
                    <Users size={14} /> Скорость
                  </p>
                  <p className="spec-text">{ship.specs.cruiseKmS} км/с</p>
                </div>
                <div className="rounded-lg border border-cyan-holo/25 bg-dark-navy/35 p-3">
                  <p className="mb-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.12em] text-text-light/55">
                    <Shield size={14} /> Подготовка
                  </p>
                  <p className="spec-text">{ship.specs.launchReadyMin} мин</p>
                </div>
                <div className="rounded-lg border border-cyan-holo/25 bg-dark-navy/35 p-3">
                  <p className="mb-2 font-mono text-xs uppercase tracking-[0.12em] text-text-light/55">Корпус</p>
                  <p className="font-oxanium text-lg text-text-light">{ship.specs.hull}</p>
                </div>
              </div>
            </section>

            <section className="panel-shell p-6">
              <h2 className="mb-4 font-orbitron text-xl uppercase tracking-[0.08em] text-text-light">Паспорт эксплуатации</h2>
              <div className="space-y-2">
                {technicalPassport.map((row) => (
                  <div key={row.label} className="flex items-start justify-between gap-4 border-b border-cyan-holo/15 pb-2 last:border-0 last:pb-0">
                    <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-light/55">{row.label}</p>
                    <p className="max-w-[56%] text-right font-rajdhani text-base text-text-light/82">{row.value}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="panel-shell p-6">
              <h2 className="mb-4 font-orbitron text-xl uppercase tracking-[0.08em] text-text-light">Ключевые возможности</h2>
              <ul className="space-y-2">
                {ship.features.map((feature) => (
                  <li key={feature} className="inline-flex items-center gap-2 font-rajdhani text-lg text-text-light/80">
                    <span className="font-mono text-amber-ui">+</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </section>

            <section className="panel-shell p-6">
              <h2 className="mb-4 font-orbitron text-xl uppercase tracking-[0.08em] text-text-light">Комплектации</h2>
              <div className="space-y-3">
                {ship.trims.map((trim) => (
                  <div key={trim.name} className="rounded-lg border border-cyan-holo/25 bg-dark-navy/35 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h3 className="font-oxanium text-lg uppercase tracking-[0.08em] text-text-light">{trimLabels[trim.name]}</h3>
                      <p className="font-mono text-lg tracking-[0.06em] text-amber-ui">${(trim.priceUsd / 1000).toFixed(0)}K</p>
                    </div>
                    <ul className="space-y-1">
                      {trim.includes.map((item) => (
                        <li key={`${trim.name}-${item}`} className="font-rajdhani text-base text-text-light/70">
                          - {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>


          </div>
        </div>
      </div>
    </div>
  );
}
