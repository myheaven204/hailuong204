import { useEffect, useRef, useState } from 'react';

interface VideoBackgroundProps {
  src: string;
  overlay?: boolean;
  overlayOpacity?: number;
}

export default function VideoBackground({
  src,
  overlay = true,
  overlayOpacity = 0.75,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoading(false);
      video.play().catch(() => {
        // Autoplay blocked - wait for user interaction
        const playOnInteraction = () => {
          video.play();
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
      });
    };

    const handleError = () => {
      console.error('Video load error');
      setIsLoading(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [src]);

  return (
    <div className="fixed inset-0 w-full h-full -z-10">
      {/* Video */}
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ minHeight: '100vh' }}
      />

      {/* Dark Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: overlayOpacity, background: 'transparent' }}
        />
      )}

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
        }}
      />

      {/* Loading */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-2 border-[#e8a400] border-t-transparent rounded-full animate-spin" />
            <span className="text-[#e8a400] text-sm font-medium tracking-wider">LOADING VIDEO</span>
          </div>
        </div>
      )}
    </div>
  );
}
