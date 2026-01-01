interface ForgotPasswordEmailProps {
  username: string
  resetLink: string
}

export default function ForgotPasswordEmail({ username, resetLink }: ForgotPasswordEmailProps) {
  const primaryColor = '#4F46E5';

  return (
    <div style={{
      fontFamily: '"Inter", sans-serif',
      maxWidth: '550px',
      margin: '0 auto',
      padding: '40px 20px',
      color: '#1F2937',
    }}>
      <h2 style={{ color: primaryColor, textAlign: 'center', fontWeight: '800' }}>TEAMUP</h2>
      
      <div style={{ padding: '30px', border: '1px solid #E5E7EB', borderRadius: '12px' }}>
        <h3 style={{ marginTop: 0 }}>Reset your password?</h3>
        <p>Hello {username},</p>
        <p>We received a request to reset the password for your TeamUp account. Click the button below to choose a new one:</p>
        
        <div style={{ textAlign: 'center', margin: '30px 0' }}>
          <a href={resetLink} style={{
            backgroundColor: primaryColor,
            color: 'white',
            padding: '14px 28px',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: '600',
            display: 'inline-block',
          }}>
            Reset Password
          </a>
        </div>

        <p style={{ fontSize: '12px', color: '#6B7280' }}>
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <span style={{ color: primaryColor }}>{resetLink}</span>
        </p>
        
        <hr style={{ border: 'none', borderTop: '1px solid #F3F4F6', margin: '20px 0' }} />
        <p style={{ fontSize: '12px', color: '#9CA3AF' }}>
          If you didn't request this, you can safely ignore this email. Your password will not change.
        </p>
      </div>
    </div>
  )
}