export default function Footer() {
  const currentYear = 2146;

  return (
    <footer className="mt-14 border-t border-cyan-holo/25 bg-panel-dark/60 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <p className="font-orbitron text-2xl uppercase tracking-[0.1em] text-text-light">
              Void <span className="text-amber-ui">Hangar</span>
            </p>
            <p className="mt-3 max-w-sm font-rajdhani text-base text-text-light/70">
              Премиальный шоурум персональных космических кораблей в чёрно-оранжевой неоновой эстетике.
            </p>
          </div>

          <div>
            <p className="font-oxanium text-lg uppercase tracking-[0.08em] text-cyan-holo">Каталог</p>
            <ul className="mt-3 space-y-2 font-rajdhani text-base text-text-light/70">
              <li>Скрытные скиффы</li>
              <li>Экспедиционные поды</li>
              <li>Три-кабинные крейсеры</li>
            </ul>
          </div>

          <div>
            <p className="font-oxanium text-lg uppercase tracking-[0.08em] text-cyan-holo">Сервис</p>
            <ul className="mt-3 space-y-2 font-rajdhani text-base text-text-light/70">
              <li>Док-консьерж</li>
              <li>Гарантийная поддержка</li>
              <li>Подготовка миссий</li>
            </ul>
          </div>

          <div>
            <p className="font-oxanium text-lg uppercase tracking-[0.08em] text-cyan-holo">Контакты</p>
            <p className="mt-3 font-rajdhani text-base text-text-light/70">Neo-Tokyo Orbital Platform</p>
            <p className="mt-1 font-mono text-sm uppercase tracking-[0.12em] text-amber-ui">reservations@voidhangar.space</p>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-2 border-t border-cyan-holo/20 pt-6 font-rajdhani text-sm text-text-light/55 sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright {currentYear} Void Hangar. Все права защищены.</p>
          <p>Оптимизировано для настольных и мобильных панелей управления.</p>
        </div>
      </div>
    </footer>
  );
}

