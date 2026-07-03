'use client'

import { useEffect, useState } from 'react'

// Click-to-edit bridge (Wave 2 full-editability) — dirender halaman situs HANYA
// saat ?portalEdit=1. Aktif hanya di dalam iframe (LivePreview portal): hover
// outline pada elemen ber-atribut data-edit, klik → postMessage {type:'ja:edit',
// key} ke parent SAME-ORIGIN. Parent (LivePreview) memvalidasi origin lalu
// memfokuskan form field pemilik key. Tanpa iframe (URL dibuka langsung) →
// tidak melakukan apa pun. Tidak membawa data/kredensial — murni sinyal fokus.

const STYLE = `
[data-edit]{cursor:pointer !important}
[data-edit]:hover{outline:2px dashed #0071E3 !important;outline-offset:3px;border-radius:4px}
.ja-edit-hint{position:fixed;bottom:14px;left:50%;transform:translateX(-50%);z-index:2147483647;
  background:rgba(29,29,31,.92);color:#fff;font:600 12px/1.4 system-ui,sans-serif;
  padding:8px 16px;border-radius:999px;box-shadow:0 8px 24px rgba(0,0,0,.25);pointer-events:none}
`

export default function EditBridge() {
  const [inFrame, setInFrame] = useState(false)

  useEffect(() => {
    // Hanya bermakna di dalam iframe same-origin (LivePreview portal).
    if (window.self === window.top) return
    setInFrame(true)

    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest?.('[data-edit]')
      if (!el) return
      const key = el.getAttribute('data-edit')
      if (!key) return
      // Cegah navigasi (banyak slot menempel di <a>) — klik = pilih untuk diedit.
      e.preventDefault()
      e.stopPropagation()
      window.parent.postMessage({ type: 'ja:edit', key }, window.location.origin)
    }
    // Capture-phase supaya menang atas handler tema (lightbox/anchor).
    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [])

  if (!inFrame) return null
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLE }} />
      <div className="ja-edit-hint" role="status">Mode edit — klik teks bergaris untuk mengeditnya</div>
    </>
  )
}
