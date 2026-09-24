export interface SaasProduct {
  id: string;
  title: string;
  price: number;
  fileUrl: string;
  category: string;
  sku?: string;
  stockCount?: number;
  sizes?: string[];
  colors?: string[];
}

export interface SaasCartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

export interface SaasClientStatus {
  clientId: string;
  businessName: string;
  status: 'ACTIVE' | 'GRACE_PERIOD' | 'SUSPENDED' | 'TESTING';
  planId: string;
  planName: string;
  priceInrMonthly: number;
  maxImages: number;
  maxStorageBytes: number;
  currentImagesCount: number;
  currentStorageBytes: number;
  isOverQuota: boolean;
  allowOnlineCart: boolean;
  allowOrdersPortal: boolean;
  allowInventory: boolean;
  allowVariants: boolean;
  allowCustomersCrm: boolean;
  allowCoupons: boolean;
  allowStaffAccounts: number;
  allowAiSalesBot: boolean;
  ownerPhone: string;
}

declare global {
  interface Window {
    boutique?: {
      clientId: string;
      publicKey: string;
      secretKey?: string;
      apiUrl: string;
      gatekeeper: {
        checkStatus: (forceRefresh?: boolean) => Promise<SaasClientStatus>;
        removeOverlay: () => void;
      };
      storage: {
        fetchMedia: () => Promise<SaasProduct[]>;
        upload: (file: File, options?: { title?: string; price?: number; category?: string }) => Promise<unknown>;
        delete: (id: string) => Promise<boolean>;
      };
      cart: {
        getItems: () => SaasCartItem[];
        addItem: (item: Omit<SaasCartItem, 'quantity'>, quantity?: number) => SaasCartItem[];
        removeItem: (id: string, size?: string, color?: string) => SaasCartItem[];
        updateQuantity: (id: string, quantity: number, size?: string, color?: string) => SaasCartItem[];
        getTotalAmount: () => number;
        clearCart: () => void;
      };
      checkout: {
        placeOrder: (payload: {
          customerName: string;
          customerPhone: string;
          customerEmail?: string;
          shippingAddress: string;
          city: string;
          pincode: string;
          couponCode?: string;
          paymentMethod: 'RAZORPAY' | 'COD' | 'WHATSAPP_MANUAL';
        }) => Promise<{
          success: boolean;
          orderId: string;
          orderNumber: string;
          totalAmountInr: number;
        }>;
      };
      whatsapp: {
        openChat: (product: { title: string; price?: number; size?: string }) => void;
      };
      billing: {
        openRenewalModal: (options?: { planId?: string; billingCycle?: 'MONTHLY' | 'YEARLY' }) => Promise<void>;
      };
      admin: {
        mount: (container: string | HTMLElement) => Promise<void>;
      };
    };
    BoutiqueSDK: unknown;
    EcomSDK: unknown;
  }
}
