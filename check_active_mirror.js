const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const envPath = '.env.local'
const env = { ...process.env }
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match && !env[match[1]]) {
      let value = match[2] || ''
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.substring(1, value.length - 1)
      }
      env[match[1]] = value
    }
  })
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseSecretKey = env.SUPABASE_SECRET_KEY

if (!supabaseSecretKey?.startsWith('sb_secret_')) {
  throw new Error('SUPABASE_SECRET_KEY must contain a secret key')
}

const supabase = createClient(supabaseUrl, supabaseSecretKey)

async function run() {
  if (process.argv.includes('probe') || process.argv.includes('--probe')) {
    const { error } = await supabase
      .from('catalog_mirror')
      .select('pack_id', { head: true, count: 'exact' })
      .eq('tenant_slug', 'bakso-tini')

    if (error) throw error
    console.log('catalog_mirror read-only probe passed')
    return
  }

  const { data, error } = await supabase
    .from('catalog_mirror')
    .select('pack_id, product_nama, kategori, is_active, synced_at')
    .eq('tenant_slug', 'bakso-tini')

  if (error) {
    console.error('Error:', error)
    return
  }

  console.log(`Found ${data.length} rows in catalog_mirror for bakso-tini:`)
  console.log(data)
}

run()
