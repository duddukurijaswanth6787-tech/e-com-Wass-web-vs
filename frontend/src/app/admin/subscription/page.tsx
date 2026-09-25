'use client';

import React, { useEffect, useState } from 'react';
import {
  Image as ImageIcon,
  HardDrive,
  Layers,
  CheckCircle2,
  Sparkles,
  Zap,
  ArrowRight,
  RefreshCw,
  Check,
} from 'lucide-react';
import type { SaasClientStatus } from '@/types/boutique-sdk';

interface SaasPlan {
  id: string;
  name: string;
  priceInrMonthly: number;
  priceInrYearly: number;
  maxImages: number;
  maxStorageBytes: number;
  allowOnlineCart: boolean;
  allowOrdersPortal: boolean;
  allowInventory: boolean;
  allowVariants: boolean;
  allowCustomersCrm: boolean;
  allowCoupons: boolean;
  allowStaffAccounts: number;
  allowAiSalesBot: boolean;
}

export default function SubscriptionAdminPage() {
  const [status, setStatus] = useState<SaasClientStatus | null>(null);
  const [plans, setPlans] = useState<SaasPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRenewing, setIsRenewing] = useState(false);

  const loadDynamicSubscriptionData = async () => {
    setLoading(true);
    try {
      const centralApiUrl = (typeof window !== 'undefined' && window.boutique?.apiUrl) || process.env.NEXT_PUBLIC_API_BASE_URL || 'https://boutique-api-production-d010.up.railway.app';
      const clientId = (typeof window !== 'undefined' && window.boutique?.clientId) || 'cl_hyd_vasanticreat_3ab4d8';
      const publicKey = (typeof window !== 'undefined' && window.boutique?.publicKey) || 'pk_live_52996adda36429e6aa48d824dbdf44ca';

      // 1. Fetch live quotas directly from Central SaaS Status endpoint
      const statusRes = await fetch(`${centralApiUrl}/api/v1/client/status`, {
        headers: {
          'x-client-id': clientId,
          'x-public-key': publicKey,
        },
      });
      if (statusRes.ok) {
        const liveStatus = await statusRes.json();
        setStatus(liveStatus);
      } else if (typeof window !== 'undefined' && window.boutique?.gatekeeper) {
        const liveStatus = await window.boutique.gatekeeper.checkStatus(true);
        setStatus(liveStatus);
      }

      // 2. Fetch live SaaS tiers from Central PostgreSQL Database
      const plansRes = await fetch(`${centralApiUrl}/api/v1/client/plans`, {
        headers: {
          'x-client-id': clientId,
          'x-public-key': publicKey,
        },
      });
      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData);
      }
    } catch (err) {
      console.error('Failed to load dynamic subscription data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDynamicSubscriptionData();
  }, []);

  const handlePlanAction = async (planId: string) => {
    if (typeof window !== 'undefined' && window.boutique) {
      setIsRenewing(true);
      try {
        await window.boutique.billing.openRenewalModal({ planId });
        await loadDynamicSubscriptionData();
      } catch (err) {
        console.error('Renewal modal error:', err);
      } finally {
        setIsRenewing(false);
      }
    }
  };

  if (loading && !status) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500 font-semibold text-sm">
          <RefreshCw className="w-5 h-5 animate-spin text-indigo-600" />
          Loading dynamic SaaS subscription metrics...
        </div>
      </div>
    );
  }

  const currentImages = status?.currentImagesCount || 0;
  const maxImages = status?.maxImages || 150;
  const imagePct = Math.min(100, Math.round((currentImages / maxImages) * 100));
  const slotsAvailable = Math.max(0, maxImages - currentImages);

  const currentStorageMb = ((status?.currentStorageBytes || 0) / (1024 * 1024)).toFixed(2);
  const maxStorageGb = ((status?.maxStorageBytes || 10737418240) / (1024 * 1024 * 1024)).toFixed(1);
  const storagePct = Math.min(
    100,
    Math.round(((status?.currentStorageBytes || 0) / (status?.maxStorageBytes || 1)) * 100)
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Subscription &amp; SaaS Quotas</h1>
          <p className="text-xs text-slate-500 mt-1 font-mono">
            {status?.businessName || 'Vasanti Creations'} • ClientID: {status?.clientId}
          </p>
        </div>
        <button
          onClick={loadDynamicSubscriptionData}
          className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Metrics
        </button>
      </div>

      {/* 3 TOP DYNAMIC STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold font-mono text-slate-900">
              {currentImages} / {maxImages} Photos
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Media Uploads Quota</h3>
            <p className="text-xs text-slate-500 mt-0.5">High-resolution S3 boutique photos</p>
          </div>
          <div className="space-y-1.5 pt-2">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${imagePct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>{imagePct}% Used</span>
              <span>{slotsAvailable} Slots Available</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold font-mono text-slate-900">
              {currentStorageMb} MB / {maxStorageGb} GB
            </span>
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">AWS S3 Cloud Storage</h3>
            <p className="text-xs text-slate-500 mt-0.5">Dedicated Hyderabad S3 Bucket</p>
          </div>
          <div className="space-y-1.5 pt-2">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-600 rounded-full transition-all duration-500"
                style={{ width: `${storagePct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 font-medium">
              <span>{storagePct}% Used</span>
              <span>{maxStorageGb} GB Total Limit</span>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-wider font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                {status?.planName || 'Standard'} Tier
              </span>
            </div>
            <h3 className="font-bold text-slate-900 text-sm">SaaS Feature Entitlements</h3>
            <p className="text-xs text-slate-500 mt-0.5">Enabled modules under current active plan</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-700 pt-1">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> Online Cart &amp; POS
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> Orders Portal
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> Customers CRM
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700">
              <Check className="w-3.5 h-3.5" /> Coupons &amp; Offers
            </div>
          </div>
        </div>
      </div>

      {/* DYNAMIC PLAN CARDS LOADED FROM POSTGRESQL */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Available Central SaaS Tiers</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Switch plans dynamically without downtime. Storage quotas and features scale instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => {
            const isCurrentActive = status?.planId === plan.id;
            const storageGb = (plan.maxStorageBytes / (1024 * 1024 * 1024)).toFixed(0);

            return (
              <div
                key={plan.id}
                className={`bg-white rounded-3xl p-6 flex flex-col justify-between transition-all relative ${
                  isCurrentActive
                    ? 'border-2 border-indigo-600 shadow-lg shadow-indigo-50 ring-2 ring-indigo-500/10'
                    : 'border border-slate-200 hover:border-slate-300 shadow-xs'
                }`}
              >
                {isCurrentActive && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    CURRENT ACTIVE PLAN
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-2xl font-black text-slate-900">
                        ₹{plan.priceInrMonthly.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400">/ month</span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{plan.maxImages} Product Photos</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{storageGb} GB AWS S3 Cloud Storage</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Full Multi-Variant &amp; CRM Engine</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Razorpay &amp; COD Gateways</span>
                    </li>
                    {plan.allowStaffAccounts > 2 && (
                      <li className="flex items-center gap-2 text-indigo-700 font-semibold">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span>{plan.allowStaffAccounts} Multi-Staff Accounts</span>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handlePlanAction(plan.id)}
                    disabled={isRenewing}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 ${
                      isCurrentActive
                        ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {isCurrentActive ? (
                      <>
                        <Zap className="w-4 h-4 fill-white" /> Renew Standard Plan
                      </>
                    ) : (
                      <>
                        Upgrade to {plan.name.split(' ')[1] || 'Plan'} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
