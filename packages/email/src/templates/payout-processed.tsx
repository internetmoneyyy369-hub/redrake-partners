import { Html, Head, Body, Container, Text, Hr } from '@react-email/components'

interface Props {
  name: string
  amount: number
  utrNumber: string
}

export function PayoutProcessedEmail({ name, amount, utrNumber }: Props) {
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
            Payout of ₹{amount.toFixed(2)} processed, {name}.
          </Text>
          <Text style={{ color: '#aaaaaa', fontSize: '14px', lineHeight: '1.6' }}>
            Your withdrawal has been processed successfully.
          </Text>
          <Text style={{ color: '#aaaaaa', fontSize: '14px' }}>
            <strong style={{ color: '#ffffff' }}>UTR Number:</strong> {utrNumber}
          </Text>
          <Text style={{ color: '#666', fontSize: '12px', marginTop: '16px' }}>
            Funds typically arrive within 1–2 business hours.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
