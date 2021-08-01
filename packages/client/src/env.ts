export const SIGNALING_SERVICE =
  process.env.STORYBOOK_SIGNAL_URL ||
  process.env.NEXT_PUBLIC_SIGNAL_URL ||
  "ws://localhost:6006/ws/signal";
export const CENTRAL_AUTHORITY =
  process.env.STORYBOOK_PROVIDER_URL ||
  process.env.NEXT_PUBLIC_PROVIDER_URL ||
  "ws://localhost:6006/ws/provider";
