'use client';

import ReactPlayer from 'react-player/youtube';

interface VideoPlayerProps {
  youtubeId: string;
  title?: string;
  className?: string;
  vertical?: boolean;
}

export function VideoPlayer({ youtubeId, title, className, vertical = false }: VideoPlayerProps) {
  const aspectRatio = vertical ? '177.78%' : '56.25%';
  const maxWidth = vertical ? 'max-w-md mx-auto' : '';

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
