import { CareBookingExperience } from '@/app/store/template/care-booking/care-booking-experience'
import { CourseEnrollmentExperience } from '@/app/store/template/course-enrollment/course-enrollment-experience'
import { EasyBookingExperience } from '@/app/store/template/easy-booking/easy-booking-experience'
import { ModernCatalogExperience } from '@/app/store/template/modern-catalog/modern-catalog-experience'
import { TrustProfileExperience } from '@/app/store/template/trust-profile/trust-profile-experience'
import WarmCommerceSite from '@/app/store/template/warm-commerce/WarmCommerceSite'
import type { TemplateSlug } from '@/lib/store/types'
import type { StoreTemplate } from '@/lib/store/types'
import StorePreviewFrame from './StorePreviewFrame'

function PreviewRuntime({ slug }: { slug: TemplateSlug }) {
  switch (slug) {
    case 'warm-commerce':
      return <WarmCommerceSite />
    case 'modern-catalog':
      return <ModernCatalogExperience mode="preview" showPreviewStrip={false} />
    case 'trust-profile':
      return <TrustProfileExperience mode="preview" showPreviewStrip={false} />
    case 'care-booking':
      return <CareBookingExperience mode="preview" showPreviewStrip={false} />
    case 'course-enrollment':
      return <CourseEnrollmentExperience mode="preview" showPreviewStrip={false} />
    case 'easy-booking':
      return <EasyBookingExperience mode="preview" showPreviewStrip={false} />
  }
}

export default function StoreTemplatePreviewPage({ template }: { template: StoreTemplate }) {
  return (
    <StorePreviewFrame template={template}>
      <PreviewRuntime slug={template.slug} />
    </StorePreviewFrame>
  )
}
