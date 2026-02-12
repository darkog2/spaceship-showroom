import { useCallback, type MouseEvent as ReactMouseEvent } from 'react';

type TiltOptions = {
  intensity?: number;
  perspective?: number;
};

export const useTiltEffect = (options?: TiltOptions) => {
  const intensity = options?.intensity ?? 1;
  const perspective = options?.perspective ?? 1100;

  const onMouseMove = useCallback(
    (event: ReactMouseEvent<HTMLElement>) => {
      const element = event.currentTarget;
      const rect = element.getBoundingClientRect();
      if (!rect.width || !rect.height) {
        return;
      }

      const offsetX = (event.clientX - rect.left) / rect.width - 0.5;
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5;

      const rotateX = -offsetY * 2.6 * intensity;
      const rotateY = offsetX * 3.2 * intensity;
      const shiftX = offsetX * 3.4 * intensity;
      const shiftY = offsetY * 2.6 * intensity;

      element.style.setProperty('--card-tilt-x', `${rotateX.toFixed(3)}deg`);
      element.style.setProperty('--card-tilt-y', `${rotateY.toFixed(3)}deg`);
      element.style.setProperty('--card-shift-x', `${shiftX.toFixed(3)}px`);
      element.style.setProperty('--card-shift-y', `${shiftY.toFixed(3)}px`);
      element.style.setProperty('--tilt-perspective', `${perspective}px`);
    },
    [intensity, perspective],
  );

  const onMouseLeave = useCallback((event: ReactMouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    element.style.setProperty('--card-tilt-x', '0deg');
    element.style.setProperty('--card-tilt-y', '0deg');
    element.style.setProperty('--card-shift-x', '0px');
    element.style.setProperty('--card-shift-y', '0px');
  }, []);

  return { onMouseMove, onMouseLeave };
};

