'use client'
import { useEffect, useState, type ReactNode } from 'react'
import { rupiah, type PortalVehicle } from './tokens'
import RentalBookingWizard from './RentalBookingWizard'

// ============================================================
// Grid armada (client) — sumber kebenaran = portal rental (GET info via proxy
// same-origin), fallback ke data `services` WB bila proxy gagal / booking belum
// di-wire. CTA kartu membuka wizard booking dengan mobil terpilih.
// Styling numpang GLOBAL_CSS renderer (.ra-*) — komponen ini anak .ra-root.
// ============================================================

export interface FallbackCar {
  nama: string
  deskripsi: string | null
  harga: number
  gambar_url: string | null
}

function CarPlaceholder() {
  return (
    <svg width="72" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d="M5 11 6.5 6.7A2 2 0 0 1 8.4 5.3h7.2a2 2 0 0 1 1.9 1.4L19 11m-14 0h14m-14 0a2 2 0 0 0-2 2v3.5h2M19 11a2 2 0 0 1 2 2v3.5h-2m-12 0h8m-8 0a2 2 0 1 1-4 0m16 0a2 2 0 1 1-4 0" />
    </svg>
  )
}

function SpecChip({ children }: { children: ReactNode }) {
  return <span className="ra-spec">{children}</span>
}

export default function AsphaltFleetSection({
  bookingSlug,
  fallback,
  waHref,
}: {
  bookingSlug?: string
  fallback: FallbackCar[]
  waHref: string | null
}) {
  const [vehicles, setVehicles] = useState<PortalVehicle[] | null>(null)
  const [loading, setLoading] = useState(!!bookingSlug)
  const [wizardFor, setWizardFor] = useState<string | null>(null)

  useEffect(() => {
    if (!bookingSlug) return
    fetch(`/api/rental-proxy/${bookingSlug}/info`)
      .then((r) => r.json())
      .then((d) => setVehicles(Array.isArray(d.vehicles) ? d.vehicles : null))
      .catch(() => setVehicles(null))
      .finally(() => setLoading(false))
  }, [bookingSlug])

  const live = !!bookingSlug && !!vehicles && vehicles.length > 0

  return (
    <>
      <div className="ra-fleet-grid">
        {loading && [0, 1, 2].map((i) => (
          <div key={i} className="ra-car-card ra-skel" aria-hidden="true">
            <div className="ra-car-photo" />
            <div className="ra-car-body">
              <div className="ra-skel-line" style={{ width: '60%' }} />
              <div className="ra-skel-line" style={{ width: '85%' }} />
              <div className="ra-skel-line" style={{ width: '45%' }} />
            </div>
          </div>
        ))}

        {!loading && live && vehicles!.map((v) => {
          const label = `${v.brand ?? ''} ${v.model ?? ''}`.trim() || 'Mobil'
          return (
            <article key={v.id} className="ra-car-card">
              <div className="ra-car-photo">
                <span className="ra-badge">{v.type}</span>
                {v.photos?.[0]
                  ? <img src={v.photos[0]} alt={label} loading="lazy" />
                  : <CarPlaceholder />}
              </div>
              <div className="ra-car-body">
                <h3 className="ra-car-name">{label}</h3>
                <div className="ra-spec-row">
                  {v.capacity ? <SpecChip>{v.capacity} kursi</SpecChip> : null}
                  {v.transmission ? <SpecChip>{v.transmission}</SpecChip> : null}
                  {v.fuel_type ? <SpecChip>{v.fuel_type}</SpecChip> : null}
                  {v.year ? <SpecChip>{v.year}</SpecChip> : null}
                </div>
                {v.description ? <p className="ra-car-desc">{v.description}</p> : null}
                <div className="ra-car-foot">
                  <p className="ra-price">{rupiah(v.price_per_day)}<small>per hari</small></p>
                  <button className="ra-btn ra-btn-primary ra-btn-card" type="button" onClick={() => setWizardFor(v.id)}>
                    Booking
                  </button>
                </div>
              </div>
            </article>
          )
        })}

        {!loading && !live && fallback.map((c, i) => (
          <article key={i} className="ra-car-card">
            <div className="ra-car-photo">
              {c.gambar_url ? <img src={c.gambar_url} alt={c.nama} loading="lazy" /> : <CarPlaceholder />}
            </div>
            <div className="ra-car-body">
              <h3 className="ra-car-name">{c.nama}</h3>
              {c.deskripsi ? <p className="ra-car-desc">{c.deskripsi}</p> : null}
              <div className="ra-car-foot">
                <p className="ra-price">{c.harga > 0 ? rupiah(c.harga) : 'Hubungi kami'}{c.harga > 0 ? <small>per hari</small> : null}</p>
                {waHref && (
                  <a className="ra-btn ra-btn-primary ra-btn-card" href={waHref} target="_blank" rel="noopener noreferrer">
                    Booking via WA
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}

        {!loading && !live && fallback.length === 0 && (
          <p className="ra-fleet-empty">
            Armada sedang disiapkan.{waHref ? ' Sementara itu, tanya ketersediaan lewat WhatsApp.' : ''}
          </p>
        )}
      </div>

      {wizardFor && bookingSlug && vehicles && (
        <RentalBookingWizard
          bookingSlug={bookingSlug}
          vehicles={vehicles}
          initialVehicleId={wizardFor}
          onClose={() => setWizardFor(null)}
        />
      )}
    </>
  )
}
