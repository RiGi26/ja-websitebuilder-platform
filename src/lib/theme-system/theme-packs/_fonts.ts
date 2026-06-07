// Font stacks bersama untuk semua token-pack tema (theme-packs/*).
// POLISH #4 (2026-06-07): pakai font asli via next/font, dimuat di
// src/app/[slug]/layout.tsx (situs published) yang meng-expose CSS variable
// --font-jakarta/-fraunces/-grotesk/-nunito. Di luar subtree itu (UAT
// theme-samples, test, /admin), variabel tak ada → `var(--x, <fallback>)`
// jatuh ke stack sistem. Jadi nol regresi & tetap render di mana saja.
export const SANS = "var(--font-jakarta, ui-sans-serif), system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
export const SERIF = "var(--font-fraunces, 'Iowan Old Style'), 'Palatino Linotype', Georgia, 'Times New Roman', serif"
// Grotesque tegas untuk gaya editorial/streetwear/tech.
export const GROTESK = "var(--font-grotesk, 'Helvetica Neue'), 'Arial Narrow', Helvetica, Arial, sans-serif"
// Rounded ramah untuk gaya playful (Anak) & lembut (Kecantikan blush).
export const ROUNDED = "var(--font-nunito, 'SF Pro Rounded'), ui-rounded, 'Hiragino Maru Gothic ProN', 'Quicksand', 'Segoe UI', system-ui, sans-serif"
