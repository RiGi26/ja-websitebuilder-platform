'use client'
// ============================================================
// THEME SYSTEM — pemetaan nama ikon (string) → komponen lucide.
// Standar ikon (keputusan S0-1): lucide-react, BUKAN emoji. Map eksplisit
// supaya tree-shake (bukan `import *`) + terkontrol. Fallback = Store.
// ============================================================
import {
  UtensilsCrossed, Shirt, Palette, Sparkles, Smartphone, Sofa, Leaf, Baby,
  Flame, CupSoda, Crown, Store, LayoutGrid, Camera, Wind, Zap,
  // Kerajinan / Kecantikan / Gadget / Rumah / Herbal / Anak (S-replikasi 6 sub-kat)
  Gem, Grid2x2, Frame, Flower2, Sun, Moon, Cpu, Monitor, Gamepad2,
  Armchair, Lamp, Sprout, Soup, Rabbit, Smile, Candy,
  // Restaurant (Sprint 4): Warung / Cafe / Fine Dining
  Coffee, ChefHat, Bean, Cherry, Utensils, Salad,
  // Klinik (Sprint 6): Umum / Estetik / Wellness
  Stethoscope, HeartPulse, Activity, Shield, Droplet, TreePine,
  // Sekolah (Sprint 7): Reguler / Islami / Kursus
  GraduationCap, Backpack, Trophy, BookOpen, Star, Target, Rocket, PencilRuler, type LucideProps,
} from 'lucide-react'

const MAP = {
  UtensilsCrossed, Shirt, Palette, Sparkles, Smartphone, Sofa, Leaf, Baby,
  Flame, CupSoda, Crown, Store, LayoutGrid, Camera, Wind, Zap,
  Gem, Grid2x2, Frame, Flower2, Sun, Moon, Cpu, Monitor, Gamepad2,
  Armchair, Lamp, Sprout, Soup, Rabbit, Smile, Candy,
  Coffee, ChefHat, Bean, Cherry, Utensils, Salad,
  Stethoscope, HeartPulse, Activity, Shield, Droplet, TreePine,
  GraduationCap, Backpack, Trophy, BookOpen, Star, Target, Rocket, PencilRuler,
} as const

export function ThemeIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = MAP[name as keyof typeof MAP] ?? Store
  return <Icon {...props} />
}
