import type { Metadata } from 'next'
import './store.css'

export const metadata: Metadata = {
  title: 'Webzoka Store V2',
  description: 'A focused collection of website template directions from Webzoka.',
}

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return <div className="wz-store">{children}</div>
}
