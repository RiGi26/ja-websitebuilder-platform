/**
 * High-performance UI Utilities for Japan Arena Website Builder
 */

export function triggerHaptic(duration = 10) {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(duration)
  }
}
