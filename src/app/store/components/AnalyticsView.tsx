'use client'

import { useEffect } from 'react'
import {
  trackEventOnce,
  type AnalyticsEventName,
  type AnalyticsEventProperties,
} from '@/lib/analytics'

type AnalyticsViewProps<TEvent extends AnalyticsEventName> = {
  eventName: TEvent
  properties: AnalyticsEventProperties[TEvent]
  dedupeKey: string
}

export default function AnalyticsView<TEvent extends AnalyticsEventName>({
  eventName,
  properties,
  dedupeKey,
}: AnalyticsViewProps<TEvent>) {
  useEffect(() => {
    trackEventOnce(eventName, properties, dedupeKey)
  }, [dedupeKey, eventName, properties])

  return null
}
