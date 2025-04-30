
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface ImageLoaderProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  quality?: number;
}

export function ImageLoader({
  src,
  alt,
  width,
  height,
  className,
  objectFit = 'cover',
  quality = 85
}: ImageLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Reset states when src changes
    setIsLoaded(false);
    setError(false);
  }, [src]);

  // Generate optimized URL - typically we'd use a proper image CDN here
  // This is a simple version that could be expanded with actual CDN integration
  const optimizedSrc = src;

  const objectFitClass = {
    'contain': 'object-contain',
    'cover': 'object-cover',
    'fill': 'object-fill',
    'none': 'object-none',
    'scale-down': 'object-scale-down'
  }[objectFit];

  return (
    <div className={cn(
      'relative overflow-hidden', 
      {
        'animate-pulse bg-gray-200': !isLoaded && !error,
      }, 
      className
    )}>
      {error ? (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
          Failed to load image
        </div>
      ) : (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          loading="lazy"
          className={cn(
            objectFitClass,
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
        />
      )}
    </div>
  );
}
