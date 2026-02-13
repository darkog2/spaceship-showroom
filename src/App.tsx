import { useState } from 'react';
import Footer from './components/Footer';
import { useEffect, useMemo, useRef, type ChangeEvent, type FormEvent, type MouseEvent as ReactMouseEvent, type PointerEvent, type WheelEvent } from 'react';
import Hero from './components/Hero';
import Navbar from './components/Navbar';
import SectionOrbitNav from './components/SectionOrbitNav';
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
const FEATURED_DEFAULT_CENTER_SHIP_ID = 'solstice-r9';
const FEATURED_LOOP_CARD_SELECTOR = '[data-featured-loop-card="true"]';
const FEATURED_MAX_VELOCITY = 6.6;
const FEATURED_MIN_VELOCITY = 0.014;
const FEATURED_DECAY_PER_FRAME = 0.948;
const FEATURED_INPUT_WINDOW_MS = 270;
const FEATURED_BOOST_STEP = 0.18;
const FEATURED_BOOST_CAP = 3.1;
const FEATURED_DRAG_RELEASE_MULTIPLIER = 6.8;
const FEATURED_WHEEL_IMPULSE_BASE = 0.0023;
const FEATURED_GLIDE_MIN_MS = 120;
const FEATURED_GLIDE_MAX_MS = 340;
const FEATURED_DOCK_IDLE_MS = 220;
const FEATURED_DOCK_RECHECK_MS = 92;
const FEATURED_DOCK_MIN_MS = 320;
const FEATURED_DOCK_MAX_MS = 640;
const FEATURED_DOCK_MIN_DISTANCE = 0.6;
const FEATURED_DOCK_VELOCITY_EPS = 0.04;
const FEATURED_DOCK_FINAL_CORRECTION_PX = 1.2;
const FEATURED_ARROW_PLASMA_POWER = 1.18;
const FEATURED_ARROW_PLASMA_MS = 340;
const NAV_SCROLL_OFFSET = 72;
const QUICK_NAV_SETTLE_MS = 300;
const MANUFACTURER_PREVIEW_LINGER_MS = 2200;
const MANUFACTURER_PREVIEW_FADE_MS = 260;
const quickNavSections = [
  { id: 'home', label: 'Главная' },
  { id: 'featured', label: 'Витрина' },
  { id: 'catalog', label: 'Каталог' },
  { id: 'about', label: 'Преимущества' },
  { id: 'journey', label: 'Сценарии' },
  { id: 'contact', label: 'Контакты' },
] as const;

