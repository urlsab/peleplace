/** @jsxImportSource npm:react@18.3.1 */
import React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'

interface Props {
  fullName: string
}

const RegistrationReceived: React.FC<Props> = ({ fullName }) => (
  <div style={{ fontFamily: 'Heebo, Arial, sans-serif', direction: 'rtl', maxWidth: 600, margin: '0 auto', padding: 24 }}>
    <div style={{ textAlign: 'center', marginBottom: 32 }}>
      <h1 style={{ fontSize: 28, fontWeight: 900, color: '#2d3b2d' }}>
        פל<span style={{ color: '#e8751a' }}>״</span>א
      </h1>
    </div>
    <div style={{ background: '#faf8f5', borderRadius: 16, padding: 32, border: '1px solid #e8e4dd' }}>
      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}>שלום {fullName}! 👋</h2>
      <p style={{ fontSize: 16, lineHeight: 1.7, color: '#333' }}>
        ההרשמה שלך לפל״א התקבלה בהצלחה!
      </p>
      <p style={{ fontSize: 15, lineHeight: 1.7, color: '#555', marginTop: 12 }}>
        הצוות שלנו בודק כעת את הפרטים כדי לשמור על מרחב בטוח ומכבד לכולם.
        ברגע שההרשמה תאושר — תקבל/י מייל נוסף ותוכל/י להתחיל לחפש שבתות וחגים.
      </p>
      <div style={{ background: '#fff', borderRadius: 12, padding: 16, marginTop: 20, border: '1px solid #e8e4dd' }}>
        <p style={{ fontSize: 14, color: '#666', margin: 0 }}>
          ⏳ זמן אישור ממוצע: <strong>עד 24 שעות</strong>
        </p>
      </div>
      <p style={{ fontSize: 14, color: '#888', marginTop: 20 }}>
        בינתיים את/ה מוזמן/ת לגלוש באתר ולהכיר את ההזדמנויות הזמינות.
      </p>
    </div>
    <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 24 }}>
      © 2026 פל״א — פשוט לבחור איפה
    </p>
  </div>
)

export const template: TemplateEntry = {
  component: RegistrationReceived,
  subject: 'ההרשמה שלך לפל״א התקבלה! ✅',
  displayName: 'Registration Received',
  previewData: { fullName: 'ישראל ישראלי' },
}

export default RegistrationReceived
