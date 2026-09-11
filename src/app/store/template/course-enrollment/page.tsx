import type { Metadata } from 'next'
import { CourseEnrollmentExperience } from './course-enrollment-experience'

export const metadata: Metadata = {
  title: 'Course Enrollment',
  description: 'A structured program discovery and enrollment-inquiry Webzoka template direction for education businesses.',
}

export default function CourseEnrollmentPage() {
  return <CourseEnrollmentExperience mode="detail" />
}
