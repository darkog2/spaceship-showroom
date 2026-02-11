# Подключение Изображений Кораблей

## Где хранить изображения

Все изображения кораблей следует размещать в папке `public/ships/`

```
spaceship-showroom/
├── public/
│   └── ships/
│       ├── aeris-one.jpg
│       ├── nyx-skiff.jpg
│       ├── veltra-c3.jpg
│       ├── orbita-q4.jpg
│       ├── luminox-solo.jpg
│       └── neo-velocity.jpg
```

## Как обновить пути изображений

1. Положите изображения в `public/ships/`
2. Отредактируйте `src/data/ships.ts`
3. Измените значение `images` для каждого корабля

Пример:
```typescript
{
  id: "aer-01",
  name: "AERIS One",
  // ... другие поля ...
  images: ["/ships/aeris-one.jpg"],  // ← Обновите путь
}
```

## Рекомендации по изображениям

### Размер и формат
- **Размер файла**: Максимум 500KB на изображение
- **Формат**: JPG, PNG или WebP
- **Разрешение**: Минимум 1280x720px (горизонтальное)
  
### Соотношение сторон
- **Рекомендуется**: 16:9 для основных карточек
- **Альтернативно**: 4:3 или квадрат (1:1)

### Оптимизация
```bash
# Используйте ImageOptim, TinyPNG или компрессор:
- Уменьшите размер без потери качества
- Преобразуйте в WebP для меньшего размера файла
```

### Фотошопные советы
- Используйте темный фон (темная сцена в стиле Blade Runner)
- Добавьте неоновые отражения (синие, фиолетовые)
- Убедитесь что корабль хорошо видно и читаемо

## Использование Placeholder изображений

Если реальные изображения еще не готовы, можно использовать плейсхолдеры:

### Вариант 1: Плейсхолдер сервис
```typescript
images: [
  `https://via.placeholder.com/1280x720?text=AERIS+One`
]
```

### Вариант 2: SVG плейсхолдер
```typescript
images: [
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 720'%3E%3Crect fill='%230B1220' width='1280' height='720'/%3E%3C/svg%3E"
]
```

### Вариант 3: CSS фон в компоненте
Обновите `ShipCard.tsx`:
```jsx
<div 
  className="w-full h-full bg-gradient-to-br from-panel-dark to-navy-charcoal"
  style={{
    backgroundImage: ship.images[0] 
      ? `url(${ship.images[0]})` 
      : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }}
>
  {/* контент */}
</div>
```

## Добавление Галереи для Детальной Страницы

В `ShipDetail.tsx` добавьте поддержку нескольких изображений:

```typescript
const [mainImage, setMainImage] = useState(0)

// В галерее:
<div className="mb-6">
  <div className="card-glass p-6 mb-4 h-96 flex items-center justify-center overflow-hidden">
    <img 
      src={ship.images[mainImage]} 
      alt={ship.name}
      className="w-full h-full object-cover"
    />
  </div>
  
  {/* Thumbnails */}
  <div className="flex gap-4">
    {ship.images.map((img, idx) => (
      <button
        key={idx}
        onClick={() => setMainImage(idx)}
        className={`card-glass p-4 flex-1 h-24 ${
          mainImage === idx ? 'border-cyan-holo' : ''
        }`}
      >
        <img 
          src={img} 
          alt={`View ${idx + 1}`}
          className="w-full h-full object-cover rounded"
        />
      </button>
    ))}
  </div>
</div>
```

## Примеры Изображений

Если у вас есть генерированные изображения (например из DALL-E, Midjourney), вот рекомендации:

### Для AERIS One (Solo Pod)
- Минималистичный дизайн
- Гладкий белый/серебристый корпус
- Одно-местный кокпит
- Неоновые синие акценты

### Для NEO Velocity (Duo Skiff)
- Спортивные формы
- Быстрый аэродинамический вид
- Двух-местная кабина
- Оранжевые/золотые неоновые полосы

### Для VELTRA C3 (Tri Cabin)
- Элегантный и просторный
- Три раздельных отсека
- Панорамные иллюминаторы
- Лавовые оранжевые неоновые элементы

## API для Изображений

Если вы хотите динамически загружать изображения с адреса:

```typescript
// src/data/ships.ts - обновите для загрузки с сервера
export const loadShipsWithImages = async () => {
  const response = await fetch('/api/ships')
  const data = await response.json()
  return data
}
```

## Проблемы с Изображениями

### Изображение не отображается
1. Проверьте путь в `images` массиве
2. Убедитесь что файл название совпадает (регистр файлов)
3. Проверьте что файл находится в `public/ships/`
4. Перезагрузите страницу (Ctrl+Shift+R)

### Изображение слишком медленное
1. Сожмите изображение (используйте TinyPNG)
2. Преобразуйте в WebP формат
3. Уменьшите разрешение если изображение очень большое

### Изображение размывается
1. Используйте оригинальное разрешение без масштабирования
2. Убедитесь что соотношение сторон 16:9

---

**Совет**: Для лучшего вида, используйте изображения с темным фоном и неоновым освещением, которое соответствует цвету бренда (киан #4DE7FF, оранжевый #FFB020).
