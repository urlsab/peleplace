/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface BookingConfirmationProps {
  guestName?: string
  hostTitle?: string
  eventDate?: string
  hostType?: string
}

const hostTypeLabels: Record<string, string> = {
  family: 'אירוח משפחתי',
  work: 'עבודה',
  volunteer: 'התנדבות',
}

const BookingConfirmation: React.FC<BookingConfirmationProps> = ({
  guestName = 'אורח/ת',
  hostTitle = 'המארח',
  eventDate = '',
  hostType = 'family',
}) => (
  <Html dir="rtl" lang="he">
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>בקשת ההצטרפות נשלחה! ✨</Text>
        <Text style={text}>
          שלום {guestName},
        </Text>
        <Text style={text}>
          הבקשה שלך להצטרף ל<strong>{hostTitle}</strong> ({hostTypeLabels[hostType] || hostType})
          {eventDate ? ` בתאריך ${eventDate}` : ''} נשלחה בהצלחה.
        </Text>
        <Text style={text}>
          המארח/ת יקבל/תקבל הודעה ויחזור/תחזור אליך בהקדם.
        </Text>
        <Hr style={hr} />
        <Section style={buttonSection}>
          <Button style={button} href="https://peleplace.lovable.app/my-bookings">
            צפייה בבקשות שלי
          </Button>
        </Section>
        <Text style={footer}>פל״א — פשוט לבחור איפה</Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#f5f3ee',
  fontFamily: 'Heebo, Arial, sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '40px auto',
  padding: '32px',
  borderRadius: '12px',
  maxWidth: '480px',
}

const heading = {
  fontSize: '22px',
  fontWeight: '700' as const,
  color: 'hsl(210, 18%, 20%)',
  textAlign: 'center' as const,
  marginBottom: '24px',
}

const text = {
  fontSize: '15px',
  lineHeight: '1.7',
  color: 'hsl(210, 8%, 46%)',
}

const hr = {
  borderColor: '#e8e4dd',
  margin: '24px 0',
}

const buttonSection = {
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: 'hsl(155, 30%, 45%)',
  color: '#ffffff',
  borderRadius: '12px',
  fontSize: '15px',
  fontWeight: '600' as const,
  padding: '12px 28px',
  textDecoration: 'none',
}

const footer = {
  fontSize: '12px',
  color: 'hsl(210, 8%, 46%)',
  textAlign: 'center' as const,
  marginTop: '24px',
}

export const template: TemplateEntry = {
  component: BookingConfirmation,
  subject: 'בקשת ההצטרפות נשלחה בהצלחה! ✨',
  displayName: 'Booking Confirmation',
  previewData: {
    guestName: 'דנה כהן',
    hostTitle: 'משפחת לוי',
    eventDate: 'שבת פרשת בראשית',
    hostType: 'family',
  },
}
