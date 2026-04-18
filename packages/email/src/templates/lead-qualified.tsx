import { Html, Head, Body, Container, Text, Hr } from '@react-email/components'

interface Props {
  name: string
  amount: number
  campaignName: string
}

export function LeadQualifiedEmail({ name, amount, campaignName }: Props) {
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
            You earned ₹{amount.toFixed(2)}, {name}!
          </Text>
          <Text style={{ color: '#aaaaaa', fontSize: '14px', lineHeight: '1.6' }}>
            A lead from your <strong style={{ color: '#ffffff' }}>{campaignName}</strong> campaign
            has been qualified. The commission will be credited to your wallet after the hold period.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}
