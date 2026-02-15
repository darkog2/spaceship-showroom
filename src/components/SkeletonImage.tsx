import { type ImgHTMLAttributes, useEffect, useState } from 'react';

interface SkeletonImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  wrapperClassName?: string;
}

export default function SkeletonImage({
  wrapperClassName,
  className,
  src,
  alt,
  onLoad,
  onError,
  ...imgProps
}: SkeletonImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isErrored, setIsErrored] = useState(false);

  useEffect(() => {
    setIsLoaded(false);
    setIsErrored(false);
  }, [src]);

  const showPlaceholder = !isLoaded || isErrored;

  return (
    <div className={`relative h-full w-full ${wrapperClassName ?? ''}`}>
      {showPlaceholder && <div className={`image-skeleton${isErrored ? ' is-error' : ''}`} aria-hidden="true" />}
      <img
        {...imgProps}
        src={src}
        alt={alt}
        onLoad={(event) => {
          setIsLoaded(true);
          setIsErrored(false);
          onLoad?.(event);
        }}
        onError={(event) => {
          setIsErrored(true);
          onError?.(event);
        }}
        className={`${className ?? ''} transition-opacity duration-300 ${isLoaded && !isErrored ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}
