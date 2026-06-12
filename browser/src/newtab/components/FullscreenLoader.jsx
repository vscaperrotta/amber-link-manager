import { SkeletonLinkCard } from '@components/Skeleton';
import Skeleton from '@components/Skeleton';

export default function FullscreenLoader() {
  return (
    <div className="fullscreen-loader" role="status" aria-live="polite">
      <div className="fullscreen-loader__sidebar">
        <Skeleton variant="text" width="60%" height="20px" />
        <div className="fullscreen-loader__nav">
          <Skeleton variant="text" width="80%" height="14px" />
          <Skeleton variant="text" width="70%" height="14px" />
          <Skeleton variant="text" width="75%" height="14px" />
          <Skeleton variant="text" width="65%" height="14px" />
        </div>
      </div>
      <div className="fullscreen-loader__content">
        <Skeleton variant="text" width="200px" height="16px" />
        <div className="fullscreen-loader__grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <SkeletonLinkCard key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
