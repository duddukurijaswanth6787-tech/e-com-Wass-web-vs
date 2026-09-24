'use client';

import { useEffect, useRef } from 'react';

export default function SaasAdminMountPage() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.boutique && mountRef.current) {
      window.boutique.admin.mount(mountRef.current);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8 flex items-center justify-center">
      <div ref={mountRef} id="boutique-admin-mount" className="w-full max-w-5xl" />
    </div>
  );
}
