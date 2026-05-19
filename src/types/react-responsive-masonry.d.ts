declare module 'react-responsive-masonry' {
  import { ReactNode } from 'react'

  interface MasonryProps {
    columnsCount?: number
    gutter?: string
    children?: ReactNode
    className?: string
    style?: React.CSSProperties
  }

  interface ResponsiveMasonryProps {
    columnsCountBreakPoints?: Record<number, number>
    children?: ReactNode
    className?: string
    style?: React.CSSProperties
  }

  export default function Masonry(props: MasonryProps): JSX.Element
  export function ResponsiveMasonry(props: ResponsiveMasonryProps): JSX.Element
}
