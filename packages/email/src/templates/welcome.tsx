import { Html, Head, Body, Container, Text, Hr } from '@react-email/components'

interface Props {
  name: string
}

export function WelcomeEmail({ name }: Props) {
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
            Application received, {name}.
          </Text>
          <Text style={{ color: '#aaaaaa', fontSize: '14px', lineHeight: '1.6' }}>
            We&apos;ve received your application and our team will review it within 2–3 business
            days. You&apos;ll get an email once a decision is made.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
