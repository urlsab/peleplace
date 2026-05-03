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

import { template as registrationApproved } from './registration-approved.tsx'
TEMPLATES['registration-approved'] = registrationApproved

import { template as hostRegistrationApproved } from './host-registration-approved.tsx'
TEMPLATES['host-registration-approved'] = hostRegistrationApproved

import { template as registrationReceived } from './registration-received.tsx'
TEMPLATES['registration-received'] = registrationReceived

import { template as bookingNotAvailable } from './booking-not-available.tsx'
TEMPLATES['booking-not-available'] = bookingNotAvailable

import { template as bookingRequestReceived } from './booking-request-received.tsx'
TEMPLATES['booking-request-received'] = bookingRequestReceived
