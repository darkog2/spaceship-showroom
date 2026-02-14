import { useState } from 'react';
import { ArrowDownRight, Sparkles } from 'lucide-react';
import { Ship, ships } from '../data/ships';
import { useTiltEffect } from '../hooks/useTiltEffect';

interface HeroProps {
  onOpenFeaturedShip: (ship: Ship) => void;
}

const featuredShip =
  ships.find((ship) => ship.id === 'solstice-r9') ??
  ships.find((ship) => ship.id === 'helix-vx2') ??
  ships.find((ship) => ship.id === 'orion-x9') ??
  ships[0];

const inStockCount = ships.filter((ship) => ship.availability === 'In Stock').length;

const classLabels: Record<Ship['class'], string> = {
  'Solo Pod': 'Соло-под',
  'Duo Skiff': 'Дуо-скифф',
  'Tri Cabin': 'Три-кабина',
  'Quad Shuttle': 'Квадро-шаттл',
};

const base = import.meta.env.BASE_URL;
const ambienceVideos = [
  `${base}ships/videos/upscale4x/hero-01.mp4`,
  `${base}ships/videos/upscale4x/hero-02.mp4`,
  `${base}ships/videos/upscale4x/hero-03.mp4`,
  `${base}ships/videos/upscale4x/hero-04.mp4`,
];

export default function Hero({ onOpenFeaturedShip }: HeroProps) {
  const [activeFrame, setActiveFrame] = useState(0);
  const { onMouseMove: onHeroTiltMove, onMouseLeave: onHeroTiltLeave } = useTiltEffect({
    intensity: 1.18,
    perspective: 1220,
  });
  const goToNextAmbienceVideo = () => {
    setActiveFrame((prev) => (prev + 1) % ambienceVideos.length);
  };

  const jumpTo = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="home" className="relative overflow-hidden pb-16 pt-20 md:pt-28">
      <div className="pointer-events-none absolute inset-0 z-0">
        <video
          key={ambienceVideos[activeFrame]}
          className="absolute inset-0 h-full w-full object-cover opacity-38"
          src={ambienceVideos[activeFrame]}
          autoPlay
          muted
          playsInline
          preload="metadata"
          onEnded={goToNextAmbienceVideo}
          onError={goToNextAmbienceVideo}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-navy/24 via-dark-navy/68 to-dark-navy/50" />
        <div className="absolute inset-y-0 left-0 w-[60%] bg-gradient-to-r from-dark-navy/78 via-dark-navy/56 to-transparent" />
        <div className="absolute inset-y-0 left-0 w-[44%] bg-[radial-gradient(circle_at_18%_36%,rgba(8,6,18,0.72),transparent_72%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(169,125,255,0.26),transparent_44%),radial-gradient(circle_at_82%_10%,rgba(255,143,31,0.18),transparent_38%)]" />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:items-end lg:gap-8 xl:gap-10 lg:px-8">
        <div className="hero-copy-shell lg:col-span-6 p-3 sm:p-4 lg:p-4">

          <h1 className="font-orbitron text-[clamp(2.35rem,4vw,4.65rem)] font-bold leading-[1] tracking-[0.03em] text-text-light drop-shadow-[0_12px_24px_rgba(5,3,12,0.8)]">
            Корабль под миссию.
            <br />
            <span className="text-amber-ui drop-shadow-[0_6px_16px_rgba(255,80,40,0.35)]">Сделка под ключ.</span>
          </h1>
          <p className="mt-2 font-oxanium text-sm uppercase tracking-[0.13em] text-cyan-holo drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] sm:text-base">
            Void Hangar — торговый док премиальных кораблей Sol-Transit
          </p>

          <p className="soft-copy mt-4 max-w-none font-rajdhani text-lg leading-relaxed text-text-light/90 drop-shadow-[0_4px_14px_rgba(4,3,10,0.78)] sm:text-[1.2rem]">
            Премиальный док-рум с настоящими конфигурациями: городские рейсы, экспедиции и элитные маршруты.
            Вся навигация, цены и комплектации — прозрачно и без лишнего шума.
          </p>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row">
            <button className="btn-primary" onClick={() => jumpTo('catalog')} type="button">
              В КАТАЛОГ <ArrowDownRight size={16} />
            </button>
            <button className="btn-secondary" onClick={() => jumpTo('contact')} type="button">
              КОНСУЛЬТАЦИЯ
            </button>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="panel-shell p-3 sm:p-4">
              <p className="spec-text">{ships.length}</p>
              <p className="mt-1 font-rajdhani text-sm uppercase tracking-[0.08em] text-text-light/65">Моделей</p>
            </div>
            <div className="panel-shell p-3 sm:p-4">
              <p className="spec-text">{inStockCount}</p>
              <p className="mt-1 font-rajdhani text-sm uppercase tracking-[0.08em] text-text-light/65">В наличии</p>
            </div>
            <div className="panel-shell p-3 sm:p-4">
              <p className="spec-text">24/7</p>
              <p className="mt-1 font-rajdhani text-sm uppercase tracking-[0.08em] text-text-light/65">Поддержка</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <article
            className="panel-shell card-tilt-reactive hero-feature-shell cursor-pointer overflow-hidden p-3"
            onClick={() => onOpenFeaturedShip(featuredShip)}
            onMouseMove={onHeroTiltMove}
            onMouseLeave={onHeroTiltLeave}
          >
            <div
              className="zoomable relative h-[330px] overflow-hidden rounded-xl sm:h-[430px] lg:h-[500px]"
              onMouseMove={(event) => {
                const rect = event.currentTarget.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width) * 100;
                const y = ((event.clientY - rect.top) / rect.height) * 100;
                event.currentTarget.style.setProperty('--zoom-x', `${x}%`);
                event.currentTarget.style.setProperty('--zoom-y', `${y}%`);
              }}
              onMouseEnter={(event) => event.currentTarget.classList.add('is-active')}
              onMouseLeave={(event) => event.currentTarget.classList.remove('is-active')}
            >
              <img
                src={featuredShip.images[0]}
                alt={featuredShip.name}
                className="h-full w-full object-cover"
                loading="eager"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-navy via-dark-navy/15 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-cyan-holo/10" />

              <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-ui/55 bg-dark-navy/65 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-amber-ui">
                  <Sparkles size={12} /> Предложение месяца
                </span>
              </div>

              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-cyan-holo/40 bg-dark-navy/68 p-4 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
                <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <h2 className="font-orbitron text-2xl uppercase tracking-[0.08em] text-text-light sm:text-3xl">{featuredShip.name}</h2>
                    <p className="mt-1 font-rajdhani text-base text-text-light/75">
                      {classLabels[featuredShip.class]} / Экипаж {featuredShip.crewMin}-{featuredShip.crewMax}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="font-mono text-sm uppercase tracking-[0.1em] text-text-light/60">Цена от</p>
                    <p className="font-orbitron text-2xl tracking-[0.08em] text-amber-ui">
                      ${(featuredShip.priceUsd / 1000).toFixed(0)}K
                    </p>
                    <button
                      className="mt-2 inline-flex items-center gap-2 rounded-md border border-amber-ui/40 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-amber-ui"
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        onOpenFeaturedShip(featuredShip);
                      }}
                    >
                      Открыть <ArrowDownRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
