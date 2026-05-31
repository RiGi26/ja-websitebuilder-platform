// ============================================================
// Enkripsi simetris untuk rahasia per-tenant (mis. Midtrans server key).
// AES-256-GCM. Server-only — JANGAN import dari komponen client.
// Key diturunkan dari env PAYMENT_ENC_SECRET (string acak panjang) via
// scrypt → 32 byte. Format ciphertext (base64): [salt(16)|iv(12)|tag(16)|data].
// ============================================================

import crypto from 'crypto'

const ALGO = 'aes-256-gcm'

function getMasterSecret(): string {
  const s = process.env.PAYMENT_ENC_SECRET
  if (!s || s.length < 16) {
    throw new Error('PAYMENT_ENC_SECRET belum di-set / terlalu pendek (min 16 char).')
  }
  return s
}

function deriveKey(salt: Buffer): Buffer {
  return crypto.scryptSync(getMasterSecret(), salt, 32)
}

export function encryptSecret(plaintext: string): string {
  const salt = crypto.randomBytes(16)
  const iv = crypto.randomBytes(12)
  const key = deriveKey(salt)
  const cipher = crypto.createCipheriv(ALGO, key, iv)
  const enc = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return Buffer.concat([salt, iv, tag, enc]).toString('base64')
}

export function decryptSecret(ciphertextB64: string): string {
  const raw = Buffer.from(ciphertextB64, 'base64')
  const salt = raw.subarray(0, 16)
  const iv = raw.subarray(16, 28)
  const tag = raw.subarray(28, 44)
  const data = raw.subarray(44)
  const key = deriveKey(salt)
  const decipher = crypto.createDecipheriv(ALGO, key, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(data), decipher.final()]).toString('utf8')
}

// Tampilkan key tersamar untuk UI ("sudah tersimpan") tanpa membuka isinya.
export function maskKey(plaintext: string): string {
  if (plaintext.length <= 8) return '••••'
  return `${plaintext.slice(0, 4)}••••${plaintext.slice(-4)}`
}
