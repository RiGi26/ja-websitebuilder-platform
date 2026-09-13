import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { createStoreMetadata } from '@/lib/store/metadata'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata = createStoreMetadata({ title: 'Course Enrollment — Webzoka Store', description: 'A structured program discovery and enrollment-inquiry Webzoka template direction for education businesses.', pathname: '/store/template/course-enrollment' })

export default function CourseEnrollmentPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('course-enrollment')} />
}
