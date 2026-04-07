import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useContentData';

export function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-600 text-white text-center py-1.5 px-4 text-sm font-medium flex items-center justify-center gap-2">
      <WifiOff className="w-4 h-4" />
      You're offline — showing cached data
    </div>
  );
}
