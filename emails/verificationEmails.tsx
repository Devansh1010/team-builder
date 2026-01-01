interface VerificationEmailProps {
  username: string
  otp: string
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  const primaryColor = '#4F46E5'; // TeamUp Indigo

  return (
    <div style={{
      fontFamily: '"Inter", "Segoe UI", Tahoma, sans-serif',
      maxWidth: '550px',
      margin: '0 auto',
      padding: '40px 20px',
      color: '#1F2937',
      backgroundColor: '#FFFFFF',
    }}>
      <h2 style={{ color: primaryColor, fontSize: '24px', fontWeight: '800', textAlign: 'center', marginBottom: '30px' }}>
        TEAMUP
      </h2>
      
      <div style={{ padding: '30px', border: '1px solid #E5E7EB', borderRadius: '12px', backgroundColor: '#F9FAFB' }}>
        <p style={{ fontSize: '16px', lineHeight: '1.5' }}>
          Hi <strong>{username}</strong>,
        </p>
        <p style={{ fontSize: '15px', color: '#4B5563' }}>
          Welcome to the group! Use the verification code below to finalize your registration and start collaborating.
        </p>

        <div style={{
          backgroundColor: primaryColor,
          color: '#FFFFFF',
          fontSize: '32px',
          textAlign: 'center',
          padding: '20px',
          margin: '25px 0',
          borderRadius: '8px',
          letterSpacing: '5px',
          fontWeight: 'bold',
        }}>
          {otp}
        </div>

        <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center' }}>
          This code expires in <strong>1 hour</strong>.
        </p>
      </div>

      <p style={{ marginTop: '25px', fontSize: '14px', color: '#9CA3AF', textAlign: 'center' }}>
        &copy; 2025 TeamUp Management. All rights reserved.
      </p>
    </div>
  )
}