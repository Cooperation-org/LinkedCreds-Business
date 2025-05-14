import React from 'react'
import { Box, Typography, Paper, styled, Card, CardContent } from '@mui/material'
import { usePathname } from 'next/navigation'
import { Logo } from '../../Assets/SVGs'

const Header = styled(Paper)({
  width: '100%',
  maxWidth: '720px',
  padding: '30px',
  borderRadius: '20px 20px 0 0',
  border: '1px solid #d1e4ff',
  display: 'flex',
  alignItems: 'center'
})
const Body = styled(Box)({
  width: '100%',
  maxWidth: '720px',
  padding: '45px 30px',
  backgroundColor: '#87abe4',
  borderRadius: '0 0 20px 20px',
  border: '1px solid #d1e4ff',
  margin: '0 auto'
})
const PreviewCard = styled(Card)({
  padding: '15px 30px',
  backgroundColor: '#fff',
  borderRadius: '10px',
  border: '1px solid #003fe0',
  width: '100%'
})
const Label = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 700,
  lineHeight: '24px',
  color: '#000e40'
})
const Value = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  color: '#6b7280'
})
const Media = styled('div')({
  width: '160.506px',
  height: '153.129px',
  backgroundImage: 'url(/images/SkillMedia.svg)',
  backgroundSize: '100% 100%',
  backgroundRepeat: 'no-repeat'
})

const cleanHTML = (str: string) =>
  str
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p><\/p>/g, '')
    .replace(/<br>/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')

const BulletField = ({ label, value }: { label: string; value?: string }) => {
  const items = value?.split(/\n|,|•/).filter(Boolean) || []
  return (
    <Box sx={{ mb: 2.5 }}>
      <Label>{label}</Label>
      <ul style={{ margin: 0, paddingLeft: '18px' }}>
        {items.map((t, i) => (
          <li key={i} style={{ color: '#6b7280', fontFamily: 'Inter', fontSize: '16px' }}>
            {t.trim()}
          </li>
        ))}
      </ul>
    </Box>
  )
}

const TextField = ({
  label,
  value,
  isHtml
}: {
  label: string
  value?: string
  isHtml?: boolean
}) => (
  <Box sx={{ mb: 2.5 }}>
    <Label>{label}</Label>
    {isHtml ? (
      <Value dangerouslySetInnerHTML={{ __html: cleanHTML(value ?? '') }} />
    ) : (
      <Value>{value ?? 'To be completed...'}</Value>
    )}
  </Box>
)

interface TrackerProps {
  formData?: Record<string, any>
}

type F = { label: string; key: string; isHtml?: boolean; bullet?: boolean }

type CFG = { fields: F[] }

const cfg: Record<string, CFG> = {
  skill: {
    fields: [
      { label: 'Skill Name', key: 'credentialName' },
      { label: 'Skill Description', key: 'credentialDescription', isHtml: true },
      { label: 'Earning Criteria', key: 'description', isHtml: true },
      { label: 'Duration', key: 'credentialDuration' },
      { label: 'Supporting Documentation', key: 'supportingDocs' }
    ]
  },
  'performance-review': {
    fields: [
      { label: 'Company you work for', key: 'company' },
      { label: 'Your Role', key: 'role' },
      { label: 'Name of Employee', key: 'employeeName' },
      { label: 'Employee job title', key: 'employeeJobTitle' },
      { label: 'Review Comments', key: 'reviewComments', isHtml: true },
      { label: 'Overall Rating', key: 'overallRating' },
      { label: 'Goals for Next Period', key: 'goalsNext', isHtml: true },
      { label: 'Review Dates', key: 'reviewDates' }
    ]
  },
  role: {
    fields: [
      { label: 'Your Role', key: 'role' },
      { label: 'Company you work for', key: 'company' },
      { label: 'Supporting Documentation', key: 'supportingDocs' }
    ]
  },
  volunteer: {
    fields: [
      { label: 'Volunteer Role', key: 'volunteerWork' },
      { label: 'Volunteer Organization', key: 'volunteerOrg' },
      { label: 'Volunteer Description', key: 'volunteerDescription', isHtml: true },
      { label: 'Skills gained through volunteering', key: 'skillsGained', bullet: true },
      { label: 'Duration', key: 'duration' },
      { label: 'Volunteer Dates', key: 'volunteerDates' }
    ]
  },
  'identity-verification': {
    fields: [
      { label: 'Document Type', key: 'documentType' },
      { label: 'Document Number', key: 'documentNumber' },
      { label: 'Issuing Country', key: 'issuingCountry' },
      { label: 'Expiration Date', key: 'expirationDate' },
      { label: 'Supporting Documentation', key: 'supportingDocs' }
    ]
  }
}

const CredentialTracker: React.FC<TrackerProps> = ({ formData }) => {
  const segment = usePathname()?.split('/').filter(Boolean).pop() ?? 'skill'
  const conf = cfg[segment] || cfg.skill

  return (
    <Box sx={{ p: 0, width: '100%', maxWidth: '720px' }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', margin: '0 auto' }}
      >
        <Header elevation={0}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
            <Logo />
            <Box>
              <Typography
                sx={{
                  fontFamily: 'Lato',
                  fontSize: '32px',
                  fontWeight: 700,
                  color: '#202e5b'
                }}
              >
                Here&apos;s what you&apos;re building
              </Typography>
              <Typography
                sx={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  fontWeight: 400,
                  color: '#202e5b'
                }}
              >
                {formData?.fullName ?? 'User'} - just now
              </Typography>
            </Box>
          </Box>
        </Header>
        <Body>
          <PreviewCard>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {conf.fields.map(f =>
                  f.bullet ? (
                    <BulletField key={f.key} label={f.label} value={formData?.[f.key]} />
                  ) : (
                    <TextField
                      key={f.key}
                      label={f.label}
                      value={formData?.[f.key]}
                      isHtml={f.isHtml}
                    />
                  )
                )}
                <Media />
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#6b7280',
                    mt: 1
                  }}
                >
                  Media (optional)
                </Typography>
              </Box>
            </CardContent>
          </PreviewCard>
        </Body>
      </Box>
    </Box>
  )
}

export default CredentialTracker
