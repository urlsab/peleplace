/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import { Html, Head, Body, Container, Section, Text, Button, Hr } from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface BookingRequestReceivedProps {
  hostName?: string
  guestName?: string
  eventDate?: string
  message?: string
}

const BookingRequestReceived: React.FC<BookingRequestReceivedProps> = ({
  hostName = 'מארח/ת יקר/ה',
  guestName = 'אורח/ת',
  eventDate = '',
  message = '',
}) => (
  <Html dir="rtl" lang="he">
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>קיבלת בקשת אירוח חדשה ✨</Text>
        <Text style={text}>שלום {hostName},</Text>
        <Text style={text}>
          <strong>{guestName}</strong> ביקש/ה להצטרף אליך
          {eventDate ? ` בתאריך ${eventDate}` : ''}.
        </Text>
        {message ? (
          <Section style={messageBox}>
            <Text style={messageText}>"{message}"</Text>
          </Section>
        ) : null}
        <Text style={text}>
          יש לך 5 ימים לענות. ניתן לאשר או לציין שאינך זמין/ה הפעם — בכל מקרה, האורח/ת יקבל/ת מענה מכובד.
        </Text>
        <Hr style={hr} />
        <Section style={buttonSection}>
          <Button style={button} href="https://peleplace.lovable.app/my-bookings">
            לצפייה בבקשה
          </Button>
        </Section>
        <Text style={footer}>פל״א — פשוט לבחור איפה</Text>
      </Container>
    </Body>
  </Html>
)

const main = { backgroundColor: '#f5f3ee', fontFamily: 'Heebo, Arial, sans-serif' }
const container = { backgroundColor: '#ffffff', margin: '40px auto', padding: '32px', borderRadius: '12px', maxWidth: '480px' }
const heading = { fontSize: '22px', fontWeight: '700' as const, color: 'hsl(210, 18%, 20%)', textAlign: 'center' as const, marginBottom: '24px' }
const text = { fontSize: '15px', lineHeight: '1.7', color: 'hsl(210, 8%, 46%)' }
const messageBox = { backgroundColor: '#f5f3ee', padding: '14px 18px', borderRadius: '10px', margin: '16px 0' }
const messageText = { fontSize: '14px', fontStyle: 'italic' as const, color: 'hsl(210, 18%, 20%)', margin: 0 }
const hr = { borderColor: '#e8e4dd', margin: '24px 0' }
const buttonSection = { textAlign: 'center' as const }
const button = { backgroundColor: 'hsl(155, 30%, 45%)', color: '#ffffff', borderRadius: '12px', fontSize: '15px', fontWeight: '600' as const, padding: '12px 28px', textDecoration: 'none' }
const footer = { fontSize: '12px', color: 'hsl(210, 8%, 46%)', textAlign: 'center' as const, marginTop: '24px' }

export const template: TemplateEntry = {
  component: BookingRequestReceived,
  subject: 'בקשת אירוח חדשה הגיעה אליך ✨',
  displayName: 'Booking Request Received (host)',
  previewData: {
    hostName: 'משפחת לוי',
    guestName: 'דנה כהן',
    eventDate: 'שבת פרשת בראשית',
    message: 'אשמח להגיע, תודה רבה!',
  },
}
