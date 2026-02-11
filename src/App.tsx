import { useState } from 'react';
import Footer from './components/Footer';
import { useEffect, useMemo, useRef, type ChangeEvent, type FormEvent, type PointerEvent, type WheelEvent } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import ShipCard from './components/ShipCard';
import ShipDetail from './components/ShipDetail';
import ShipFilter from './components/ShipFilter';
import { Manufacturer, Ship, manufacturers, ships } from './data/ships';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const missionProfiles = [
  {
    title: 'Городские перелеты',
    text: 'Для ежедневных перемещений между орбитальными платформами и мегаполисами с плотным воздушным трафиком.',
    points: ['Быстрый запуск', 'Стабильная автопосадка', 'Тихий ход в жилых зонах', 'Приоритетные окна для служебных рейсов'],
  },
  {
    title: 'Дальние экспедиции',
    text: 'Для длительных маршрутов с повышенными требованиями к дальности, экранированию и автономности систем.',
    points: ['Расширенная навигация', 'Защита от пылевых бурь', 'Гибкие грузовые модули', 'Стабильные каналы связи'],
  },
  {
    title: 'Премиум-путешествия',
    text: 'Для клиентов, которым важны высокий уровень комфорта, статусный дизайн и безупречная кабина управления.',
    points: ['Люксовый интерьер', 'Персональные light-сцены', 'Консьерж-поддержка 24/7', 'Тихая кабина класса Royal'],
  },
];

const purchaseFlow = [
  {
    step: '01',
    title: 'Подбор модели',
    text: 'Вы выбираете корабль, сравниваете характеристики и формируете запрос на нужную комплектацию.',
  },
  {
    step: '02',
    title: 'Конфигурация и проверка',
    text: 'Инженер дока уточняет сценарий эксплуатации, подбирает пакеты и подтверждает финальную спецификацию.',
  },
  {
    step: '03',
    title: 'Контракт и логистика',
    text: 'Подписываем контракт, резервируем окно вылета и синхронизируем доставку с выбранной станцией.',
  },
  {
    step: '04',
    title: 'Передача корабля',
    text: 'Проводим финальную доковую проверку, обучение пилота и выдаем судно с полной документацией.',
  },
];

const faqItems = [
  {
    q: 'Можно ли заказать индивидуальную комплектацию?',
    a: 'Да. Для большинства моделей доступны пакеты Executive и Expedition, а также точечные инженерные доработки под ваш профиль миссий.',
  },
  {
    q: 'Есть ли гарантия и постгарантийный сервис?',
    a: 'Да. Базовая гарантия входит в любую покупку. Также доступны продленные сервисные контракты с удаленной диагностикой и приоритетным обслуживанием.',
  },
  {
    q: 'Сколько занимает передача корабля?',
    a: 'В среднем от 7 до 21 дня в зависимости от модели и уровня кастомизации. Прототипы и лимитированные версии могут требовать больше времени.',
  },
  {
    q: 'Можно ли арендовать на длительный срок?',
    a: 'Да, доступны лизинговые программы HelioChain и контрактные рейсы на 6-24 месяцев с последующим выкупом.',
  },
];

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

const featuredShips = [
  {
    id: 'helix-vx2',
    label: 'Новый релиз',
  },
  {
    id: 'vesper-x2',
    label: 'Смена цвета',
  },
  {
    id: 'anx-99-spectra',
    label: 'Прототип',
  },
  {
    id: 'ketra-x2',
    label: 'Премиум',
  },
  {
    id: 'orion-x9',
    label: 'Легенда',
  },
  {
    id: 'nyx-skiff-s2-rival',
    label: 'Конкурент',
  },
  {
    id: 'solstice-r9',
    label: 'Флагман',
  },
];

const loreNodes = [
  {
    title: 'Пакт Орбитальных Коридоров',
    text: 'После 2138 года корпорации запустили единый торговый протокол Sol-Transit. Любой сертифицированный корабль получает доступ к быстрым коридорам между доками внутренней системы.',
  },
  {
    title: 'Доковые Лицензии A-Prime',
    text: 'Модели из каталога имеют стандарт стыковки A-Prime: это гарантирует обслуживание на Луне, Марсе, Церере и во внешних колониях.',
  },
  {
    title: 'Страховой Контур Meridian',
    text: 'Каждая покупка привязана к страховому уровню Meridian: от базового retail-coverage до исследовательских пакетов с расширенной ответственностью.',
  },
  {
    title: 'Сетевой Консьерж Рояль',
    text: 'Премиум-клиенты получают отдельный канал сопровождения: подбор маршрутов, резерв топливных окон и приоритетный допуск в частные доки.',
  },
];

const destinationHubs = [
  { type: 'Планета', name: 'Марс, Аркология Cydonia Prime' },
  { type: 'Планета', name: 'Земля, Экваториальный Орбитальный Порт New Dakar' },
  { type: 'Планета', name: 'Венера, Aerostat Harbor Vesper' },
  { type: 'Орбитальная станция', name: 'L5 Elysium Ring Station' },
  { type: 'Орбитальная станция', name: 'Titan Drydock Authority Gamma' },
  { type: 'Орбитальная станция', name: 'Phobos Relay Bastion' },
  { type: 'Заселенный спутник', name: 'Луна, Helix Valley Arcology' },
  { type: 'Заселенный спутник', name: 'Европа, Subsurface Gate-12' },
  { type: 'Заселенный спутник', name: 'Ганимед, Aurora Sea Habitats' },
  { type: 'Дальний сектор', name: 'Церера, Caravan Hub North Belt' },
  { type: 'Дальний сектор', name: 'Пояс Койпера, Frontier Habitat K-47' },
  { type: 'Дальний сектор', name: 'Тритон, Deep Dockline N-9' },
];

const paymentMethods = [
  'Solaris Credit Ledger',
  'HelioChain Escrow',
  'Titan Bond Lease',
  'Quantum Split 24',
  'AetherPay Fleet Transfer',
  'Dockline Syndicate Invoice',
];

const FEATURED_REPEAT = 5;
const FEATURED_MAX_VELOCITY = 3.8;
const FEATURED_MIN_VELOCITY = 0.014;
const FEATURED_DECAY_PER_FRAME = 0.932;

