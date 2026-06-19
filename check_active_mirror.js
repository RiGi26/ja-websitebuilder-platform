const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

const envPath = '.env.local'
const envContent = fs.readFileSync(envPath, 'utf8')

const env = {}
envContent.split('\n').forEach(line => {
  const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
  if (match) {
    let value = match[2] || ''
    if (value.startsWith('"') && value.endsWith('"')) {
      value = value.substring(1, value.length - 1)
    }
    env[match[1]] = value
  }
})

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
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
