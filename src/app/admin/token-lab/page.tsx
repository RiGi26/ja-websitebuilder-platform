import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { verifyAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/admin-auth'
import TokenLab from './TokenLab'

export const dynamic = 'force-dynamic'

// Halaman internal — jangan diindeks mesin pencari.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default async function TokenLabPage() {
  const cookieStore = await cookies()
  const isAuth = verifyAdminSessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value)
  if (!isAuth) redirect('/admin/login')

  return <TokenLab />
}
