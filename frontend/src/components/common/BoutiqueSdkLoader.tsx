'use client';

import { useEffect } from 'react';

export function BoutiqueSdkLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scriptSrc =
      process.env.NEXT_PUBLIC_SAAS_SDK_URL ||
      'https://boutique-api-production-d010.up.railway.app/sdk/v1/boutique-sdk.min.js';
    const apiUrl =
      process.env.NEXT_PUBLIC_SAAS_API_URL ||
      'https://boutique-api-production-d010.up.railway.app';

    // 1. Inject the Master SDK script from Railway Cloud
    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;

    script.onload = () => {
      if ((window as any).BoutiqueSDK) {
        try {
          const initFn = (window as any).BoutiqueSDK.init;
          const config = {
            clientId: process.env.NEXT_PUBLIC_BOUTIQUE_CLIENT_ID || 'cl_hyd_vasanticreat_3ab4d8',
            publicKey: process.env.NEXT_PUBLIC_BOUTIQUE_PUBLIC_KEY || 'pk_live_52996adda36429e6aa48d824dbdf44ca',
            apiUrl: apiUrl,
            whatsappNumber: '919876543210',
            debug: true,
          };

          if (typeof initFn === 'function') {
            (window as any).boutique = initFn(config);
          } else {
            (window as any).boutique = new (window as any).BoutiqueSDK(config);
          }
          console.log('✅ [BoutiqueSDK] Live Gatekeeper connected to Railway!');
        } catch (e) {
          console.error('[BoutiqueSDK] Initialization error:', e);
        }
      }
    };

    script.onerror = () => {
      console.warn('⚠️ [BoutiqueSDK] Could not load master SDK script.');
    };

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