export default function App() {
  const [filteredShips, setFilteredShips] = useState<Ship[]>(ships);
  const [manufacturerFocusId, setManufacturerFocusId] = useState<string | null>(null);
  const [selectedShip, setSelectedShip] = useState<Ship | null>(null);
  const [compareList, setCompareList] = useState<Ship[]>([]);
  const [cart, setCart] = useState<Ship[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [compareOpen, setCompareOpen] = useState(false);
  const [uiNotice, setUiNotice] = useState<string | null>(null);
  const [checkoutDoneMessage, setCheckoutDoneMessage] = useState<string | null>(null);
  const [quickViewShip, setQuickViewShip] = useState<Ship | null>(null);
  const [activeManufacturer, setActiveManufacturer] = useState<Manufacturer | null>(null);
  const [checkoutForm, setCheckoutForm] = useState({
    destinationType: destinationHubs[0].type,
    destinationName: destinationHubs[0].name,
    recipient: '',
    comms: '',
    paymentMethod: paymentMethods[0],
    deliverySlot: 'Ближайшее окно',
    notes: '',
  });
  const featuredTrackRef = useRef<HTMLDivElement | null>(null);
  const featuredPointerIdRef = useRef<number | null>(null);
  const featuredDragRef = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startScroll: 0,
    lastX: 0,
    lastY: 0,
    lastTime: 0,
    velocity: 0,
  });
  const featuredInertiaRef = useRef<number | null>(null);
  const featuredVelocityRef = useRef(0);
  const featuredLastFrameRef = useRef(0);
  const noticeTimeoutRef = useRef<number | null>(null);

  const getManufacturer = (manufacturerId: string) =>
    manufacturers.find((manufacturer) => manufacturer.id === manufacturerId);

  const shipsByManufacturer = useMemo(() => {
    const grouped: Record<string, Ship[]> = {};
    manufacturers.forEach((manufacturer) => {
      grouped[manufacturer.id] = ships.filter((ship) => ship.manufacturerId === manufacturer.id);
    });
    return grouped;
  }, []);

  const displayedShips = useMemo(() => {
    if (!manufacturerFocusId) {
      return filteredShips;
    }
    return filteredShips.filter((ship) => ship.manufacturerId === manufacturerFocusId);
  }, [filteredShips, manufacturerFocusId]);

  const manufacturerFocus = useMemo(
    () => (manufacturerFocusId ? getManufacturer(manufacturerFocusId) ?? null : null),
    [manufacturerFocusId],
  );

  const visibleShipPool = displayedShips.length > 0 ? displayedShips : ships;
  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + item.priceUsd, 0), [cart]);

  const availableDestinations = useMemo(
    () => destinationHubs.filter((hub) => hub.type === checkoutForm.destinationType),
    [checkoutForm.destinationType],
  );
  const overlayOpen = Boolean(selectedShip || quickViewShip || cartOpen || compareOpen || activeManufacturer);

  const flashNotice = (message: string) => {
    if (noticeTimeoutRef.current !== null) {
      clearTimeout(noticeTimeoutRef.current);
    }
    setUiNotice(message);
    noticeTimeoutRef.current = window.setTimeout(() => {
      setUiNotice(null);
      noticeTimeoutRef.current = null;
    }, 2200);
  };

  const scrollToCatalog = () => {
    const section = document.getElementById('catalog');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const focusManufacturer = (manufacturerId: string, shipToOpen?: Ship) => {
    setManufacturerFocusId(manufacturerId);
    setActiveManufacturer(null);
    setQuickViewShip(null);
    if (shipToOpen) {
      setSelectedShip(shipToOpen);
      return;
    }
    setSelectedShip(null);
    scrollToCatalog();
  };

  const navigateSelectedShip = (direction: 1 | -1) => {
    if (visibleShipPool.length === 0) {
      return;
    }
    const currentIndex = selectedShip ? visibleShipPool.findIndex((ship) => ship.id === selectedShip.id) : -1;
    const baseIndex = currentIndex >= 0 ? currentIndex : 0;
    const nextIndex = (baseIndex + direction + visibleShipPool.length) % visibleShipPool.length;
    setSelectedShip(visibleShipPool[nextIndex]);
  };

  const stopFeaturedInertia = () => {
    if (featuredInertiaRef.current !== null) {
      cancelAnimationFrame(featuredInertiaRef.current);
      featuredInertiaRef.current = null;
    }
    featuredVelocityRef.current = 0;
    featuredLastFrameRef.current = 0;
  };

  const setFeaturedPlasma = (power: number) => {
    const track = featuredTrackRef.current;
    if (!track) {
      return;
    }
    const normalized = Math.max(0, Math.min(1.6, power));
    track.style.setProperty('--plasma-power', normalized.toFixed(3));
    track.classList.toggle('plasma-hot', normalized > 0.35);
  };

  const keepFeaturedLooped = () => {
    const track = featuredTrackRef.current;
    if (!track || featuredCards.length === 0) {
      return;
    }
    const segment = track.scrollWidth / FEATURED_REPEAT;
    if (segment <= 0) {
      return;
    }
    if (track.scrollLeft < segment * 0.5) {
      track.scrollLeft += segment;
    } else if (track.scrollLeft > segment * (FEATURED_REPEAT - 1.5)) {
      track.scrollLeft -= segment;
    }
  };

  const applyFeaturedInertia = (impulse: number, mode: 'add' | 'replace' = 'add') => {
    if (mode === 'replace') {
      featuredVelocityRef.current = impulse;
    } else {
      featuredVelocityRef.current += impulse;
    }
    featuredVelocityRef.current = Math.max(
      -FEATURED_MAX_VELOCITY,
      Math.min(FEATURED_MAX_VELOCITY, featuredVelocityRef.current),
    );
    if (Math.abs(featuredVelocityRef.current) < FEATURED_MIN_VELOCITY) {
      setFeaturedPlasma(0);
      return;
    }

    if (featuredInertiaRef.current !== null) {
      return;
    }

    featuredLastFrameRef.current = performance.now();
    const step = (now: number) => {
      const track = featuredTrackRef.current;
      if (!track) {
        featuredInertiaRef.current = null;
        featuredVelocityRef.current = 0;
        setFeaturedPlasma(0);
        return;
      }

      const dt = Math.min(34, Math.max(8, now - featuredLastFrameRef.current || 16));
      featuredLastFrameRef.current = now;
      track.scrollLeft -= featuredVelocityRef.current * dt;
      keepFeaturedLooped();
      setFeaturedPlasma(Math.min(Math.abs(featuredVelocityRef.current) / 2.1, 1.6));

      const frameScale = dt / 16.666;
      featuredVelocityRef.current *= Math.pow(FEATURED_DECAY_PER_FRAME, frameScale);
      if (Math.abs(featuredVelocityRef.current) < FEATURED_MIN_VELOCITY) {
        featuredInertiaRef.current = null;
        featuredVelocityRef.current = 0;
        setFeaturedPlasma(0);
        return;
      }
      featuredInertiaRef.current = requestAnimationFrame(step);
    };

    featuredInertiaRef.current = requestAnimationFrame(step);
  };

  const onFeaturedPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const track = featuredTrackRef.current;
    if (!track) {
      return;
    }
    if (event.button !== 0) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, select, textarea')) {
      return;
    }
    stopFeaturedInertia();
    setFeaturedPlasma(0);
    featuredPointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    featuredDragRef.current = {
      active: true,
      moved: false,
      startX: event.clientX,
      startY: event.clientY,
      startScroll: track.scrollLeft,
      lastX: event.clientX,
      lastY: event.clientY,
      lastTime: performance.now(),
      velocity: 0,
    };
    // Сохраняем целевую карточку для клика
    const articleElement = target.closest('article');
    (featuredDragRef.current as any).clickedArticle = articleElement;
  };

  const onFeaturedPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const track = featuredTrackRef.current;
    const drag = featuredDragRef.current;
    if (!track || !drag.active || featuredPointerIdRef.current !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;
    if (Math.abs(deltaX) > 10 && Math.abs(deltaX) > Math.abs(deltaY)) {
      drag.moved = true;
    }
    if (drag.moved) {
      event.preventDefault();
    }
    track.scrollLeft = drag.startScroll - deltaX;
    keepFeaturedLooped();

    const now = performance.now();
    const dt = now - drag.lastTime;
    if (dt > 0) {
      drag.velocity = (event.clientX - drag.lastX) / dt;
      setFeaturedPlasma(Math.min(Math.abs(drag.velocity) / 1.2, 1.6));
    }
    drag.lastX = event.clientX;
    drag.lastY = event.clientY;
    drag.lastTime = now;
  };

  const onFeaturedPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const track = featuredTrackRef.current;
    const drag = featuredDragRef.current;
    if (!track || !drag.active || featuredPointerIdRef.current !== event.pointerId) {
      return;
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    featuredPointerIdRef.current = null;
    drag.active = false;
    const wasMoved = drag.moved;
    
    // Если это был клик, а не перетаскивание, то открываем карточку
    if (!wasMoved) {
      const clickedArticle = (drag as any).clickedArticle as HTMLElement | undefined;
      if (clickedArticle) {
        // Извлекаем ship ID из атрибута data-ship-id
        const shipId = clickedArticle.getAttribute('data-ship-id');
        if (shipId) {
          const ship = ships.find(s => s.id === shipId);
          if (ship) {
            setSelectedShip(ship);
          }
        }
      }
    }
    
    if (wasMoved) {
      window.setTimeout(() => {
        featuredDragRef.current.moved = false;
      }, 140);
      if (Math.abs(drag.velocity) > 0.01) {
        applyFeaturedInertia(drag.velocity * 5.2, 'replace');
      }
    } else {
      drag.velocity = 0;
      setFeaturedPlasma(0);
    }
  };

  const scrollFeatured = (direction: 1 | -1) => {
    const track = featuredTrackRef.current;
    if (!track) {
      return;
    }
    const shift = Math.min(540, track.clientWidth * 0.95);
    track.scrollBy({ left: direction * shift, behavior: 'smooth' });
    applyFeaturedInertia(-direction * Math.min(2.6, 1.2 + shift / 430), 'replace');
  };

  const onFeaturedWheel = (event: WheelEvent<HTMLDivElement>) => {
    const track = featuredTrackRef.current;
    if (!track) {
      return;
    }
    event.preventDefault();
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const modeMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const pixelDelta = delta * modeMultiplier;
    track.scrollLeft += pixelDelta * 0.82;
    keepFeaturedLooped();
    applyFeaturedInertia(-pixelDelta * 0.0031, 'add');
  };

  const onFeaturedScroll = () => {
    keepFeaturedLooped();
  };

  useEffect(() => {
    return () => {
      stopFeaturedInertia();
      if (noticeTimeoutRef.current !== null) {
        clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target && target.closest('input, textarea, select')) {
        return;
      }
      if (event.key === 'Escape') {
        if (activeManufacturer) {
          setActiveManufacturer(null);
          return;
        }
        if (quickViewShip) {
          setQuickViewShip(null);
          return;
        }
        if (cartOpen) {
          setCartOpen(false);
          return;
        }
        if (compareOpen) {
          setCompareOpen(false);
          return;
        }
        if (selectedShip) {
          setSelectedShip(null);
          return;
        }
        if (manufacturerFocusId) {
          setManufacturerFocusId(null);
          return;
        }
      }

      if (selectedShip && event.key === 'ArrowRight') {
        navigateSelectedShip(1);
        return;
      }
      if (selectedShip && event.key === 'ArrowLeft') {
        navigateSelectedShip(-1);
        return;
      }
      if (!selectedShip && !quickViewShip && !cartOpen && !compareOpen && !activeManufacturer) {
        if (event.key === 'ArrowRight') {
          scrollFeatured(1);
          return;
        }
        if (event.key === 'ArrowLeft') {
          scrollFeatured(-1);
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [activeManufacturer, cartOpen, compareOpen, manufacturerFocusId, quickViewShip, selectedShip, visibleShipPool]);

  useEffect(() => {
    if (!overlayOpen) {
      return;
    }
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [overlayOpen]);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section'));
    if (sections.length === 0) {
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    sections.forEach((section, index) => {
      section.classList.add('flow-section');
      section.style.setProperty('--flow-delay', `${Math.min(index * 55, 260)}ms`);
      if (index === 0) {
        section.classList.add('flow-section-visible');
      }
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('flow-section-visible'));
      return () => {
        sections.forEach((section) => {
          section.classList.remove('flow-section', 'flow-section-visible');
          section.style.removeProperty('--flow-delay');
        });
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('flow-section-visible');
          }
        });
      },
      {
        threshold: 0.18,
        rootMargin: '0px 0px -10% 0px',
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      sections.forEach((section) => {
        section.classList.remove('flow-section', 'flow-section-visible');
        section.style.removeProperty('--flow-delay');
      });
    };
  }, []);

  useEffect(() => {
    if (overlayOpen) {
      return;
    }
    if (!window.matchMedia('(pointer: fine)').matches) {
      return;
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const html = document.documentElement;
    let frameId: number | null = null;
    let current = window.scrollY;
    let target = window.scrollY;

    const updateScrollRatio = () => {
      const maxScroll = Math.max(1, html.scrollHeight - window.innerHeight);
      const ratio = window.scrollY / maxScroll;
      html.style.setProperty('--scroll-ratio', ratio.toFixed(4));
    };

    const clampTarget = (value: number) => {
      const maxScroll = Math.max(0, html.scrollHeight - window.innerHeight);
      return Math.max(0, Math.min(maxScroll, value));
    };

    const stopAnimation = () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
        frameId = null;
      }
    };

    const animate = () => {
      const delta = target - current;
      if (Math.abs(delta) < 0.35) {
        current = target;
        window.scrollTo({ top: target, behavior: 'auto' });
        stopAnimation();
        updateScrollRatio();
        return;
      }

      current += delta * 0.14;
      window.scrollTo({ top: current, behavior: 'auto' });
      updateScrollRatio();
      frameId = requestAnimationFrame(animate);
    };

    const hasScrollableAncestor = (element: HTMLElement | null) => {
      let node = element;
      while (node && node !== document.body) {
        const styles = window.getComputedStyle(node);
        const canScrollY =
          (styles.overflowY === 'auto' || styles.overflowY === 'scroll') &&
          node.scrollHeight > node.clientHeight + 1;
        if (canScrollY) {
          return true;
        }
        node = node.parentElement;
      }
      return false;
    };

    const onWheel = (event: globalThis.WheelEvent) => {
      if (event.defaultPrevented || event.ctrlKey) {
        return;
      }
      const eventTarget = event.target as HTMLElement | null;
      if (eventTarget?.closest('.featured-loop-track')) {
        return;
      }
      if (eventTarget?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }
      if (hasScrollableAncestor(eventTarget)) {
        return;
      }

      const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (dominantDelta === 0) {
        return;
      }

      event.preventDefault();
      const modeMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
      target = clampTarget(target + dominantDelta * modeMultiplier * 0.95);
      if (frameId === null) {
        frameId = requestAnimationFrame(animate);
      }
    };

    const syncNativePosition = () => {
      if (frameId !== null) {
        return;
      }
      current = window.scrollY;
      target = window.scrollY;
      updateScrollRatio();
    };

    updateScrollRatio();
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('scroll', syncNativePosition, { passive: true });
    window.addEventListener('resize', syncNativePosition);

    return () => {
      stopAnimation();
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('scroll', syncNativePosition);
      window.removeEventListener('resize', syncNativePosition);
      html.style.removeProperty('--scroll-ratio');
    };
  }, [overlayOpen]);

  const handleFilter = (filteredShips: Ship[]) => {
    setFilteredShips(filteredShips);
  };

  const toggleCompare = (ship: Ship) => {
    const exists = compareList.some((item) => item.id === ship.id);
    if (exists) {
      setCompareList((prev) => prev.filter((item) => item.id !== ship.id));
      flashNotice(`${ship.name} убран из сравнения`);
      return;
    }
    if (compareList.length >= 3) {
      flashNotice('Можно сравнить не более 3 кораблей');
      return;
    }
    setCompareList((prev) => [...prev, ship]);
    flashNotice(`${ship.name} добавлен в сравнение`);
  };

  const addToCart = (ship: Ship) => {
    const exists = cart.some((item) => item.id === ship.id);
    if (!exists) {
      setCart((prev) => [...prev, ship]);
    }
    setCartOpen(true);
    flashNotice(exists ? `${ship.name} уже в корзине` : `${ship.name} добавлен в корзину`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const removeFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((item) => item.id !== id));
  };

  const onCheckoutFieldChange =
    (field: keyof typeof checkoutForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setCheckoutForm((prev) => {
        if (field === 'destinationType') {
          const firstForType = destinationHubs.find((hub) => hub.type === value);
          return {
            ...prev,
            destinationType: value,
            destinationName: firstForType?.name ?? prev.destinationName,
          };
        }
        return {
          ...prev,
          [field]: value,
        };
      });
    };

  const submitCheckout = (event: FormEvent) => {
    event.preventDefault();
    if (cart.length === 0) {
      flashNotice('Корзина пуста: добавьте хотя бы один корабль.');
      return;
    }
    setCheckoutDoneMessage(
      `Заказ принят: ${checkoutForm.destinationName}. Менеджер отправит контракт в канал ${checkoutForm.comms || 'личный dock-канал'}.`,
    );
    setCart([]);
    setCompareList([]);
    setCartOpen(false);
  };

  const reserveShip = (ship: Ship) => {
    addToCart(ship);
    flashNotice(`Резерв оформлен: ${ship.name}`);
  };

  const requestTechSheet = (ship: Ship) => {
    flashNotice(`Полное ТЗ по ${ship.name} отправлено в контактный центр.`);
    setSelectedShip(null);
    const contact = document.getElementById('contact');
    if (contact) {
      contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const featuredCards = featuredShips
    .map((entry) => ({
      entry,
      ship: ships.find((ship) => ship.id === entry.id),
    }))
    .filter((item): item is { entry: typeof featuredShips[number]; ship: Ship } => Boolean(item.ship));

  const featuredLoopCards = useMemo(
    () =>
      Array.from({ length: FEATURED_REPEAT }, (_, loopIndex) =>
        featuredCards.map((item, index) => ({
          ...item,
          key: `${loopIndex}-${index}-${item.ship.id}`,
        })),
      ).flat(),
    [featuredCards],
  );

  useEffect(() => {
    const track = featuredTrackRef.current;
    if (!track || featuredCards.length === 0) {
      return;
    }
    const recenter = () => {
      const segment = track.scrollWidth / FEATURED_REPEAT;
      if (segment > 0) {
        track.scrollLeft = segment * Math.floor(FEATURED_REPEAT / 2);
      }
    };
    recenter();
    window.addEventListener('resize', recenter);
    return () => {
      window.removeEventListener('resize', recenter);
    };
  }, [featuredCards.length]);

  return (
    <div className="min-h-screen bg-dark-navy text-text-light">
      <Navbar />

      <main className="pt-[72px]">
        <Hero onOpenFeaturedShip={(ship) => setSelectedShip(ship)} />

        <section className="py-10 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="holo-pill mb-3">Витрина магазина</p>
                <h2 className="heading-lg">Лучшие предложения</h2>
              </div>
            </div>

            <div className="relative space-bg p-3 sm:p-4">
              <button
                type="button"
                aria-label="Предыдущие предложения"
                onClick={() => scrollFeatured(-1)}
                className="absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-cyan-holo/30 bg-dark-navy/30 p-2.5 text-cyan-holo/85 backdrop-blur-lg transition hover:border-amber-ui/65 hover:bg-dark-navy/45 hover:text-amber-ui sm:left-2"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Следующие предложения"
                onClick={() => scrollFeatured(1)}
                className="absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full border border-cyan-holo/30 bg-dark-navy/30 p-2.5 text-cyan-holo/85 backdrop-blur-lg transition hover:border-amber-ui/65 hover:bg-dark-navy/45 hover:text-amber-ui sm:right-2"
              >
                <ChevronRight size={18} />
              </button>

              <div
                ref={featuredTrackRef}
                className="featured-loop-track flex cursor-grab gap-4 overflow-x-auto px-10 pb-2 pr-2 select-none [scrollbar-width:none] active:cursor-grabbing sm:px-12 [&::-webkit-scrollbar]:hidden"
                onPointerDown={onFeaturedPointerDown}
                onPointerMove={onFeaturedPointerMove}
                onPointerUp={onFeaturedPointerUp}
                onPointerCancel={onFeaturedPointerUp}
                onWheel={onFeaturedWheel}
                onScroll={onFeaturedScroll}
              >
                {featuredLoopCards.map(({ key, entry, ship }) => (
                  <article
                    key={key}
                    data-ship-id={ship.id}
                    className="panel-shell min-w-[288px] cursor-pointer p-4 transition duration-300 hover:-translate-y-1 sm:min-w-[330px]"
                  >
                    <div className="zoomable relative h-44 overflow-hidden rounded-xl">
                      <img src={ship.images[0]} alt={ship.name} className="h-full w-full object-cover" draggable={false} />
                    </div>
                    <div className="mt-4">
                      <p className="font-mono text-xs uppercase tracking-[0.12em] text-amber-ui">{entry.label}</p>
                      <h3 className="mt-2 font-orbitron text-2xl uppercase tracking-[0.08em] text-text-light">{ship.name}</h3>
                      <p className="mt-1 font-rajdhani text-sm text-text-light/70">
                        {classLabels[ship.class]} / Экипаж {ship.crewMin}-{ship.crewMax}
                      </p>
                      <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                        <p className="font-orbitron text-3xl text-amber-ui">${(ship.priceUsd / 1000).toFixed(0)}K</p>
                        <div className="group relative flex flex-wrap items-center gap-2 sm:justify-end">
                          <button
                            type="button"
                            className="rounded-md border border-text-light/25 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text-light/80 transition hover:border-amber-ui/40 hover:text-amber-ui"
                            onClick={(event) => {
                              event.stopPropagation();
                              setSelectedShip(ship);
                            }}
                          >
                            Открыть
                          </button>
                          <button
                            type="button"
                            className="rounded-md border border-cyan-holo/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cyan-holo transition hover:border-cyan-holo/70"
                            onClick={(event) => {
                              event.stopPropagation();
                              setQuickViewShip(ship);
                            }}
                          >
                            Быстрый
                          </button>
                          <button
                            type="button"
                            className="rounded-md border border-amber-ui/45 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-amber-ui transition hover:border-amber-ui/70"
                            onClick={(event) => {
                              event.stopPropagation();
                              addToCart(ship);
                            }}
                          >
                            В корзину
                          </button>
                          <div className="pointer-events-none absolute bottom-full left-1/2 z-20 w-52 -translate-x-1/2 translate-y-2 opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100 sm:w-56">
                            <div className="rounded-xl border border-cyan-holo/35 bg-dark-navy/95 p-2 shadow-[0_16px_40px_rgba(6,4,15,0.65)]">
                              <div className="flex items-center gap-2">
                                <img src={ship.images[0]} alt={ship.name} className="h-14 w-20 rounded-lg object-cover" />
                                <div>
                                  <p className="font-orbitron text-sm uppercase tracking-[0.08em] text-text-light">{ship.name}</p>
                                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-text-light/60">
                                    {classLabels[ship.class]} / {ship.crewMin}-{ship.crewMax}
                                  </p>
                                  <p className="mt-1 font-orbitron text-base text-amber-ui">
                                    ${(ship.priceUsd / 1000).toFixed(0)}K
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <p className="holo-pill mb-4">Каталог флота</p>
              <h2 className="heading-lg text-text-light">Доступные корабли</h2>
              <p className="soft-copy mt-3 max-w-3xl font-rajdhani text-xl leading-relaxed">
                Открывайте карточки, сравнивайте ключевые параметры и сразу переходите к детальным спецификациям,
                фичам и пакетам комплектаций.
              </p>
            </div>

            <ShipFilter ships={ships} onFilter={handleFilter} />

            {manufacturerFocus && (
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-cyan-holo/30 bg-dark-navy/50 px-4 py-3">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-holo">Фильтр по корпорации</p>
                  <p className="mt-1 font-orbitron text-lg uppercase tracking-[0.08em] text-text-light">
                    {manufacturerFocus.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setManufacturerFocusId(null)}
                  className="rounded-md border border-amber-ui/45 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-amber-ui transition hover:border-amber-ui/70"
                >
                  Сбросить фильтр
                </button>
              </div>
            )}

            {displayedShips.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
                <p className="font-rajdhani text-2xl text-text-light/80">Под текущие фильтры модели не найдены.</p>
                <p className="mt-2 font-rajdhani text-lg text-text-light/60">
                  Сбросьте фильтры, чтобы снова увидеть весь каталог.
                </p>
                {manufacturerFocusId && (
                  <button
                    type="button"
                    onClick={() => setManufacturerFocusId(null)}
                    className="mt-4 rounded-md border border-amber-ui/45 px-4 py-2 font-mono text-xs uppercase tracking-[0.12em] text-amber-ui"
                  >
                    Сбросить фильтр бренда
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <section id="about" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <p className="holo-pill mb-4">Преимущества</p>
              <h2 className="heading-lg text-text-light">Почему выбирают Void Hangar</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <article className="panel-shell p-6">
                <p className="font-mono text-2xl text-amber-ui">01</p>
                <h3 className="mt-3 font-oxanium text-2xl uppercase tracking-[0.08em] text-text-light">Точная сборка</h3>
                <p className="mt-3 font-rajdhani text-lg text-text-light/70">
                  Каждый корабль проходит многоступенчатую проверку систем, включая диагностику тяги,
                  защитных модулей и автопилота.
                </p>
              </article>

              <article className="panel-shell p-6">
                <p className="font-mono text-2xl text-amber-ui">02</p>
                <h3 className="mt-3 font-oxanium text-2xl uppercase tracking-[0.08em] text-text-light">Премиум UX кокпита</h3>
                <p className="mt-3 font-rajdhani text-lg text-text-light/70">
                  Гибкие голографические интерфейсы, адаптивная подсветка и логика управления,
                  рассчитанная на длительные полеты.
                </p>
              </article>

              <article className="panel-shell p-6">
                <p className="font-mono text-2xl text-amber-ui">03</p>
                <h3 className="mt-3 font-oxanium text-2xl uppercase tracking-[0.08em] text-text-light">Поддержка на годы</h3>
                <p className="mt-3 font-rajdhani text-lg text-text-light/70">
                  Сервисные пакеты, удаленный мониторинг и выделенная инженерная линия поддержки
                  в режиме 24/7.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <p className="holo-pill mb-4">Производители</p>
              <h2 className="heading-lg text-text-light">Корпорации и верфи</h2>
              <p className="soft-copy mt-3 max-w-3xl font-rajdhani text-xl leading-relaxed">
                Нажмите на корпорацию, чтобы открыть профиль верфи и увидеть, какие серии она ведет в текущем сезоне.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {manufacturers.map((manufacturer) => {
                const brandShips = shipsByManufacturer[manufacturer.id] ?? [];
                return (
                  <article key={manufacturer.id} className="panel-shell p-5 text-left">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-xs uppercase tracking-[0.15em] text-cyan-holo">{manufacturer.short}</p>
                        <h3 className="mt-2 font-orbitron text-lg uppercase tracking-[0.06em] text-text-light">
                          {manufacturer.name}
                        </h3>
                        <p className="mt-1 font-rajdhani text-sm text-amber-ui">{manufacturer.origin}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveManufacturer(manufacturer)}
                        className="rounded-md border border-cyan-holo/35 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cyan-holo hover:border-amber-ui/45 hover:text-amber-ui"
                      >
                        О бренде
                      </button>
                    </div>
                    <p className="mt-2 font-rajdhani text-base text-text-light/70">{manufacturer.summary}</p>

                    <div className="mt-4">
                      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-light/50">Модели бренда</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {brandShips.map((ship) => (
                          <button
                            key={ship.id}
                            type="button"
                            onClick={() => focusManufacturer(manufacturer.id, ship)}
                            className="rounded-md border border-cyan-holo/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text-light/80 hover:border-amber-ui/45 hover:text-amber-ui"
                          >
                            {ship.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <p className="holo-pill mb-4">Лор системы</p>
              <h2 className="heading-lg text-text-light">Как устроен рынок полетов в Sol-Transit</h2>
              <p className="soft-copy mt-3 max-w-4xl font-rajdhani text-xl leading-relaxed">
                Каждая модель в каталоге привязана к реальной сети доков, страховых протоколов и коридоров навигации.
                Поэтому карточки отражают не только стиль, но и эксплуатационную экономику.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {loreNodes.map((node) => (
                <article key={node.title} className="panel-shell p-6">
                  <h3 className="font-oxanium text-2xl uppercase tracking-[0.08em] text-amber-ui">{node.title}</h3>
                  <p className="mt-3 font-rajdhani text-lg text-text-light/72">{node.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <p className="holo-pill mb-4">Сценарии</p>
              <h2 className="heading-lg text-text-light">Под какие задачи подойдут модели</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {missionProfiles.map((profile) => (
                <article key={profile.title} className="panel-shell p-6">
                  <h3 className="font-oxanium text-2xl uppercase tracking-[0.08em] text-amber-ui">{profile.title}</h3>
                  <p className="mt-3 font-rajdhani text-lg text-text-light/70">{profile.text}</p>
                  <ul className="mt-4 space-y-2">
                    {profile.points.map((point) => (
                      <li key={point} className="font-rajdhani text-base text-text-light/80">
                        + {point}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <p className="holo-pill mb-4">Процесс</p>
              <h2 className="heading-lg text-text-light">Как проходит покупка</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              {purchaseFlow.map((item) => (
                <article key={item.step} className="panel-shell p-6">
                  <p className="font-mono text-2xl text-amber-ui">{item.step}</p>
                  <h3 className="mt-3 font-oxanium text-2xl uppercase tracking-[0.08em] text-text-light">{item.title}</h3>
                  <p className="mt-3 font-rajdhani text-lg text-text-light/70">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <p className="holo-pill mb-4">Частые вопросы</p>
              <h2 className="heading-lg text-text-light">Частые вопросы</h2>
            </div>

            <div className="space-y-4">
              {faqItems.map((item) => (
                <details key={item.q} className="panel-shell p-5 open:border-amber-ui/45">
                  <summary className="cursor-pointer list-none font-oxanium text-xl uppercase tracking-[0.06em] text-text-light">
                    {item.q}
                  </summary>
                  <p className="mt-3 font-rajdhani text-lg text-text-light/72">{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="pb-16 pt-10 sm:pb-20 sm:pt-14">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 text-center">
              <p className="holo-pill mb-4">Связь с доком</p>
              <h2 className="heading-lg text-text-light">Оставить заявку</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
              <div className="panel-shell p-5 sm:p-7 lg:col-span-3">
                <form
                  className="space-y-5"
                  onSubmit={(event) => {
                    event.preventDefault();
                  }}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Ваше имя"
                      className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-4 py-3 font-rajdhani text-lg text-text-light placeholder:text-text-light/35 focus:border-amber-ui/55 focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-4 py-3 font-rajdhani text-lg text-text-light placeholder:text-text-light/35 focus:border-amber-ui/55 focus:outline-none"
                    />
                  </div>

                  <select
                    defaultValue=""
                    className="w-full rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-4 py-3 font-rajdhani text-lg text-text-light focus:border-amber-ui/55 focus:outline-none"
                  >
                    <option value="" disabled>
                      Выберите модель корабля
                    </option>
                    {ships.map((ship) => (
                      <option key={ship.id} value={ship.id} className="bg-panel-dark text-text-light">
                        {ship.name}
                      </option>
                    ))}
                  </select>

                  <textarea
                    rows={5}
                    placeholder="Опишите задачу, маршрут и желаемую комплектацию..."
                    className="w-full resize-none rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-4 py-3 font-rajdhani text-lg text-text-light placeholder:text-text-light/35 focus:border-amber-ui/55 focus:outline-none"
                  />

                  <button type="submit" className="btn-primary w-full">
                    ОТПРАВИТЬ ЗАПРОС
                  </button>
                </form>
              </div>

              <aside className="panel-shell space-y-4 p-5 lg:col-span-2">
                <h3 className="font-oxanium text-2xl uppercase tracking-[0.08em] text-amber-ui">Контактные данные</h3>
                <p className="font-rajdhani text-lg text-text-light/75">Neo-Tokyo Orbital Platform, сектор D-17</p>
                <p className="font-rajdhani text-lg text-text-light/75">Ежедневно: 09:00 - 23:00 (UTC+3)</p>
                <p className="font-mono text-sm uppercase tracking-[0.12em] text-cyan-holo">reservations@voidhangar.space</p>
                <p className="font-mono text-sm uppercase tracking-[0.12em] text-cyan-holo">+1 (800) 555-ORBIT</p>
                <div className="rounded-lg border border-cyan-holo/25 bg-dark-navy/35 p-4">
                  <p className="font-rajdhani text-lg text-text-light/72">
                    Ответ менеджера: обычно в течение 30 минут в рабочее время.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {selectedShip && (
        <ShipDetail
          ship={selectedShip}
          onClose={() => setSelectedShip(null)}
          manufacturer={getManufacturer(selectedShip.manufacturerId)}
          onManufacturerClick={(id) => focusManufacturer(id)}
          onPrevShip={() => navigateSelectedShip(-1)}
          onNextShip={() => navigateSelectedShip(1)}
          onReserveShip={reserveShip}
          onRequestTechSheet={requestTechSheet}
        />
      )}

      {quickViewShip && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-dark-navy/70 px-4 py-10"
          onClick={() => setQuickViewShip(null)}
        >
          <div className="panel-shell max-w-3xl p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-amber-ui">Быстрый просмотр</p>
                <h3 className="mt-2 font-orbitron text-2xl text-text-light">{quickViewShip.name}</h3>
                <p className="mt-1 font-rajdhani text-base text-text-light/70">
                  {classLabels[quickViewShip.class]} / Экипаж {quickViewShip.crewMin}-{quickViewShip.crewMax}
                </p>
              </div>
              <button
                type="button"
                className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
                onClick={() => setQuickViewShip(null)}
              >
                Закрыть
              </button>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="zoomable relative h-52 overflow-hidden rounded-xl">
                <img src={quickViewShip.images[0]} alt={quickViewShip.name} className="h-full w-full object-cover" />
              </div>
              <div className="space-y-3">
                <p className="font-rajdhani text-lg text-text-light/75">{quickViewShip.description}</p>
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-light/55">Цена от</p>
                  <p className="font-orbitron text-2xl text-amber-ui">${(quickViewShip.priceUsd / 1000).toFixed(0)}K</p>
                </div>
                <button
                  className="btn-primary w-full"
                  type="button"
                  onClick={() => {
                    addToCart(quickViewShip);
                    setQuickViewShip(null);
                  }}
                >
                  В корзину
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-6 right-6 z-[65] flex flex-col gap-3">
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="rounded-xl border border-amber-ui/45 bg-dark-navy/70 px-4 py-2 font-orbitron text-xs uppercase tracking-[0.14em] text-amber-ui backdrop-blur-xl transition hover:border-amber-ui/70 hover:bg-dark-navy"
        >
          Корзина ({cart.length})
        </button>
        <button
          type="button"
          onClick={() => setCompareOpen(true)}
          className="rounded-xl border border-cyan-holo/40 bg-dark-navy/70 px-4 py-2 font-orbitron text-xs uppercase tracking-[0.14em] text-cyan-holo backdrop-blur-xl transition hover:border-cyan-holo/70 hover:bg-dark-navy"
        >
          Сравнить ({compareList.length})
        </button>
      </div>

      {cartOpen && (
        <div className="fixed inset-0 z-[76] bg-dark-navy/75 backdrop-blur-md" onClick={() => setCartOpen(false)}>
          <aside
            className="ml-auto h-full w-full max-w-[560px] overflow-y-auto border-l border-cyan-holo/25 bg-dark-navy/95 p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-holo">Checkout Dock</p>
                <h3 className="mt-1 font-orbitron text-2xl uppercase text-text-light">Корзина и доставка</h3>
              </div>
              <button
                type="button"
                className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
                onClick={() => setCartOpen(false)}
              >
                Закрыть
              </button>
            </div>

            <div className="panel-shell p-4">
              <div className="flex items-center justify-between">
                <p className="font-orbitron text-sm uppercase tracking-[0.12em] text-amber-ui">Текущие позиции</p>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-text-light/60">{cart.length} шт</p>
              </div>
              {cart.length === 0 ? (
                <p className="mt-3 font-rajdhani text-base text-text-light/65">Корзина пустая. Добавьте корабли из каталога.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="rounded-lg border border-cyan-holo/20 bg-dark-navy/45 p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-rajdhani text-lg text-text-light">{item.name}</p>
                          <p className="font-mono text-xs uppercase tracking-[0.1em] text-text-light/50">
                            {availabilityLabels[item.availability]}
                          </p>
                        </div>
                        <button
                          type="button"
                          className="rounded border border-amber-ui/45 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-amber-ui"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Удалить
                        </button>
                      </div>
                      <p className="mt-2 font-orbitron text-xl text-amber-ui">${(item.priceUsd / 1000).toFixed(0)}K</p>
                    </div>
                  ))}
                </div>
              )}
              <div className="mt-4 flex items-center justify-between border-t border-cyan-holo/20 pt-3">
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-light/55">Итого</p>
                <p className="font-orbitron text-2xl text-amber-ui">${(cartTotal / 1000).toFixed(0)}K</p>
              </div>
            </div>

            <form className="mt-5 space-y-4" onSubmit={submitCheckout}>
              <div className="panel-shell p-4">
                <p className="font-orbitron text-sm uppercase tracking-[0.12em] text-cyan-holo">Куда доставить</p>
                <div className="mt-3 grid grid-cols-1 gap-3">
                  <select
                    value={checkoutForm.destinationType}
                    onChange={onCheckoutFieldChange('destinationType')}
                    className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light focus:border-amber-ui/55 focus:outline-none"
                  >
                    {Array.from(new Set(destinationHubs.map((hub) => hub.type))).map((type) => (
                      <option key={type} value={type} className="bg-panel-dark text-text-light">
                        {type}
                      </option>
                    ))}
                  </select>

                  <select
                    value={checkoutForm.destinationName}
                    onChange={onCheckoutFieldChange('destinationName')}
                    className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light focus:border-amber-ui/55 focus:outline-none"
                  >
                    {availableDestinations.map((hub) => (
                      <option key={hub.name} value={hub.name} className="bg-panel-dark text-text-light">
                        {hub.name}
                      </option>
                    ))}
                  </select>

                  <select
                    value={checkoutForm.deliverySlot}
                    onChange={onCheckoutFieldChange('deliverySlot')}
                    className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light focus:border-amber-ui/55 focus:outline-none"
                  >
                    <option value="Ближайшее окно">Ближайшее окно</option>
                    <option value="Премиум быстрый коридор">Премиум быстрый коридор</option>
                    <option value="Ночная скрытая поставка">Ночная скрытая поставка</option>
                  </select>
                </div>
              </div>

              <div className="panel-shell p-4">
                <p className="font-orbitron text-sm uppercase tracking-[0.12em] text-cyan-holo">Канал оплаты и контакт</p>
                <div className="mt-3 grid grid-cols-1 gap-3">
                  <select
                    value={checkoutForm.paymentMethod}
                    onChange={onCheckoutFieldChange('paymentMethod')}
                    className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light focus:border-amber-ui/55 focus:outline-none"
                  >
                    {paymentMethods.map((method) => (
                      <option key={method} value={method} className="bg-panel-dark text-text-light">
                        {method}
                      </option>
                    ))}
                  </select>
                  <input
                    value={checkoutForm.recipient}
                    onChange={onCheckoutFieldChange('recipient')}
                    placeholder="Получатель / капитан экипажа"
                    className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light placeholder:text-text-light/35 focus:border-amber-ui/55 focus:outline-none"
                  />
                  <input
                    value={checkoutForm.comms}
                    onChange={onCheckoutFieldChange('comms')}
                    placeholder="Контактный канал (dock-id, comm-link)"
                    className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light placeholder:text-text-light/35 focus:border-amber-ui/55 focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    value={checkoutForm.notes}
                    onChange={onCheckoutFieldChange('notes')}
                    placeholder="Комментарий к доставке и передаче корабля"
                    className="rounded-lg border border-cyan-holo/30 bg-dark-navy/45 px-3 py-2 font-rajdhani text-lg text-text-light placeholder:text-text-light/35 focus:border-amber-ui/55 focus:outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full" disabled={cart.length === 0}>
                ОФОРМИТЬ ДОСТАВКУ И ОПЛАТУ
              </button>
            </form>
          </aside>
        </div>
      )}

      {compareOpen && (
        <div className="fixed inset-0 z-[74] bg-dark-navy/70 backdrop-blur-sm" onClick={() => setCompareOpen(false)}>
          <aside
            className="mx-auto mt-20 w-[min(980px,96vw)] rounded-2xl border border-cyan-holo/25 bg-dark-navy/95 p-5 sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-orbitron text-xl uppercase tracking-[0.1em] text-text-light">Сравнение моделей</h3>
              <button
                type="button"
                onClick={() => setCompareOpen(false)}
                className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
              >
                Закрыть
              </button>
            </div>
            {compareList.length === 0 ? (
              <p className="font-rajdhani text-lg text-text-light/70">Список пуст. Добавьте до трёх кораблей в сравнение.</p>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {compareList.map((item) => (
                  <article key={item.id} className="panel-shell p-4">
                    <h4 className="font-orbitron text-lg uppercase tracking-[0.08em] text-amber-ui">{item.name}</h4>
                    <p className="mt-1 font-rajdhani text-sm text-text-light/65">
                      {classLabels[item.class]} / Экипаж {item.crewMin}-{item.crewMax}
                    </p>
                    <div className="mt-3 space-y-1 font-rajdhani text-base text-text-light/75">
                      <p>Дальность: {item.specs.rangeKm} км</p>
                      <p>Крейсер: {item.specs.cruiseKmS} км/с</p>
                      <p>Подготовка: {item.specs.launchReadyMin} мин</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCompareOpen(false);
                        setSelectedShip(item);
                      }}
                      className="mt-4 rounded-md border border-amber-ui/45 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-amber-ui"
                    >
                      Открыть карточку
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromCompare(item.id)}
                      className="mt-2 rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
                    >
                      Удалить из сравнения
                    </button>
                  </article>
                ))}
              </div>
            )}
          </aside>
        </div>
      )}

      {uiNotice && (
        <div className="fixed bottom-6 left-1/2 z-[90] -translate-x-1/2 rounded-xl border border-amber-ui/45 bg-dark-navy/85 px-4 py-2 font-rajdhani text-lg text-text-light backdrop-blur-xl">
          {uiNotice}
        </div>
      )}

      {checkoutDoneMessage && (
        <div className="fixed left-1/2 top-24 z-[85] w-[min(760px,94vw)] -translate-x-1/2 rounded-2xl border border-cyan-holo/35 bg-dark-navy/92 p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <p className="font-rajdhani text-lg text-text-light/82">{checkoutDoneMessage}</p>
            <button
              type="button"
              onClick={() => setCheckoutDoneMessage(null)}
              className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
            >
              ОК
            </button>
          </div>
        </div>
      )}

      {activeManufacturer && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-dark-navy/70 px-4"
          onClick={() => setActiveManufacturer(null)}
        >
          <div className="panel-shell max-w-xl p-6" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.14em] text-cyan-holo">{activeManufacturer.short}</p>
                <h3 className="mt-2 font-orbitron text-2xl uppercase tracking-[0.08em] text-text-light">
                  {activeManufacturer.name}
                </h3>
                <p className="mt-1 font-rajdhani text-base text-amber-ui">{activeManufacturer.origin}</p>
              </div>
              <button
                type="button"
                className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
                onClick={() => setActiveManufacturer(null)}
              >
                Закрыть
              </button>
            </div>
            <p className="mt-4 font-rajdhani text-lg leading-relaxed text-text-light/75">{activeManufacturer.summary}</p>
            <div className="mt-4">
              <p className="font-mono text-xs uppercase tracking-[0.14em] text-text-light/55">Линейки в каталоге</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(shipsByManufacturer[activeManufacturer.id] ?? []).map((ship) => (
                  <button
                    key={ship.id}
                    type="button"
                    onClick={() => focusManufacturer(activeManufacturer.id, ship)}
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
                onClick={() => focusManufacturer(activeManufacturer.id)}
              >
                Показать модели
              </button>
              <button
                type="button"
                className="rounded-md border border-cyan-holo/35 px-3 py-1 font-mono text-xs uppercase tracking-[0.12em] text-cyan-holo"
                onClick={() => setActiveManufacturer(null)}
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
