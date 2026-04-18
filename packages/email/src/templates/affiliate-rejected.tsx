import { Html, Head, Body, Container, Text, Hr } from '@react-email/components'

interface Props {
  name: string
  reason: string
}

export function AffiliateRejectedEmail({ name, reason }: Props) {
  return (
    <Html>
      <Head />
      <Body style={{ backgroundColor: '#0a0a0a', fontFamily: 'Arial, sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 20px' }}>
          <Text style={{ color: '#ff2d2d', fontSize: '24px', fontWeight: 'bold' }}>
            RedRake Partners
          </Text>
          <Hr style={{ borderColor: '#222' }} />
          <Text style={{ color: '#ffffff', fontSize: '18px' }}>Hi {name},</Text>
          <Text style={{ color: '#aaaaaa', fontSize: '14px', lineHeight: '1.6' }}>
            After reviewing your application, we&apos;re unable to approve it at this time.
          </Text>
          <Text style={{ color: '#aaaaaa', fontSize: '14px', lineHeight: '1.6' }}>
            <strong style={{ color: '#ffffff' }}>Reason:</strong> {reason}
          </Text>
          <Text style={{ color: '#666', fontSize: '12px', marginTop: '24px' }}>
            You may reapply after 30 days with updated information.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
