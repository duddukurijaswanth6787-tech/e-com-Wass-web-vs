'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Home, RefreshCw } from 'lucide-react';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isChunkError, setIsChunkError] = useState(false);

  useEffect(() => {
    console.error('Admin page error:', error);
    const isChunk =
      error?.name === 'ChunkLoadError' ||
      error?.message?.includes('ChunkLoadError') ||
      error?.message?.includes('Failed to load chunk') ||
      error?.message?.includes('Loading chunk');

    if (isChunk) {
      setIsChunkError(true);
      // Auto-reload once to fetch fresh chunks after deployment
      const lastReload = sessionStorage.getItem('admin_chunk_error_reload');
      const now = Date.now();
      if (!lastReload || now - Number(lastReload) > 10000) {
        sessionStorage.setItem('admin_chunk_error_reload', String(now));
        window.location.reload();
      }
    }
  }, [error]);

  const handleRetry = () => {
    if (isChunkError) {
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div className="flex h-[60vh] w-full flex-col items-center justify-center gap-4 text-center px-4">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <div>
        <h2 className="text-xl font-bold text-neutral-800">
          {isChunkError ? 'Application Updated' : 'Something went wrong'}
        </h2>
        <p className="text-sm text-neutral-500 mt-1 max-w-md">
          {isChunkError
            ? 'A new version of the app has been deployed. Refreshing to load the latest version...'
            : 'An unexpected error occurred while rendering this page.'}
        </p>
      </div>
      <div className="flex gap-3 mt-2">
        <button
          onClick={handleRetry}
          className="rounded-md bg-neutral-900 px-4 h-9 text-sm font-medium text-white hover:bg-neutral-800 transition flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {isChunkError ? 'Refresh Page' : 'Try Again'}
        </button>
        <Link
          href="/admin/dashboard"
          className="rounded-md border border-neutral-300 px-4 h-9 flex items-center gap-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition"
        >
          <Home className="h-3.5 w-3.5" />
          Dashboard
        </Link>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 max-w-lg text-left">
          <summary className="text-xs text-neutral-400 cursor-pointer hover:text-neutral-600">
            Error details
          </summary>
          <pre className="mt-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg overflow-auto max-h-40">
            {error.message}
            {'\n'}
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  );
}
