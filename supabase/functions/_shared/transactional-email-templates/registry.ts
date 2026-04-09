import type { FC } from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: FC<any>
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, any>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {}

// Import and register templates below
import { template as bookingConfirmation } from './booking-confirmation.tsx'
TEMPLATES['booking-confirmation'] = bookingConfirmation

import { template as bookingApproved } from './booking-approved.tsx'
TEMPLATES['booking-approved'] = bookingApproved

import { template as welcomeEmail } from './welcome.tsx'
TEMPLATES['welcome'] = welcomeEmail
