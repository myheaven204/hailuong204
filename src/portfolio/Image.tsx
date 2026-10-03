import { useState, type ImgHTMLAttributes } from 'react';
import { imageDimensions, mediaSource } from './content';

export default function Image({ src = '', alt = '', className = '', fetchPriority, ...props }: ImgHTMLAttributes<HTMLImageElement>) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  const local = mediaSource(src);
  const size = imageDimensions[src];
  const width = size?.width ?? 1800;
  if (failedSource === src) return <div className={'image-unavailable ' + className} role="img" aria-label={alt + ' — image unavailable'}><span>FRAME UNAVAILABLE</span><small>{alt}</small></div>;
  return <img src={local} srcSet={local.startsWith('/media/') && width > 640 ? local.replace('.webp', '-640.webp') + ' 640w, ' + local + ' ' + width + 'w' : undefined} sizes="(max-width: 760px) 100vw, 50vw" width={size?.width} height={size?.height} alt={alt} className={className} decoding="async" onError={() => setFailedSource(src)} {...{ fetchpriority: fetchPriority }} {...props} />;
}
