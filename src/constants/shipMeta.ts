import type { Ship } from '../data/ships';

export const shipClassLabels: Record<Ship['class'], string> = {
  'Solo Pod': 'Соло-под',
  'Duo Skiff': 'Дуо-скифф',
  'Tri Cabin': 'Три-кабина',
  'Quad Shuttle': 'Квадро-шаттл',
};

export const shipAvailabilityLabels: Record<Ship['availability'], string> = {
  'In Stock': 'В наличии',
  Limited: 'Ограниченно',
  Prototype: 'Прототип',
  'On Request': 'Под заказ',
};

export const shipAvailabilityToneClasses: Record<Ship['availability'], string> = {
  'In Stock': 'border-cyan-holo/65 bg-cyan-holo/20 text-cyan-holo',
  Limited: 'border-amber-ui/65 bg-amber-ui/20 text-amber-ui',
  Prototype: 'border-magenta-neon/65 bg-magenta-neon/20 text-magenta-neon',
  'On Request': 'border-text-light/35 bg-text-light/12 text-text-light/75',
};

export const shipBadgeLabels: Record<Ship['badges'][number], string> = {
  LIMITED: 'Лимит',
  PROTOTYPE: 'Прототип',
  CERTIFIED: 'Проверено',
  'NEW DROP': 'Новый дроп',
};

export const shipBadgeToneClasses: Record<Ship['badges'][number], string> = {
  LIMITED: 'badge-pulse border-amber-ui/70 bg-amber-ui/25 text-amber-ui',
  PROTOTYPE: 'badge-pulse prototype border-cyan-holo/70 bg-cyan-holo/25 text-cyan-holo',
  CERTIFIED: 'border-text-light/50 bg-text-light/12 text-text-light',
  'NEW DROP': 'badge-pulse border-ember-core/70 bg-ember-core/25 text-amber-ui',
};

export const shipTrimLabels: Record<Ship['trims'][number]['name'], string> = {
  Standard: 'Базовая',
  Executive: 'Премиум',
  Expedition: 'Экспедиция',
};

export const formatShipClassCrew = (ship: Pick<Ship, 'class' | 'crewMin' | 'crewMax'>): string =>
  `${shipClassLabels[ship.class]} / Экипаж ${ship.crewMin}-${ship.crewMax}`;
