import React, { useEffect, useState } from 'react'
import { Box, Typography, Paper, styled, Card, CardContent } from '@mui/material'
import { usePathname } from 'next/navigation'
import { Logo } from '../../Assets/SVGs'
import Image from 'next/image'

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
const Media = styled(Box)({
  width: '160.506px',
  height: '153.129px',
  position: 'relative',
  borderRadius: '10px',
  overflow: 'hidden',
  margin: '0 auto'
})

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
    <Value>{value || 'To be completed...'}</Value>
  </Box>
)

interface TrackerProps {
  formData?: Record<string, any>
  hideHeader?: boolean
}

type F = { label: string; key: string; isHtml?: boolean; bullet?: boolean }

type CFG = { fields: F[] }

const cfg: Record<string, CFG> = {
  skill: {
    fields: [
      { label: 'Skill Name', key: 'credentialName' },
      { label: 'Skill Description', key: 'credentialDescription', isHtml: true },
      { label: 'Earning Criteria', key: 'description', isHtml: true },
      { label: 'Duration', key: 'credentialDuration' }
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
      { label: 'Company you work for', key: 'company' }
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
      { label: 'Expiration Date', key: 'expirationDate' }
    ]
  }
}

const CredentialTracker: React.FC<TrackerProps> = ({ formData, hideHeader }) => {
  const segment = usePathname()?.split('/').filter(Boolean).pop() ?? 'skill'
  const conf = cfg[segment] || cfg.skill
  const [timeAgo, setTimeAgo] = useState('just now')
  const [lastChange, setLastChange] = useState(Date.now())

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      const diff = now - lastChange

      if (diff >= 10000) {
        // 10 seconds
        if (diff < 60000) {
          // Less than 1 minute
          setTimeAgo(`${Math.floor(diff / 1000)} seconds ago`)
        } else if (diff < 3600000) {
          // Less than 1 hour
          setTimeAgo(`${Math.floor(diff / 60000)} minutes ago`)
        } else if (diff < 86400000) {
          // Less than 1 day
          setTimeAgo(`${Math.floor(diff / 3600000)} hours ago`)
        } else {
          setTimeAgo(`${Math.floor(diff / 86400000)} days ago`)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [lastChange])

  useEffect(() => {
    setLastChange(Date.now())
    setTimeAgo('just now')
  }, [formData])

  const renderSupportingDocs = () => {
    if (!formData?.evidenceLink && !formData?.portfolio?.length) return null

    const evidence = formData.evidenceLink
    const portfolio = formData.portfolio || []
    const hasUrls = evidence || portfolio.length > 0

    if (!hasUrls) return null

    const shouldDisplayUrl = (url: string): boolean => {
      return !url.includes('drive.google.com/uc?export=view')
    }
    const linkText =
      (formData.supportingDocs && formData.supportingDocs.trim()) || evidence // ← shows URL until a title is provided
    const name = portfolio.length > 0 ? portfolio[0].name : ''

    return (
      <Box sx={{ mb: 2.5 }}>
        <Label>Supporting Documentation</Label>
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {evidence && shouldDisplayUrl(evidence) && (
            <li style={{ color: '#6b7280', fontFamily: 'Inter', fontSize: '16px' }}>
              <a
                href={evidence}
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: '#6b7280' }}
              >
                {(formData.supportingDocs && formData.supportingDocs.trim()) || evidence}
              </a>
            </li>
          )}

          {portfolio.map((file: any, i: number) =>
            file.url && shouldDisplayUrl(file.url) ? (
              <li
                key={i}
                style={{ color: '#6b7280', fontFamily: 'Inter', fontSize: '16px' }}
              >
                <a
                  href={file.url}
                  target='_blank'
                  rel='noopener noreferrer'
                  style={{ color: '#6b7280' }}
                >
                  {(file.name && file.name.trim()) || file.url}
                </a>
              </li>
            ) : null
          )}
        </ul>
      </Box>
    )
  }

  const renderMedia = () => {
    // Hide media section for employment (role) form
    if (segment === 'role') return null
    // Only show media if evidenceLink exists
    if (!formData?.evidenceLink) return null
    return (
      <Box>
        <Media>
          <Image
            src={formData.evidenceLink}
            alt='Featured Media'
            width={160}
            height={153}
            style={{
              borderRadius: '10px',
              objectFit: 'cover'
            }}
          />
        </Media>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 500,
            color: '#6b7280',
            mt: 1,
            textAlign: 'center'
          }}
        >
          Media (Optional)
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 0, width: '100%', maxWidth: '720px' }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', margin: '0 auto' }}
      >
        {!hideHeader && (
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
                  {formData?.fullName ?? 'User'} - {timeAgo}
                </Typography>
              </Box>
            </Box>
          </Header>
        )}
        <Body sx={{ backgroundColor: hideHeader ? '#fff' : '#87abe4' }}>
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
                {renderMedia()}
                {renderSupportingDocs()}
              </Box>
            </CardContent>
          </PreviewCard>
        </Body>
      </Box>
    </Box>
  )
}

export default CredentialTracker
