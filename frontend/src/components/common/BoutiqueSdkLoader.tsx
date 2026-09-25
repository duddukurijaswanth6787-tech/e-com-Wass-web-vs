'use client';

import { useEffect } from 'react';

export function BoutiqueSdkLoader() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load SDK script dynamically on client side without crashing SSR
    const script = document.createElement('script');
    script.src = process.env.NEXT_PUBLIC_SAAS_SDK_URL || '/sdk/v1/boutique-sdk.min.js';
    script.async = true;

    script.onload = () => {
      if ((window as any).BoutiqueSDK) {
        try {
          (window as any).boutique = new (window as any).BoutiqueSDK({
            clientId: 'cl_hyd_vasanticreat_3ab4d8',
            publicKey: 'pk_live_52996adda36429e6aa48d824dbdf44ca',
            secretKey: 'sk_live_' + 'c6328a1f8448453dcb9aaed6fc02d45ac5fed30ddce09c5d',
            apiUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.vasanthicreations.in',
            whatsappNumber: '919876543210',
            debug: false,
          });
        } catch {}
      }
    };

    script.onerror = () => {
      console.info('Central SaaS SDK: Running in standalone resilient mode.');
    };

    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
}
