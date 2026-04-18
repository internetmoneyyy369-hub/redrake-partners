import { Html, Head, Body, Container, Text, Button, Hr } from '@react-email/components'

interface Props {
  name: string
  dashboardUrl: string
  tier: string
}

export function AffiliateApprovedEmail({ name, dashboardUrl, tier }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0a', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Text style={{ color: '#ff2d2d', fontSize: '24px', fontWeight: 'bold' }}>
            RedRake Partners
          </Text>
          <Hr style={{ borderColor: '#222' }} />
          <Text style={{ color: '#ffffff', fontSize: '18px' }}>
            You&apos;re approved, {name}.
          </Text>
          <Text style={{ color: '#aaaaaa', fontSize: '14px', lineHeight: '1.6' }}>
            Your application has been reviewed and approved. You&apos;re starting on the{' '}
            <strong style={{ color: '#ffffff' }}>{tier}</strong> tier. Log in to create your first
            campaign link.
          </Text>
          <Button
            href={dashboardUrl}
            style={{
              backgroundColor: '#ff2d2d',
              color: '#ffffff',
              padding: '14px 28px',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 'bold',
              textDecoration: 'none',
              display: 'inline-block',
              marginTop: '20px',
            }}
          >
            Open Dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  )
}
