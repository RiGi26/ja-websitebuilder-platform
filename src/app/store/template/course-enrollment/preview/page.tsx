import type { Metadata } from 'next'
import { CourseEnrollmentExperience } from '../course-enrollment-experience'

export const metadata: Metadata = {
  title: 'Course Enrollment Preview',
  description: 'Interactive preview for the Course Enrollment Webzoka template direction.',
}

export default function CourseEnrollmentPreviewPage() {
  return <CourseEnrollmentExperience mode="preview" />
}
