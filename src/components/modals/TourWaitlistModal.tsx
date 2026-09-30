import { X } from 'lucide-react';
import { useHubSpotForm } from '@/hooks/useHubSpotForm';

function TourWaitlistSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="hs-skeleton h-3 w-full" />
        <div className="hs-skeleton h-3 w-4/5" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="hs-skeleton h-3 w-16" />
          <div className="hs-skeleton h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="hs-skeleton h-3 w-16" />
          <div className="hs-skeleton h-11" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="hs-skeleton h-3 w-12" />
        <div className="hs-skeleton h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="hs-skeleton h-3 w-24" />
        <div className="hs-skeleton h-11" />
      </div>
      <div className="flex flex-col gap-2">
        <div className="hs-skeleton h-3 w-20" />
        <div className="hs-skeleton h-11" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="hs-skeleton h-4 w-3/4" />
        <div className="hs-skeleton h-4 w-full" />
      </div>
      <div className="hs-skeleton h-12 rounded-full mt-1" />
    </div>
  );
}

interface TourWaitlistModalProps {
  open:    boolean;
  onClose: () => void;
}

export default function TourWaitlistModal({ open, onClose }: TourWaitlistModalProps) {
  const { loaded, formRef } = useHubSpotForm(open);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-waitlist-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ backgroundColor: 'rgba(0,10,25,0.55)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — fixed height so it never grows as the iframe loads */}
      <div
        className="relative w-full max-w-xl flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', height: 'min(660px, 92vh)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b"
          style={{ borderColor: 'rgba(0,19,42,0.10)', backgroundColor: '#FFFFFF' }}
        >
          <div>
            <h2
              id="tour-waitlist-modal-title"
              className="font-display text-xl font-semibold"
              style={{ color: '#1A1A1A' }}
            >
              2027 Tour Pre-Registration
            </h2>
            <p className="text-xs mt-0.5" style={{ color: '#9B9B9B' }}>
              Join the waitlist — be first to know when registration opens.
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-gray-100"
            aria-label="Close"
            style={{ color: '#9B9B9B' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Body — fills remaining fixed space; skeleton overlays until iframe is ready */}
        <div className="flex-1 overflow-y-auto relative" style={{ minHeight: 0 }}>

          {/* Shimmer skeleton — fades out once form loads */}
          <div
            className="absolute inset-0 px-6 py-6"
            style={{
              backgroundColor: '#FFFFFF',
              opacity: loaded ? 0 : 1,
              transition: 'opacity 0.45s ease',
              pointerEvents: loaded ? 'none' : 'auto',
              zIndex: 1,
            }}
          >
            <TourWaitlistSkeleton />
          </div>

          {/* HubSpot form */}
          <div className="px-6 py-6">
            <div
              ref={formRef}
              className="hs-form-frame"
              data-region="na2"
              data-form-id="de823cf9-8551-497a-9f74-25c00d257397"
              data-portal-id="245452949"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
