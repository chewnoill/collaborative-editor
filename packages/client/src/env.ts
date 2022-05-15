export const SIGNALING_SERVICE =
  process.env.NEXT_PUBLIC_SIGNAL_URL || "ws://localhost:6001/ws/signal";
export const CENTRAL_AUTHORITY =
  process.env.NEXT_PUBLIC_PROVIDER_URL || "ws://localhost:6001/ws/provider";
