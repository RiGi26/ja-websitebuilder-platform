import StoreTemplatePreviewPage from '@/app/store/components/StoreTemplatePreviewPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Course Enrollment Preview — Webzoka Store', description: 'Interactive preview for the Course Enrollment Webzoka template direction.', pathname: '/store/template/course-enrollment/preview', noIndex: true })

export default function CourseEnrollmentPreviewPage() {
  return <StoreTemplatePreviewPage template={getStoreTemplate('course-enrollment')} />
}