type QuickNavSectionId = (typeof quickNavSections)[number]['id'];
type QuickNavScrollLock = {
  targetId: QuickNavSectionId;
};
type ManufacturerChipPreview = {
  ship: Ship;
  left: number;
  top: number;
  visible: boolean;
};

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
  const [activeQuickNavSection, setActiveQuickNavSection] = useState<QuickNavSectionId>('home');
  const [featuredArrowPulseDirection, setFeaturedArrowPulseDirection] = useState<1 | -1 | 0>(0);
  const [featuredVariantByShip, setFeaturedVariantByShip] = useState<Record<string, number>>({});
  const [manufacturerChipPreview, setManufacturerChipPreview] = useState<ManufacturerChipPreview | null>(null);
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
  const sectionSnapLockRef = useRef(false);
  const sectionSnapUnlockTimerRef = useRef<number | null>(null);
  const sectionSnapLastDirectionRef = useRef<1 | -1 | 0>(0);
  const sectionSnapLastTimeRef = useRef(0);
  const tiltHoverRef = useRef<HTMLElement | null>(null);
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
  const featuredGlideRef = useRef<number | null>(null);
  const featuredGlideStateRef = useRef<{
    start: number;
    from: number;
    to: number;
    duration: number;
    keepLooping: boolean;
    onComplete: (() => void) | null;
  } | null>(null);
  const featuredDockTimerRef = useRef<number | null>(null);
  const featuredArrowPlasmaTimerRef = useRef<number | null>(null);
  const featuredLastMotionAtRef = useRef(0);
  const featuredVelocityRef = useRef(0);
  const featuredLastFrameRef = useRef(0);
  const featuredInputRhythmRef = useRef({ lastInput: 0, streak: 0 });
  const smoothScrollFrameRef = useRef<number | null>(null);
  const smoothScrollCompleteRef = useRef<(() => void) | null>(null);
  const smoothScrollCssBehaviorRef = useRef<string | null>(null);
  const quickNavScrollLockRef = useRef<QuickNavScrollLock | null>(null);
  const quickNavSettleRef = useRef<{ id: QuickNavSectionId; until: number } | null>(null);
  const noticeTimeoutRef = useRef<number | null>(null);
  const manufacturerPreviewHoldRef = useRef<number | null>(null);
  const manufacturerPreviewFadeRef = useRef<number | null>(null);

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

  const smoothScrollToY = (targetTop: number, durationHint = 320, onComplete?: () => void) => {
    const html = document.documentElement;
    const topLimit = Math.max(0, html.scrollHeight - window.innerHeight);
    const target = Math.max(0, Math.min(topLimit, targetTop));
    const from = window.scrollY;
    const distance = target - from;

    if (smoothScrollCssBehaviorRef.current !== null) {
      html.style.scrollBehavior = smoothScrollCssBehaviorRef.current;
      smoothScrollCssBehaviorRef.current = null;
    }

    if (Math.abs(distance) < 1) {
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, target);
      html.style.scrollBehavior = prevBehavior;
      onComplete?.();
      return 0;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const prevBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = 'auto';
      window.scrollTo(0, target);
      html.style.scrollBehavior = prevBehavior;
      onComplete?.();
      return 0;
    }

    if (smoothScrollFrameRef.current !== null) {
      cancelAnimationFrame(smoothScrollFrameRef.current);
      smoothScrollFrameRef.current = null;
    }
    smoothScrollCompleteRef.current = null;
    smoothScrollCssBehaviorRef.current = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';

    const duration = Math.max(320, Math.min(980, durationHint + Math.min(280, Math.abs(distance) * 0.15)));
    const started = performance.now();
    const easeInOutQuint = (value: number) =>
      value < 0.5 ? 16 * value * value * value * value * value : 1 - Math.pow(-2 * value + 2, 5) / 2;

    const step = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      const eased = easeInOutQuint(progress);
      window.scrollTo(0, from + distance * eased);
      if (progress < 1) {
        smoothScrollFrameRef.current = requestAnimationFrame(step);
      } else {
        smoothScrollFrameRef.current = null;
        if (smoothScrollCssBehaviorRef.current !== null) {
          html.style.scrollBehavior = smoothScrollCssBehaviorRef.current;
          smoothScrollCssBehaviorRef.current = null;
        }
        const finish = smoothScrollCompleteRef.current;
        smoothScrollCompleteRef.current = null;
        finish?.();
      }
    };

    smoothScrollCompleteRef.current = onComplete ?? null;
    smoothScrollFrameRef.current = requestAnimationFrame(step);
    return duration;
  };

  const scrollToCatalog = () => {
    const section = document.getElementById('catalog');
    if (section) {
      const headerOffset = NAV_SCROLL_OFFSET;
      const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;
      smoothScrollToY(top, 320);
    }
  };

  const scrollToQuickNavSection = (id: QuickNavSectionId) => {
    const section = document.getElementById(id);
    if (!section) {
      return;
    }
    const headerOffset = NAV_SCROLL_OFFSET;
    const top = section.getBoundingClientRect().top + window.scrollY - headerOffset;
    const topLimit = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    const clampedTop = Math.max(0, Math.min(topLimit, top));

    quickNavSettleRef.current = null;
    quickNavScrollLockRef.current = {
      targetId: id,
    };

    setActiveQuickNavSection(id);
    smoothScrollToY(clampedTop, 760, () => {
      const lock = quickNavScrollLockRef.current;
      if (!lock || lock.targetId !== id) {
        return;
      }
      quickNavSettleRef.current = {
        id,
        until: performance.now() + QUICK_NAV_SETTLE_MS,
      };
      quickNavScrollLockRef.current = null;
    });
  };

  const getFeaturedInputBoost = () => {
    const now = performance.now();
    const rhythm = featuredInputRhythmRef.current;
    const elapsed = now - rhythm.lastInput;
    if (elapsed < FEATURED_INPUT_WINDOW_MS) {
      rhythm.streak = Math.min(rhythm.streak + 1, 16);
    } else if (elapsed < FEATURED_INPUT_WINDOW_MS * 2.6) {
      rhythm.streak = Math.max(0, rhythm.streak - 1);
    } else {
      rhythm.streak = 0;
    }
    rhythm.lastInput = now;
    return Math.min(FEATURED_BOOST_CAP, 1 + Math.max(0, rhythm.streak - 1) * FEATURED_BOOST_STEP);
  };

  const setFeaturedVariant = (shipId: string, variantIndex: number) => {
    setFeaturedVariantByShip((prev) => {
      if (prev[shipId] === variantIndex) {
        return prev;
      }
      return {
        ...prev,
        [shipId]: variantIndex,
      };
    });
  };

  const applyCardTilt = (element: HTMLElement, clientX: number, clientY: number, intensity = 1) => {
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) {
      return;
    }
    const offsetX = (clientX - rect.left) / rect.width - 0.5;
    const offsetY = (clientY - rect.top) / rect.height - 0.5;
    const rotateX = -offsetY * 2.6 * intensity;
    const rotateY = offsetX * 3.2 * intensity;
    const shiftX = offsetX * 3.6 * intensity;
    const shiftY = offsetY * 2.8 * intensity;
    element.style.setProperty('--card-tilt-x', `${rotateX.toFixed(3)}deg`);
    element.style.setProperty('--card-tilt-y', `${rotateY.toFixed(3)}deg`);
    element.style.setProperty('--card-shift-x', `${shiftX.toFixed(3)}px`);
    element.style.setProperty('--card-shift-y', `${shiftY.toFixed(3)}px`);
  };

  const resetCardTilt = (element: HTMLElement) => {
    element.style.setProperty('--card-tilt-x', '0deg');
    element.style.setProperty('--card-tilt-y', '0deg');
    element.style.setProperty('--card-shift-x', '0px');
    element.style.setProperty('--card-shift-y', '0px');
  };

  const onFeaturedCardMouseMove = (event: ReactMouseEvent<HTMLElement>) => {
    applyCardTilt(event.currentTarget, event.clientX, event.clientY, 1.28);
  };

  const onFeaturedCardMouseLeave = (event: ReactMouseEvent<HTMLElement>) => {
    resetCardTilt(event.currentTarget);
  };

  const applyHoverTilt = (element: HTMLElement, event: globalThis.PointerEvent) => {
    const isButton = element.tagName === 'BUTTON';
    const intensity = isButton ? 0.55 : 0.85;
    applyCardTilt(element, event.clientX, event.clientY, intensity);
  };

  const resetHoverTilt = (element: HTMLElement) => {
    resetCardTilt(element);
  };

  const clearManufacturerPreviewTimers = () => {
    if (manufacturerPreviewHoldRef.current !== null) {
      clearTimeout(manufacturerPreviewHoldRef.current);
      manufacturerPreviewHoldRef.current = null;
    }
    if (manufacturerPreviewFadeRef.current !== null) {
      clearTimeout(manufacturerPreviewFadeRef.current);
      manufacturerPreviewFadeRef.current = null;
    }
  };

  const showManufacturerChipPreview = (ship: Ship, anchorElement: HTMLElement) => {
    clearManufacturerPreviewTimers();
    const rect = anchorElement.getBoundingClientRect();
    const width = 280;
    const left = Math.max(width / 2 + 18, Math.min(window.innerWidth - width / 2 - 18, rect.left + rect.width / 2));
    const top = Math.max(90, rect.top - 8);
    setManufacturerChipPreview({
      ship,
      left,
      top,
      visible: true,
    });
  };

  const hideManufacturerChipPreview = (linger = MANUFACTURER_PREVIEW_LINGER_MS) => {
    clearManufacturerPreviewTimers();
    manufacturerPreviewHoldRef.current = window.setTimeout(() => {
      setManufacturerChipPreview((prev) => (prev ? { ...prev, visible: false } : prev));
      manufacturerPreviewFadeRef.current = window.setTimeout(() => {
        setManufacturerChipPreview((prev) => (prev && !prev.visible ? null : prev));
      }, MANUFACTURER_PREVIEW_FADE_MS);
    }, linger);
  };

  const openShipFromManufacturerPreview = (ship: Ship) => {
    clearManufacturerPreviewTimers();
    setManufacturerChipPreview(null);
    setSelectedShip(ship);
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

  const stopFeaturedGlide = () => {
    if (featuredGlideRef.current !== null) {
      cancelAnimationFrame(featuredGlideRef.current);
      featuredGlideRef.current = null;
    }
    featuredGlideStateRef.current = null;
  };

  const clearFeaturedDockTimer = () => {
    if (featuredDockTimerRef.current !== null) {
      clearTimeout(featuredDockTimerRef.current);
      featuredDockTimerRef.current = null;
    }
  };

  const clearFeaturedArrowPlasmaTimer = () => {
    if (featuredArrowPlasmaTimerRef.current !== null) {
      clearTimeout(featuredArrowPlasmaTimerRef.current);
      featuredArrowPlasmaTimerRef.current = null;
    }
  };

  const markFeaturedMotion = () => {
    featuredLastMotionAtRef.current = performance.now();
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

  const igniteFeaturedArrowPlasma = (direction: 1 | -1) => {
    setFeaturedArrowPulseDirection(direction);
    setFeaturedPlasma(FEATURED_ARROW_PLASMA_POWER);
    clearFeaturedArrowPlasmaTimer();
    featuredArrowPlasmaTimerRef.current = window.setTimeout(() => {
      featuredArrowPlasmaTimerRef.current = null;
      setFeaturedArrowPulseDirection(0);
      const isMoving =
        featuredDragRef.current.active ||
        featuredGlideRef.current !== null ||
        Math.abs(featuredVelocityRef.current) >= FEATURED_DOCK_VELOCITY_EPS;
      if (!isMoving) {
        setFeaturedPlasma(0);
      }
    }, FEATURED_ARROW_PLASMA_MS);
  };

  const applyFeaturedInertia = (impulse: number, mode: 'add' | 'replace' = 'add') => {
    const currentVelocity = featuredVelocityRef.current;
    if (mode === 'replace') {
      if (currentVelocity !== 0 && Math.sign(currentVelocity) === Math.sign(impulse)) {
        featuredVelocityRef.current = currentVelocity + impulse * 0.72;
      } else {
        featuredVelocityRef.current = impulse;
      }
    } else {
      featuredVelocityRef.current += impulse;
      if (
        currentVelocity !== 0 &&
        Math.sign(currentVelocity) === Math.sign(impulse) &&
        Math.abs(currentVelocity) > 1.15
      ) {
        featuredVelocityRef.current += impulse * 0.15;
      }
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
      setFeaturedPlasma(Math.min(Math.abs(featuredVelocityRef.current) / 3.15, 1.6));

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

  const glideFeaturedBy = (
    distance: number,
    durationHint = 220,
    options?: { keepLooping?: boolean; onComplete?: () => void },
  ) => {
    const track = featuredTrackRef.current;
    if (!track || Math.abs(distance) < 0.5) {
      return;
    }

    const now = performance.now();
    const duration = Math.max(FEATURED_GLIDE_MIN_MS, Math.min(FEATURED_GLIDE_MAX_MS, durationHint));
    const easeOutQuart = (value: number) => 1 - Math.pow(1 - value, 4);

    let from = track.scrollLeft;
    let to = from + distance;
    let keepLooping = options?.keepLooping ?? true;
    let onComplete = options?.onComplete ?? null;
    const running = featuredGlideStateRef.current;
    if (running) {
      const progress = Math.min(1, Math.max(0, (now - running.start) / running.duration));
      const eased = easeOutQuart(progress);
      from = running.from + (running.to - running.from) * eased;
      to = running.to + distance;
      keepLooping = options?.keepLooping ?? running.keepLooping;
      onComplete = options?.onComplete ?? running.onComplete;
    }

    featuredGlideStateRef.current = {
      start: now,
      from,
      to,
      duration,
      keepLooping,
      onComplete,
    };

    if (featuredGlideRef.current !== null) {
      return;
    }

    const step = (timestamp: number) => {
      const state = featuredGlideStateRef.current;
      const nextTrack = featuredTrackRef.current;
      if (!state || !nextTrack) {
        featuredGlideRef.current = null;
        featuredGlideStateRef.current = null;
        return;
      }

      const progress = Math.min(1, Math.max(0, (timestamp - state.start) / state.duration));
      const eased = easeOutQuart(progress);
      nextTrack.scrollLeft = state.from + (state.to - state.from) * eased;
      if (state.keepLooping) {
        keepFeaturedLooped();
      }

      if (progress < 1) {
        featuredGlideRef.current = requestAnimationFrame(step);
      } else {
        featuredGlideRef.current = null;
        featuredGlideStateRef.current = null;
        state.onComplete?.();
      }
    };

    featuredGlideRef.current = requestAnimationFrame(step);
  };

  const getFeaturedLoopCardElements = () => {
    const track = featuredTrackRef.current;
    if (!track) {
      return [] as HTMLElement[];
    }
    return Array.from(track.querySelectorAll<HTMLElement>(FEATURED_LOOP_CARD_SELECTOR));
  };

  const getFeaturedCardCenterScroll = (track: HTMLDivElement, card: HTMLElement) =>
    card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;

  const findClosestFeaturedCardIndex = (track: HTMLDivElement, cards: HTMLElement[]) => {
    const viewportCenter = track.scrollLeft + track.clientWidth / 2;
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    cards.forEach((card, index) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const distance = Math.abs(cardCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return closestIndex;
  };

  const centerFeaturedCardByLoopIndex = (loopCardIndex: number, options?: { immediate?: boolean; durationHint?: number }) => {
    const track = featuredTrackRef.current;
    if (!track) {
      return;
    }

    const cards = getFeaturedLoopCardElements();
    if (cards.length === 0) {
      return;
    }

    const boundedIndex = Math.max(0, Math.min(cards.length - 1, loopCardIndex));
    const targetScrollLeft = getFeaturedCardCenterScroll(track, cards[boundedIndex]);

    if (options?.immediate) {
      track.scrollLeft = targetScrollLeft;
      keepFeaturedLooped();
      setFeaturedPlasma(0);
      return;
    }

    const distance = targetScrollLeft - track.scrollLeft;
    if (Math.abs(distance) <= FEATURED_DOCK_MIN_DISTANCE) {
      track.scrollLeft = targetScrollLeft;
      keepFeaturedLooped();
      setFeaturedPlasma(0);
      return;
    }

    const dockDuration = options?.durationHint ?? FEATURED_DOCK_MIN_MS;
    glideFeaturedBy(distance, dockDuration, {
      keepLooping: true,
      onComplete: () => {
        const nextTrack = featuredTrackRef.current;
        if (!nextTrack) {
          return;
        }
        keepFeaturedLooped();
        const nextCards = getFeaturedLoopCardElements();
        const nextCard = nextCards[boundedIndex];
        if (!nextCard) {
          setFeaturedPlasma(0);
          return;
        }
        const correction = getFeaturedCardCenterScroll(nextTrack, nextCard) - nextTrack.scrollLeft;
        if (Math.abs(correction) <= FEATURED_DOCK_FINAL_CORRECTION_PX) {
          nextTrack.scrollLeft += correction;
          keepFeaturedLooped();
          setFeaturedPlasma(0);
          return;
        }
        glideFeaturedBy(correction, Math.max(160, Math.min(280, 120 + Math.abs(correction) * 1.45)), {
          keepLooping: true,
          onComplete: () => {
            keepFeaturedLooped();
            setFeaturedPlasma(0);
          },
        });
      },
    });
  };

  const scheduleFeaturedDockToCenter = (delayMs = FEATURED_DOCK_IDLE_MS) => {
    clearFeaturedDockTimer();
    featuredDockTimerRef.current = window.setTimeout(() => {
      featuredDockTimerRef.current = null;
      const track = featuredTrackRef.current;
      if (!track || featuredCards.length === 0) {
        return;
      }
      const idleForMs = performance.now() - featuredLastMotionAtRef.current;
      if (idleForMs < FEATURED_DOCK_IDLE_MS) {
        scheduleFeaturedDockToCenter(Math.max(70, FEATURED_DOCK_IDLE_MS - idleForMs + 22));
        return;
      }
      if (featuredDragRef.current.active) {
        scheduleFeaturedDockToCenter(90);
        return;
      }
      if (featuredGlideRef.current !== null) {
        scheduleFeaturedDockToCenter(FEATURED_DOCK_RECHECK_MS);
        return;
      }
      if (Math.abs(featuredVelocityRef.current) >= FEATURED_DOCK_VELOCITY_EPS) {
        scheduleFeaturedDockToCenter(FEATURED_DOCK_RECHECK_MS);
        return;
      }

      stopFeaturedInertia();
      keepFeaturedLooped();
      const cards = getFeaturedLoopCardElements();
      if (cards.length === 0) {
        return;
      }
      const closestIndex = findClosestFeaturedCardIndex(track, cards);
      const closestShipId = cards[closestIndex]?.getAttribute('data-ship-id');
      const baseShipIndex = closestShipId ? featuredCards.findIndex(({ ship }) => ship.id === closestShipId) : -1;
      const middleLoopIndex = Math.floor(FEATURED_REPEAT / 2);
      const targetLoopCardIndex =
        baseShipIndex >= 0
          ? middleLoopIndex * featuredCards.length + baseShipIndex
          : Math.max(0, Math.min(cards.length - 1, closestIndex));
      const targetCard = cards[targetLoopCardIndex] ?? cards[closestIndex];
      const targetScrollLeft = getFeaturedCardCenterScroll(track, targetCard);
      const distance = targetScrollLeft - track.scrollLeft;
      if (Math.abs(distance) <= FEATURED_DOCK_MIN_DISTANCE) {
        track.scrollLeft = targetScrollLeft;
        keepFeaturedLooped();
        setFeaturedPlasma(0);
        return;
      }

      const dockDuration = Math.max(FEATURED_DOCK_MIN_MS, Math.min(FEATURED_DOCK_MAX_MS, 220 + Math.abs(distance) * 0.32));
      const dockPlasma = Math.min(FEATURED_ARROW_PLASMA_POWER, Math.max(0.2, Math.abs(distance) / 180));
      setFeaturedPlasma(dockPlasma);
      centerFeaturedCardByLoopIndex(targetLoopCardIndex, { durationHint: dockDuration });
    }, delayMs);
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
    markFeaturedMotion();
    clearFeaturedDockTimer();
    clearFeaturedArrowPlasmaTimer();
    setFeaturedArrowPulseDirection(0);
    stopFeaturedGlide();
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
    markFeaturedMotion();
    track.scrollLeft = drag.startScroll - deltaX;
    keepFeaturedLooped();

    const now = performance.now();
    const dt = now - drag.lastTime;
    if (dt > 0) {
      drag.velocity = (event.clientX - drag.lastX) / dt;
      setFeaturedPlasma(Math.min(Math.abs(drag.velocity) / 0.95, 1.6));
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
      if (Math.abs(drag.velocity) > 0.008) {
        const flickBoost = Math.min(2.15, 1 + Math.max(0, Math.abs(drag.velocity) - 0.35) * 0.75);
        applyFeaturedInertia(drag.velocity * FEATURED_DRAG_RELEASE_MULTIPLIER * flickBoost, 'replace');
      }
    } else {
      drag.velocity = 0;
      setFeaturedPlasma(0);
    }
    scheduleFeaturedDockToCenter(FEATURED_DOCK_IDLE_MS + 40);
  };

  const scrollFeatured = (direction: 1 | -1) => {
    const track = featuredTrackRef.current;
    if (!track || featuredCards.length === 0) {
      return;
    }

    const cards = getFeaturedLoopCardElements();
    if (cards.length === 0) {
      return;
    }

    markFeaturedMotion();
    clearFeaturedDockTimer();
    keepFeaturedLooped();

    const currentIndex = findClosestFeaturedCardIndex(track, cards);
    const currentShipId = cards[currentIndex]?.getAttribute('data-ship-id');
    const currentBaseIndex = currentShipId
      ? featuredCards.findIndex(({ ship }) => ship.id === currentShipId)
      : -1;
    const normalizedCurrentIndex =
      currentBaseIndex >= 0 ? currentBaseIndex : ((currentIndex % featuredCards.length) + featuredCards.length) % featuredCards.length;
    const nextBaseIndex = (normalizedCurrentIndex + direction + featuredCards.length) % featuredCards.length;
    const middleLoopIndex = Math.floor(FEATURED_REPEAT / 2);
    const targetLoopCardIndex = middleLoopIndex * featuredCards.length + nextBaseIndex;
    const targetCard = cards[targetLoopCardIndex] ?? cards[currentIndex];
    const targetScrollLeft = getFeaturedCardCenterScroll(track, targetCard);
    const distance = targetScrollLeft - track.scrollLeft;
    if (Math.abs(distance) < 0.5) {
      return;
    }

    const boost = getFeaturedInputBoost();
    const glideDistance = distance * 0.76;
    const glideDuration = Math.max(
      FEATURED_GLIDE_MIN_MS + 56,
      Math.min(FEATURED_GLIDE_MAX_MS, 180 + Math.abs(distance) * 0.12 - Math.min(80, (boost - 1) * 24)),
    );
    igniteFeaturedArrowPlasma(direction);
    glideFeaturedBy(glideDistance, glideDuration, { keepLooping: true });

    const residualDistance = distance - glideDistance;
    const impulseDirection = residualDistance !== 0 ? -Math.sign(residualDistance) : -Math.sign(distance);
    const impulseMagnitude = Math.min(6.1, 1.45 + Math.abs(residualDistance) / 118 + Math.min(1.1, (boost - 1) * 0.72));
    applyFeaturedInertia(impulseDirection * impulseMagnitude, 'add');
    scheduleFeaturedDockToCenter(FEATURED_DOCK_IDLE_MS + 50);
  };

  const onFeaturedWheel = (event: WheelEvent<HTMLDivElement>) => {
    const track = featuredTrackRef.current;
    if (!track) {
      return;
    }
    markFeaturedMotion();
    clearFeaturedDockTimer();
    event.preventDefault();
    const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
    const modeMultiplier = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const pixelDelta = delta * modeMultiplier;
    const boost = getFeaturedInputBoost();
    const wheelDistance = pixelDelta * (0.78 + Math.min(0.42, (boost - 1) * 0.22));
    const wheelDuration = FEATURED_GLIDE_MIN_MS + 60;
    glideFeaturedBy(wheelDistance, wheelDuration);
    const impulsePerPixel = FEATURED_WHEEL_IMPULSE_BASE + Math.min(0.0032, (boost - 1) * 0.0011);
    applyFeaturedInertia(-pixelDelta * impulsePerPixel, 'add');
  };

  const onFeaturedScroll = () => {
    markFeaturedMotion();
    keepFeaturedLooped();
    scheduleFeaturedDockToCenter();
  };

  useEffect(() => {
    return () => {
      stopFeaturedInertia();
      if (sectionSnapUnlockTimerRef.current !== null) {
        clearTimeout(sectionSnapUnlockTimerRef.current);
        sectionSnapUnlockTimerRef.current = null;
      }
      clearManufacturerPreviewTimers();
      clearFeaturedDockTimer();
      clearFeaturedArrowPlasmaTimer();
      if (noticeTimeoutRef.current !== null) {
        clearTimeout(noticeTimeoutRef.current);
      }
      stopFeaturedGlide();
      if (smoothScrollFrameRef.current !== null) {
        cancelAnimationFrame(smoothScrollFrameRef.current);
        smoothScrollFrameRef.current = null;
      }
      smoothScrollCompleteRef.current = null;
      if (smoothScrollCssBehaviorRef.current !== null) {
        document.documentElement.style.scrollBehavior = smoothScrollCssBehaviorRef.current;
        smoothScrollCssBehaviorRef.current = null;
      }
      quickNavScrollLockRef.current = null;
      quickNavSettleRef.current = null;
    };
  }, []);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) {
      return;
    }

    const onWindowWheel = (event: globalThis.WheelEvent) => {
      if (overlayOpen || window.innerWidth < 1200) {
        return;
      }
      if (quickNavScrollLockRef.current) {
        event.preventDefault();
        return;
      }
      if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }

      const delta = Math.abs(event.deltaY) >= Math.abs(event.deltaX) ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 12) {
        return;
      }
      const direction: 1 | -1 = delta > 0 ? 1 : -1;
      const headerOffset = NAV_SCROLL_OFFSET;
      const engageSectionSnap = (targetY: number, duration = 260) => {
        event.preventDefault();
        sectionSnapLockRef.current = true;
        sectionSnapLastDirectionRef.current = direction;
        sectionSnapLastTimeRef.current = performance.now();
        smoothScrollToY(Math.max(0, targetY), duration);

        if (sectionSnapUnlockTimerRef.current !== null) {
          clearTimeout(sectionSnapUnlockTimerRef.current);
        }
        sectionSnapUnlockTimerRef.current = window.setTimeout(() => {
          sectionSnapLockRef.current = false;
          sectionSnapUnlockTimerRef.current = null;
        }, 380);
      };

      if (target.closest('.featured-loop-track, .section-orbit')) {
        return;
      }

      if (direction < 0) {
        const aboutSection = document.getElementById('about');
        if (aboutSection) {
          const aboutTop = Math.round(aboutSection.getBoundingClientRect().top + window.scrollY) - headerOffset;
          const manufacturersSection = document.getElementById('manufacturers');
          const manufacturersTop = manufacturersSection
            ? Math.round(manufacturersSection.getBoundingClientRect().top + window.scrollY) - headerOffset
            : Number.POSITIVE_INFINITY;
          const inAboutZone =
            Boolean(target.closest('#about, #manufacturers')) ||
            (window.scrollY >= aboutTop - 10 && window.scrollY <= manufacturersTop + 10);
          const aboutTopThreshold = 26;
          if (inAboutZone && window.scrollY > aboutTop + aboutTopThreshold) {
            engageSectionSnap(aboutTop, 240);
            return;
          }
        }
      }

      const inCatalog = target.closest('#catalog');
      if (inCatalog) {
        const catalogSection = document.getElementById('catalog');
        const featuredSection = document.getElementById('featured');
        if (catalogSection && featuredSection) {
          const catalogTop = catalogSection.getBoundingClientRect().top + window.scrollY - headerOffset;
          const featuredBottom = featuredSection.getBoundingClientRect().bottom + window.scrollY - headerOffset;
          const nearCatalogTop = window.scrollY <= catalogTop + 14;
          const nearFeaturedLine = Math.abs(window.scrollY - featuredBottom) <= 22;
          if (!(direction < 0 && (nearCatalogTop || nearFeaturedLine))) {
            return;
          }
        } else {
          return;
        }
      }

      if (sectionSnapLockRef.current) {
        const elapsed = performance.now() - sectionSnapLastTimeRef.current;
        const lastDirection = sectionSnapLastDirectionRef.current;
        const canBreakLock = lastDirection !== 0 && lastDirection !== direction && elapsed > 90;
        if (canBreakLock) {
          sectionSnapLockRef.current = false;
          if (sectionSnapUnlockTimerRef.current !== null) {
            clearTimeout(sectionSnapUnlockTimerRef.current);
            sectionSnapUnlockTimerRef.current = null;
          }
        } else {
          event.preventDefault();
          return;
        }
      }

      if (sectionSnapLockRef.current) {
        event.preventDefault();
        return;
      }

      const sections = Array.from(document.querySelectorAll<HTMLElement>('main > section'));
      if (sections.length < 2) {
        return;
      }

      const sectionTops = sections
        .map((section) => Math.round(section.getBoundingClientRect().top + window.scrollY))
        .filter((top, index, arr) => index === 0 || Math.abs(top - arr[index - 1]) > 8);

      if (sectionTops.length < 2) {
        return;
      }

      const probeY = window.scrollY + headerOffset;
      let currentIndex = 0;
      for (let index = 0; index < sectionTops.length; index += 1) {
        if (probeY >= sectionTops[index] - 2) {
          currentIndex = index;
        } else {
          break;
        }
      }

      const nextIndex = Math.max(0, Math.min(sectionTops.length - 1, currentIndex + direction));
      if (nextIndex === currentIndex) {
        return;
      }

      const currentTop = Math.max(0, sectionTops[currentIndex] - headerOffset);
      const currentBottom =
        currentIndex < sectionTops.length - 1
          ? Math.max(currentTop, sectionTops[currentIndex + 1] - headerOffset)
          : Math.max(currentTop, document.documentElement.scrollHeight - window.innerHeight);

      const viewTop = window.scrollY;
      const viewBottom = window.scrollY + window.innerHeight;
      const remainingDown = currentBottom - viewBottom;
      const remainingUp = viewTop - currentTop;
      const sectionSnapThreshold = 24;

      if (direction > 0 && remainingDown > sectionSnapThreshold) {
        return;
      }
      if (direction < 0 && remainingUp > sectionSnapThreshold) {
        return;
      }

      engageSectionSnap(sectionTops[nextIndex] - headerOffset, 260);
    };

    window.addEventListener('wheel', onWindowWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', onWindowWheel);
      if (sectionSnapUnlockTimerRef.current !== null) {
        clearTimeout(sectionSnapUnlockTimerRef.current);
        sectionSnapUnlockTimerRef.current = null;
      }
      sectionSnapLockRef.current = false;
      sectionSnapLastDirectionRef.current = 0;
      sectionSnapLastTimeRef.current = 0;
    };
  }, [overlayOpen]);

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
    const onPointerMove = (event: globalThis.PointerEvent) => {
      if (event.pointerType === 'touch') {
        return;
      }
      const target = event.target as HTMLElement | null;
      if (!target) {
        return;
      }
      if (target.closest('.no-tilt, [data-no-tilt="true"]')) {
        if (tiltHoverRef.current) {
          tiltHoverRef.current.classList.remove('tilt-hover');
          resetHoverTilt(tiltHoverRef.current);
          tiltHoverRef.current = null;
        }
        return;
      }
      if (target.closest('.card-tilt-reactive')) {
        return;
      }
      const next = target.closest('button, .panel-shell') as HTMLElement | null;
      if (!next) {
        if (tiltHoverRef.current) {
          tiltHoverRef.current.classList.remove('tilt-hover');
          resetHoverTilt(tiltHoverRef.current);
          tiltHoverRef.current = null;
        }
        return;
      }

      if (tiltHoverRef.current !== next) {
        if (tiltHoverRef.current) {
          tiltHoverRef.current.classList.remove('tilt-hover');
          resetHoverTilt(tiltHoverRef.current);
        }
        tiltHoverRef.current = next;
        next.classList.add('tilt-hover');
      }

      applyHoverTilt(next, event);
    };

    const onPointerLeave = () => {
      if (tiltHoverRef.current) {
        tiltHoverRef.current.classList.remove('tilt-hover');
        resetHoverTilt(tiltHoverRef.current);
        tiltHoverRef.current = null;
      }
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerleave', onPointerLeave);
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  useEffect(() => {
    if (!overlayOpen) {
      return;
    }
    clearManufacturerPreviewTimers();
    setManufacturerChipPreview(null);
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
      if (index > 0 && !section.classList.contains('featured-seam-glow')) {
        section.classList.add('flow-divider');
      }
      section.style.setProperty('--flow-delay', `${index <= 1 ? 0 : Math.min(index * 55, 260)}ms`);
      if (index <= 2) {
        section.classList.add('flow-section-visible');
      }
    });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('flow-section-visible'));
      return () => {
        sections.forEach((section) => {
          section.classList.remove('flow-section', 'flow-section-visible', 'flow-divider');
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
        threshold: 0.03,
        rootMargin: '0px 0px 26% 0px',
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => {
      observer.disconnect();
      sections.forEach((section) => {
        section.classList.remove('flow-section', 'flow-section-visible', 'flow-divider');
        section.style.removeProperty('--flow-delay');
      });
    };
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const updateScrollRatio = () => {
      const maxScroll = Math.max(1, html.scrollHeight - window.innerHeight);
      const ratio = window.scrollY / maxScroll;
      html.style.setProperty('--scroll-ratio', ratio.toFixed(4));
    };

    updateScrollRatio();
    window.addEventListener('scroll', updateScrollRatio, { passive: true });
    window.addEventListener('resize', updateScrollRatio);
    return () => {
      window.removeEventListener('scroll', updateScrollRatio);
      window.removeEventListener('resize', updateScrollRatio);
      html.style.removeProperty('--scroll-ratio');
    };
  }, []);

  useEffect(() => {
    const sectionNodes = quickNavSections
      .map((section) => document.getElementById(section.id))
      .filter((section): section is HTMLElement => Boolean(section));
    if (sectionNodes.length === 0) {
      return;
    }

    let frameId: number | null = null;

    const updateActiveSection = () => {
      const quickNavLock = quickNavScrollLockRef.current;

      if (quickNavLock) {
        // Hard lock: do not recompute active section while jump is in progress.
        setActiveQuickNavSection((prev) => (prev === quickNavLock.targetId ? prev : quickNavLock.targetId));
        return;
      }

      const settle = quickNavSettleRef.current;
      if (settle && performance.now() < settle.until) {
        setActiveQuickNavSection(settle.id);
        return;
      }
      quickNavSettleRef.current = null;

      const probe = window.scrollY + window.innerHeight * 0.42;
      let currentId = sectionNodes[0].id as QuickNavSectionId;

      for (const section of sectionNodes) {
        if (probe >= section.offsetTop) {
          currentId = section.id as QuickNavSectionId;
        } else {
          break;
        }
      }

      setActiveQuickNavSection(currentId);
    };

    const onScroll = () => {
      if (frameId !== null) {
        return;
      }

      frameId = requestAnimationFrame(() => {
        frameId = null;
        updateActiveSection();
      });
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateActiveSection);

    return () => {
      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateActiveSection);
    };
  }, []);

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
      const top = contact.getBoundingClientRect().top + window.scrollY - NAV_SCROLL_OFFSET;
      smoothScrollToY(top, 320);
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

  const featuredDefaultCenterIndex = useMemo(() => {
    const matchingIndex = featuredCards.findIndex(({ ship }) => ship.id === FEATURED_DEFAULT_CENTER_SHIP_ID);
    if (matchingIndex >= 0) {
      return matchingIndex;
    }
    return Math.max(0, Math.floor((featuredCards.length - 1) / 2));
  }, [featuredCards]);

  useEffect(() => {
    if (featuredCards.length === 0) {
      return;
    }

    const recenter = () => {
      clearFeaturedDockTimer();
      markFeaturedMotion();
      const middleLoopIndex = Math.floor(FEATURED_REPEAT / 2);
      const targetIndex = middleLoopIndex * featuredCards.length + featuredDefaultCenterIndex;
      centerFeaturedCardByLoopIndex(targetIndex, { immediate: true });
    };

    recenter();
    const onResize = () => {
      window.requestAnimationFrame(recenter);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [featuredCards.length, featuredDefaultCenterIndex]);

  return (
    <div className="min-h-screen bg-transparent text-text-light">
      <Navbar />

      <main className="pt-[72px]">
        <Hero onOpenFeaturedShip={(ship) => setSelectedShip(ship)} />

        <section id="featured" className="section-seam-soften featured-seam-glow featured-panel-backdrop py-10 sm:py-14">
          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="heading-lg">Лучшие предложения</h2>
              </div>
            </div>
            <div className="featured-orbit-glow relative space-bg p-3 sm:p-4">
              <button
                type="button"
                aria-label="Предыдущие предложения"
                onClick={() => scrollFeatured(-1)}
                className={`no-tilt absolute left-1 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-dark-navy/60 p-2.5 text-cyan-holo/90 backdrop-blur-md transition sm:left-2 ${
                  featuredArrowPulseDirection === -1
                    ? 'border-amber-ui/80 text-amber-ui shadow-[0_0_28px_rgba(255,80,40,0.62),0_0_18px_rgba(0,238,255,0.36)]'
                    : 'border-cyan-holo/40 hover:border-amber-ui/80 hover:bg-dark-navy/70 hover:text-amber-ui hover:shadow-[0_0_20px_rgba(255,80,40,0.5)]'
                }`}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                aria-label="Следующие предложения"
                onClick={() => scrollFeatured(1)}
                className={`no-tilt absolute right-1 top-1/2 z-20 -translate-y-1/2 rounded-full border bg-dark-navy/60 p-2.5 text-cyan-holo/90 backdrop-blur-md transition sm:right-2 ${
                  featuredArrowPulseDirection === 1
                    ? 'border-amber-ui/80 text-amber-ui shadow-[0_0_28px_rgba(255,80,40,0.62),0_0_18px_rgba(0,238,255,0.36)]'
                    : 'border-cyan-holo/40 hover:border-amber-ui/80 hover:bg-dark-navy/70 hover:text-amber-ui hover:shadow-[0_0_20px_rgba(255,80,40,0.5)]'
                }`}
              >
                <ChevronRight size={18} />
              </button>
              <div
                ref={featuredTrackRef}
                className="featured-loop-track flex cursor-grab gap-4 overflow-x-auto px-10 pb-3 pr-2 pt-2 select-none [scrollbar-width:none] active:cursor-grabbing sm:px-12 [&::-webkit-scrollbar]:hidden"
                onPointerDown={onFeaturedPointerDown}
                onPointerMove={onFeaturedPointerMove}
                onPointerUp={onFeaturedPointerUp}
                onPointerCancel={onFeaturedPointerUp}
                onWheel={onFeaturedWheel}
                onScroll={onFeaturedScroll}
              >
                {featuredLoopCards.map(({ key, entry, ship }) => {
                  const activeVariant = Math.min(ship.images.length - 1, featuredVariantByShip[ship.id] ?? 0);
                  const featuredImage = ship.images[activeVariant] ?? ship.images[0];
                  const compactDescription =
                    ship.description.length > 92 ? `${ship.description.slice(0, 89).trimEnd()}...` : ship.description;

                  return (
                    <article
                      key={key}
                      data-ship-id={ship.id}
                      data-featured-loop-card="true"
                      className="panel-shell card-tilt-reactive min-w-[288px] cursor-pointer p-4 transition duration-300 sm:min-w-[330px]"
                      onMouseMove={onFeaturedCardMouseMove}
                      onMouseLeave={onFeaturedCardMouseLeave}
                    >
                      <div className="zoomable relative h-44 overflow-hidden rounded-xl">
                        <img src={featuredImage} alt={ship.name} className="h-full w-full object-cover" draggable={false} />
                      </div>
                      <div className="mt-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-mono text-xs uppercase tracking-[0.12em] text-amber-ui">{entry.label}</p>
                          {ship.images.length > 1 && (
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-text-light/42">Цвет</span>
                              <div className="flex gap-1">
                                {ship.images.map((_, idx) => (
                                  <button
                                    key={`${ship.id}-featured-variant-${idx}`}
                                    type="button"
                                    onPointerDown={(event) => event.stopPropagation()}
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      setFeaturedVariant(ship.id, idx);
                                    }}
                                    onMouseEnter={() => setFeaturedVariant(ship.id, idx)}
                                    className={`h-3.5 w-3.5 rounded-full border-2 transition ${
                                      idx === activeVariant
                                        ? 'border-amber-ui bg-amber-ui/60 shadow-[0_0_12px_rgba(255,80,40,0.7)]'
                                        : 'border-cyan-holo/50 bg-cyan-holo/20'
                                    }`}
                                    aria-label={`Цвет ${idx + 1}`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <h3 className="mt-2 font-orbitron text-2xl uppercase tracking-[0.08em] text-text-light">{ship.name}</h3>
                        <p className="mt-1 font-rajdhani text-sm text-text-light/70">
                          {classLabels[ship.class]} / Экипаж {ship.crewMin}-{ship.crewMax}
                        </p>
                        <div className="ship-copy-box mt-2 px-2.5 py-1.5">
                          <p className="ship-copy-text ship-copy-text-compact">{compactDescription}</p>
                        </div>
                        <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                          <p className="font-orbitron text-3xl text-amber-ui">${(ship.priceUsd / 1000).toFixed(0)}K</p>
                          <div className="grid grid-cols-2 gap-2 sm:justify-items-end">
                            <button
                              type="button"
                              className="col-start-1 row-start-2 rounded-md border border-text-light/30 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-text-light/85 transition hover:border-amber-ui/55 hover:text-amber-ui"
                              onClick={(event) => {
                                event.stopPropagation();
                                setSelectedShip(ship);
                              }}
                            >
                              Открыть
                            </button>
                            <button
                              type="button"
                              className="col-span-2 row-start-1 justify-self-end rounded-md border border-cyan-holo/50 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-cyan-holo transition hover:border-cyan-holo/80 sm:col-span-1 sm:col-start-2"
                              onClick={(event) => {
                                event.stopPropagation();
                                setQuickViewShip(ship);
                              }}
                            >
                              Быстрый
                            </button>
                            <button
                              type="button"
                              className="col-start-2 row-start-2 rounded-md border border-amber-ui/55 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-amber-ui transition hover:border-amber-ui/85 hover:bg-amber-ui/10"
                              onClick={(event) => {
                                event.stopPropagation();
                                addToCart(ship);
                              }}
                            >
                              В корзину
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="catalog-layout-anchor relative">
              <div className="catalog-side-filter-dock hidden xl:block">
                <div className="catalog-side-filter-sticky">
                  <ShipFilter ships={ships} onFilter={handleFilter} variant="sidebar" />
                </div>
              </div>

              <div className="mb-8 sm:mb-10">
                <h2 className="heading-lg text-text-light">Доступные корабли</h2>
                <p className="soft-copy mt-3 max-w-3xl font-rajdhani text-xl leading-relaxed">
                  Погружайтесь в карточки, сравнивайте ключевые параметры и мгновенно переходите к детальным
                  характеристикам, уникальным возможностям и эксклюзивным комплектациям.
                </p>
              </div>

              <div className="xl:hidden">
                <ShipFilter ships={ships} onFilter={handleFilter} variant="default" />
              </div>

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
                  <p className="font-rajdhani text-2xl text-text-light/80">Под текущие фильтры модели не найдены.</p>
                  <p className="mt-2 font-rajdhani text-lg text-text-light/60">
                    Сбросьте фильтры - каталог снова откроется полностью.
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
          </div>
        </section>

        <section id="about" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <h2 className="heading-lg text-text-light">Почему выбирают Void Hangar</h2>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <article className="panel-shell p-6">
                <p className="font-mono text-2xl text-amber-ui">01</p>
                <h3 className="mt-3 font-oxanium text-2xl uppercase tracking-[0.08em] text-text-light">Безупречная сборка</h3>
                <p className="mt-3 font-rajdhani text-lg text-text-light/70">
                  Каждый корабль проходит жесткий многоэтапный контроль: от диагностики двигателей и щитов
                  до финальной настройки автопилота.
                </p>
              </article>

              <article className="panel-shell p-6">
                <p className="font-mono text-2xl text-amber-ui">02</p>
                <h3 className="mt-3 font-oxanium text-2xl uppercase tracking-[0.08em] text-text-light">Кокпит будущего</h3>
                <p className="mt-3 font-rajdhani text-lg text-text-light/70">
                  Адаптивные голографические панели, умная подсветка и эргономика,
                  созданная для долгих и комфортных перелетов.
                </p>
              </article>

              <article className="panel-shell p-6">
                <p className="font-mono text-2xl text-amber-ui">03</p>
                <h3 className="mt-3 font-oxanium text-2xl uppercase tracking-[0.08em] text-text-light">Поддержка без ограничений</h3>
                <p className="mt-3 font-rajdhani text-lg text-text-light/70">
                  Сервисные пакеты, постоянный удаленный мониторинг и выделенная инженерная линия -
                  круглосуточно, всегда на связи.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="manufacturers" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <h2 className="heading-lg text-text-light">Корпорации и верфи - легендарные создатели</h2>
              <p className="soft-copy mt-3 max-w-3xl font-rajdhani text-xl leading-relaxed">
                Нажмите на корпорацию, чтобы открыть профиль верфи и увидеть, какие серии она выпускает в этом сезоне.
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
                            onMouseEnter={(event) => showManufacturerChipPreview(ship, event.currentTarget)}
                            onFocus={(event) => showManufacturerChipPreview(ship, event.currentTarget)}
                            onMouseLeave={() => hideManufacturerChipPreview()}
                            onBlur={() => hideManufacturerChipPreview(1200)}
                            className="manufacturer-ship-chip rounded-md border border-cyan-holo/30 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-text-light/80 hover:border-amber-ui/45 hover:text-amber-ui"
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
              <h2 className="heading-lg text-text-light">Как работает рынок полетов Sol-Transit</h2>
              <p className="soft-copy mt-3 max-w-4xl font-rajdhani text-xl leading-relaxed">
                Каждая модель в каталоге привязана к реальным докам, страховым коридорам и навигационным маршрутам.
                Поэтому карточки показывают не только дизайн, но и реальную эксплуатационную экономику.
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

        <section id="journey" className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <h2 className="heading-lg text-text-light">Под какие миссии лучше всего подойдут модели</h2>
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
              <h2 className="heading-lg text-text-light">Как проходит сделка</h2>
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
                    Менеджер отвечает обычно в течение 30 минут в рабочее время.
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      {manufacturerChipPreview && (
        <button
          type="button"
          className={`manufacturer-chip-preview${manufacturerChipPreview.visible ? ' is-visible' : ' is-fading'}`}
          style={{ left: `${manufacturerChipPreview.left}px`, top: `${manufacturerChipPreview.top}px` }}
          onMouseEnter={() => {
            clearManufacturerPreviewTimers();
            setManufacturerChipPreview((prev) => (prev ? { ...prev, visible: true } : prev));
          }}
          onMouseLeave={() => hideManufacturerChipPreview(900)}
          onFocus={() => {
            clearManufacturerPreviewTimers();
            setManufacturerChipPreview((prev) => (prev ? { ...prev, visible: true } : prev));
          }}
          onBlur={() => hideManufacturerChipPreview(700)}
          onClick={() => openShipFromManufacturerPreview(manufacturerChipPreview.ship)}
        >
          <div className="manufacturer-chip-preview-media">
            <img
              src={manufacturerChipPreview.ship.images[0]}
              alt={manufacturerChipPreview.ship.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="manufacturer-chip-preview-content">
            <p className="manufacturer-chip-preview-name">{manufacturerChipPreview.ship.name}</p>
            <p className="manufacturer-chip-preview-meta">
              {classLabels[manufacturerChipPreview.ship.class]} / {manufacturerChipPreview.ship.crewMin}-{manufacturerChipPreview.ship.crewMax}
            </p>
            <p className="manufacturer-chip-preview-price">${(manufacturerChipPreview.ship.priceUsd / 1000).toFixed(0)}K</p>
          </div>
        </button>
      )}

      {!overlayOpen && (
        <SectionOrbitNav
          sections={quickNavSections}
          activeId={activeQuickNavSection}
          onJump={(id) => scrollToQuickNavSection(id as QuickNavSectionId)}
        />
      )}

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

