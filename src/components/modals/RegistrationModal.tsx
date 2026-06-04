import { X, Trophy } from 'lucide-react';
import { useHubSpotForm } from '@/hooks/useHubSpotForm';

function RegistrationSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="hs-skeleton h-3 w-24" />
          <div className="hs-skeleton h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="hs-skeleton h-3 w-20" />
          <div className="hs-skeleton h-11" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <div className="hs-skeleton h-3 w-14" />
          <div className="hs-skeleton h-11" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="hs-skeleton h-3 w-16" />
          <div className="hs-skeleton h-11" />
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="hs-skeleton h-3 w-40" />
        <div className="hs-skeleton h-11" />
        <div className="hs-skeleton h-11" />
        <div className="hs-skeleton h-11" />
      </div>
      <div className="hs-skeleton h-12 rounded-full mt-1" />
    </div>
  );
}

interface RegistrationModalProps {
  open:    boolean;
  onClose: () => void;
}

export default function RegistrationModal({ open, onClose }: RegistrationModalProps) {
  const { loaded, formRef } = useHubSpotForm(open);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 cursor-pointer"
        style={{ backgroundColor: 'rgba(6,18,10,0.70)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel — fixed height so it never grows as the iframe loads */}
      <div
        className="relative w-full max-w-lg flex flex-col rounded-2xl shadow-2xl overflow-hidden"
        style={{ backgroundColor: '#FFFFFF', height: 'min(620px, 92vh)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 px-6 py-5" style={{ backgroundColor: '#1B3D2C' }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Trophy size={14} style={{ color: '#DDB870' }} />
                <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#DDB870' }}>
                  2nd Annual · Sept 26, 2026
                </span>
              </div>
              <h2
                id="register-modal-title"
                className="font-display font-bold text-white"
                style={{ fontSize: '1.35rem', letterSpacing: '-0.3px' }}
              >
                Register Your Team
              </h2>
              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.50)' }}>
                Heritage Isles Golf and Country Club
              </p>
            </div>
            <button
              onClick={onClose}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.70)' }}
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
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
            <RegistrationSkeleton />
          </div>

          {/* HubSpot form */}
          <div className="px-6 py-6">
            <div
              ref={formRef}
              className="hs-form-frame"
              data-region="na2"
              data-form-id="5e7e3de6-fe71-4792-a8db-78e3d66ccab7"
              data-portal-id="245452949"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
