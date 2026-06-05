'use client'
// ============================================================
// THEME SYSTEM — pemetaan nama ikon (string) → komponen lucide.
// Standar ikon (keputusan S0-1): lucide-react, BUKAN emoji. Map eksplisit
// supaya tree-shake (bukan `import *`) + terkontrol. Fallback = Store.
// ============================================================
import {
  UtensilsCrossed, Shirt, Palette, Sparkles, Smartphone, Sofa, Leaf, Baby,
  Flame, CupSoda, Crown, Store, LayoutGrid, Camera, Wind, Zap, type LucideProps,
} from 'lucide-react'

const MAP = {
  UtensilsCrossed, Shirt, Palette, Sparkles, Smartphone, Sofa, Leaf, Baby,
  Flame, CupSoda, Crown, Store, LayoutGrid, Camera, Wind, Zap,
} as const

export function ThemeIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = MAP[name as keyof typeof MAP] ?? Store
  return <Icon {...props} />
}
