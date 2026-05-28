// eslint-disable-next-line @typescript-eslint/no-explicit-any
import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  LandingPage,
  PageSection,
  LandingPageWithSections,
  InsertLandingPageInput,
  InsertPageSectionInput,
} from '@/types/websitebuilder'

// Using SupabaseClient<any> because supabase-js v2 requires generated types
// (from CLI) to resolve .insert()/.update() inference correctly with custom DB types.
// All public function signatures stay fully typed via explicit return annotations.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Client = SupabaseClient<any>

// ──────────────────────────────────────────────────────────────
// Landing Pages
// ──────────────────────────────────────────────────────────────

/**
 * Insert landing page baru, return row lengkap.
 */
export async function createLandingPage(
  client: Client,
  input: InsertLandingPageInput
): Promise<LandingPage> {
  const { data, error } = await client
    .from('landing_pages')
    .insert(input)
    .select()
    .single()

  if (error) throw new Error(`createLandingPage: ${error.message}`)
  return data as LandingPage
}

/**
 * Update landing page by id, return row terbaru.
 */
export async function updateLandingPage(
  client: Client,
  id: string,
  input: Partial<InsertLandingPageInput>
): Promise<LandingPage> {
  const { data, error } = await client
    .from('landing_pages')
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`updateLandingPage: ${error.message}`)
  return data as LandingPage
}

/**
 * Publish halaman — shortcut set status = 'published'.
 */
export async function publishPage(
  client: Client,
  id: string
): Promise<LandingPage> {
  const { data, error } = await client
    .from('landing_pages')
    .update({ status: 'published' })
    .eq('id', id)
    .select()
    .single()

  if (error) throw new Error(`publishPage: ${error.message}`)
  return data as LandingPage
}

/**
 * Hard delete landing page. Cascade otomatis hapus semua page_sections.
 */
export async function deleteLandingPage(
  client: Client,
  id: string
): Promise<void> {
  const { error } = await client
    .from('landing_pages')
    .delete()
    .eq('id', id)

  if (error) throw new Error(`deleteLandingPage: ${error.message}`)
}

/**
 * Fetch satu halaman published by slug beserta sections visible, urut asc.
 */
export async function fetchPageBySlug(
  client: Client,
  slug: string
): Promise<LandingPageWithSections | null> {
  const { data, error } = await client
    .from('landing_pages')
    .select(`
      *,
      page_sections (
        *
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .eq('page_sections.is_visible', true)
    .order('urutan', { referencedTable: 'page_sections', ascending: true })
    .maybeSingle()

  if (error) throw new Error(`fetchPageBySlug: ${error.message}`)
  if (!data) return null

  return data as LandingPageWithSections
}

/**
 * List semua halaman milik tenant, terbaru dulu.
 * Jika tenantId diberikan, filter eksplisit; jika tidak, RLS handle isolasi.
 */
export async function fetchTenantPages(
  client: Client,
  tenantId?: string
): Promise<LandingPage[]> {
  let query = client
    .from('landing_pages')
    .select('*')
    .order('updated_at', { ascending: false })

  if (tenantId) {
    query = query.eq('tenant_id', tenantId)
  }

  const { data, error } = await query

  if (error) throw new Error(`fetchTenantPages: ${error.message}`)
  return (data ?? []) as LandingPage[]
}

// ──────────────────────────────────────────────────────────────
// Page Sections
// ──────────────────────────────────────────────────────────────

/**
 * Insert atau update section berdasarkan konflik (page_id, urutan).
 */
export async function upsertSection(
  client: Client,
  input: InsertPageSectionInput
): Promise<PageSection> {
  const { data, error } = await client
    .from('page_sections')
    .upsert(input, { onConflict: 'page_id, urutan' })
    .select()
    .single()

  if (error) throw new Error(`upsertSection: ${error.message}`)
  return data as PageSection
}

/**
 * Bulk delete sections by id dalam satu page.
 */
export async function deleteSections(
  client: Client,
  pageId: string,
  sectionIds: string[]
): Promise<void> {
  if (sectionIds.length === 0) return

  const { error } = await client
    .from('page_sections')
    .delete()
    .eq('page_id', pageId)
    .in('id', sectionIds)

  if (error) throw new Error(`deleteSections: ${error.message}`)
}

/**
 * Batch update urutan sections — untuk fitur drag-drop reorder.
 */
export async function reorderSections(
  client: Client,
  updates: Array<{ id: string; urutan: number }>
): Promise<void> {
  if (updates.length === 0) return

  const { error } = await client
    .from('page_sections')
    .upsert(updates, { onConflict: 'id' })

  if (error) throw new Error(`reorderSections: ${error.message}`)
}

/**
 * Patch isi_komponen saja — untuk live editor.
 */
export async function updateSectionContent(
  client: Client,
  sectionId: string,
  isiKomponen: Record<string, unknown>
): Promise<PageSection> {
  const { data, error } = await client
    .from('page_sections')
    .update({ isi_komponen: isiKomponen })
    .eq('id', sectionId)
    .select()
    .single()

  if (error) throw new Error(`updateSectionContent: ${error.message}`)
  return data as PageSection
}

/**
 * Toggle visibilitas section (show/hide di preview).
 */
export async function toggleSectionVisibility(
  client: Client,
  sectionId: string,
  isVisible: boolean
): Promise<PageSection> {
  const { data, error } = await client
    .from('page_sections')
    .update({ is_visible: isVisible })
    .eq('id', sectionId)
    .select()
    .single()

  if (error) throw new Error(`toggleSectionVisibility: ${error.message}`)
  return data as PageSection
}
