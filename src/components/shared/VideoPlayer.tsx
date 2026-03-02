'use client';

import ReactPlayer from 'react-player/youtube';
import ReactPlayerLazy from 'react-player/lazy';

interface VideoPlayerProps {
  videoUrl?: string | null;
  externalVideoUrl?: string | null;
  youtubeId?: string | null;
  title?: string;
  className?: string;
  vertical?: boolean;
}

export function VideoPlayer({
  videoUrl,
  externalVideoUrl,
  youtubeId,
  title,
  className,
  vertical = false,
}: VideoPlayerProps) {
  const aspectRatio = vertical ? '177.78%' : '56.25%';
  const maxWidth = vertical ? 'max-w-md mx-auto' : '';

  if (videoUrl) {
    return (
      <div className={`w-full overflow-hidden rounded-lg ${maxWidth} ${className || ''}`}>
        <div className="relative" style={{ paddingBottom: aspectRatio }}>
          <div className="absolute inset-0">
            <video
              src={videoUrl}
              controls
              playsInline
              className="w-full h-full object-contain bg-black rounded-lg"
              title={title}
            />
          </div>
        </div>
      </div>
    );
  }

  if (youtubeId) {
    const playerConfig = {
      youtube: {
        playerVars: {
          modestbranding: 1,
          rel: 0,
          playsinline: 1,
        },
      },
    };

    return (
      <div className={`w-full overflow-hidden rounded-lg ${maxWidth} ${className || ''}`}>
        <div className="relative" style={{ paddingBottom: aspectRatio }}>
          <div className="absolute inset-0">
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${youtubeId}`}
              width="100%"
              height="100%"
              controls
              playing={false}
              config={playerConfig as any}
            />
          </div>
        </div>
      </div>
    );
  }

  if (externalVideoUrl) {
    return (
      <div className={`w-full overflow-hidden rounded-lg ${maxWidth} ${className || ''}`}>
        <div className="relative" style={{ paddingBottom: aspectRatio }}>
          <div className="absolute inset-0">
            <ReactPlayerLazy url={externalVideoUrl} width="100%" height="100%" controls playing={false} />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
