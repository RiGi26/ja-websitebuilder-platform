/**
 * High-performance UI Utilities for Japan Arena Website Builder
 */

export function triggerHaptic(duration = 10) {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    window.navigator.vibrate(duration)
  }
}

/**
 * Skeleton Loader Component
 */
export function Skeleton({ className = "", width, height }: { className?: string; width?: string | number; height?: string | number }) {
  return (
    <div 
      className={`skeleton rounded-lg ${className}`} 
      style={{ width, height }}
    />
  )
}
