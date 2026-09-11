import type { Metadata } from 'next'
import StoreTemplateDetailPage from '@/app/store/components/StoreTemplateDetailPage'
import { getStoreTemplate } from '@/lib/store/templates'

export const metadata: Metadata = { title: 'Course Enrollment — Webzoka Store', description: 'A structured program discovery and enrollment-inquiry Webzoka template direction for education businesses.', robots: { index: false, follow: false } }

export default function CourseEnrollmentPage() {
  return <StoreTemplateDetailPage template={getStoreTemplate('course-enrollment')} />
}
