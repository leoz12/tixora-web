// Minimal shape of the `window.snap` object injected by Midtrans' Snap.js
// script (https://docs.midtrans.com/docs/snap-preparation), used to open the
// payment pop-up instead of redirecting to a hosted payment page.
export interface SnapResult {
  order_id: string;
  status_code: string;
  transaction_status: string;
  payment_type?: string;
  gross_amount?: string;
}

export interface SnapPayOptions {
  onSuccess?: (result: SnapResult) => void;
  onPending?: (result: SnapResult) => void;
  onError?: (result: SnapResult) => void;
  onClose?: () => void;
}

declare global {
  interface Window {
    snap?: {
      pay: (snapToken: string, options?: SnapPayOptions) => void;
    };
  }
}
