import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  styled,
  Card,
  CardContent,
  Divider,
  useStepContext
} from '@mui/material'
import { usePathname } from 'next/navigation'
import { Logo, SVGBadgeCheck } from '../../Assets/SVGs'
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

const BulletList = styled('ul')({
  margin: 0,
  paddingLeft: 18
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
  isHtml,
  isRating
}: {
  label: string
  value?: string
  isHtml?: boolean
  isRating?: boolean
}) => {
  let displayValue = value || 'To be completed...'
  if (isRating && value && value !== 'To be completed...') {
    displayValue = `${value}/5`
  }
  return (
    <Box sx={{ mb: 2.5 }}>
      <Label>{label}</Label>
      {isHtml && value ? (
        <Value dangerouslySetInnerHTML={{ __html: value }} />
      ) : (
        <Value>{displayValue}</Value>
      )}
    </Box>
  )
}

interface TrackerProps {
  formData?: Record<string, any>
  hideHeader?: boolean
  activeStep?: number
}

type F = {
  label: string
  key: string
  isHtml?: boolean
  bullet?: boolean
  isRating?: boolean
  conditionKey?: string
  conditionValue?: any
  displayType?:
    | 'mainTitle'
    | 'subtitle'
    | 'media'
    | 'ratingCollection'
    | 'keyValuePairs'
    | 'default'
  relatedKeys?: string[]
  valueLabel?: string
}

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
      { label: 'Employee Name', key: 'employeeName' },
      { label: 'Employee Job Title', key: 'employeeJobTitle' },
      { label: 'Company You Work For', key: 'company' },
      { label: 'Your Role (Reviewer)', key: 'role' },
      { label: 'Review Start Date', key: 'reviewStartDate' },
      { label: 'Review End Date', key: 'reviewEndDate' },
      { label: 'Review Duration', key: 'reviewDuration' },
      { label: 'Job Knowledge rating', key: 'jobKnowledgeRating', isRating: true },
      { label: 'Teamwork rating', key: 'teamworkRating', isRating: true },
      { label: 'Initiative rating', key: 'initiativeRating', isRating: true },
      { label: 'Communication rating', key: 'communicationRating', isRating: true },
      { label: 'Overall Rating', key: 'overallRating', isRating: true },
      { label: 'Review Comments', key: 'reviewComments', isHtml: true },
      { label: 'Goals for Next Period', key: 'goalsNext', bullet: true }
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

const CredentialTracker: React.FC<TrackerProps> = ({
  formData,
  hideHeader,
  activeStep
}) => {
  const segment = usePathname()?.split('/').filter(Boolean).pop() ?? 'skill'
  console.log(': activeStep', activeStep)
  const conf = cfg[segment] || cfg.skill
  const [timeAgo, setTimeAgo] = useState('just now')
  const [lastChange, setLastChange] = useState(Date.now())
  const mainTitle =
    formData?.credentialName ||
    (segment === 'performance-review' ? 'Performance Review' : 'Credential Preview')
  const employeeName = formData?.employeeName

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

  const renderReviewDates = () => {
    if (segment !== 'performance-review') return null

    let dateDisplay = 'To be completed...'
    if (formData?.reviewDuration) dateDisplay = formData.reviewDuration
    else if (formData?.reviewStartDate && formData?.reviewEndDate)
      dateDisplay = `${formData.reviewStartDate} – ${formData.reviewEndDate}`
    else if (formData?.reviewStartDate) dateDisplay = formData.reviewStartDate
    else if (formData?.reviewEndDate) dateDisplay = formData.reviewEndDate

    return (
      <Box mb={3}>
        <Label>Review Dates</Label>
        <BulletList sx={{ mt: 0.5 }}>
          <li
            style={{
              color: '#6b7280',
              fontFamily: 'Inter',
              fontSize: 16,
              lineHeight: '24px'
            }}
          >
            {dateDisplay}
          </li>
        </BulletList>
      </Box>
    )
  }

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
    if (segment === 'role') return null

    if (formData?.evidenceLink) {
      return (
        <Box sx={{ textAlign: 'center', mb: 2.5 }}>
          <Media sx={{ display: 'inline-block' }}>
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
        </Box>
      )
    } else {
      return (
        <Box sx={{ textAlign: 'center', mb: 2.5 }}>
          <Media sx={{ display: 'inline-block' }}>
            <Image
              src='/images/SkillMedia.svg'
              alt='Media placeholder'
              width={160}
              height={153}
              style={{
                borderRadius: '10px',
                objectFit: 'contain'
              }}
            />
          </Media>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 400,
              color: '#6b7280',
              mt: 1,
              textAlign: 'center'
            }}
          >
            Media (optional)
          </Typography>
        </Box>
      )
    }
  }

  const renderPerformanceReview = () => {
    if (segment !== 'performance-review') return null

    const year =
      formData?.reviewYear ||
      formData?.credentialName?.match(/\d{4}/)?.[0] ||
      new Date().getFullYear()
    const reviewTitle = formData?.credentialName || `${year} Performance Review`

    const overallRatingValue = formData?.overallRating
    const overallRatingDisplay = overallRatingValue ? `${overallRatingValue}/5` : null // Null if no value

    return (
      <>
        <Box display='flex' alignItems='center' gap={0.75} mb={1.5}>
          <Box
            sx={{
              width: 22,
              height: 22,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <SVGBadgeCheck />
          </Box>
          <Typography
            component='h2'
            sx={{ fontFamily: 'Inter', fontSize: 20, fontWeight: 700, color: '#000e40' }}
          >
            {reviewTitle}
          </Typography>
        </Box>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: 16,
            fontWeight: 400,
            color: '#000e40',
            mb: 2.5,
            lineHeight: '24px'
          }}
        >
          {formData?.employeeName || 'Employee Name'}
        </Typography>

        <TextField label='Review Comments' value={formData?.reviewComments} isHtml />

        {/* Overall Rating - Render only if value exists */}
        {overallRatingDisplay && (
          <Box mb={0.5}>
            <Typography
              component='span'
              sx={{
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: 700,
                color: '#000e40'
              }}
            >
              Overall Rating:
            </Typography>
            <Typography
              component='span'
              sx={{
                fontFamily: 'Inter',
                fontSize: 16,
                fontWeight: 700,
                color: '#000e40',
                ml: 0.5
              }}
            >
              {overallRatingDisplay}
            </Typography>
          </Box>
        )}

        <Box
          mb={2.5}
          component='ul'
          sx={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            rowGap: '2px',
            mt: overallRatingDisplay ? 0.5 : 0
          }}
        >
          {[
            { label: 'Job Knowledge rating', key: 'jobKnowledgeRating' },
            { label: 'Teamwork rating', key: 'teamworkRating' },
            { label: 'Initiative rating', key: 'initiativeRating' },
            { label: 'Communication rating', key: 'communicationRating' }
          ].map(({ label, key }) => {
            const val = formData?.[key]
            if (!val) return null
            const displayVal = `${val}/5`
            return (
              <li key={key}>
                <Typography
                  component='span'
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#6b7280'
                  }}
                >
                  {label}:
                </Typography>
                <Typography
                  component='span'
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: 16,
                    fontWeight: 400,
                    color: '#6b7280',
                    ml: 0.5
                  }}
                >
                  {displayVal}
                </Typography>
              </li>
            )
          })}
        </Box>

        {renderMedia()}
        <BulletField label='Goals for Next Period' value={formData?.goalsNext} />
        {renderReviewDates()}
        {renderSupportingDocs()}
      </>
    )
  }

  const renderGeneric = () => {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
        {conf.fields.map(f => {
          if (f.key === 'evidenceLink' || f.key === 'portfolio') return null

          return f.bullet ? (
            <BulletField key={f.key} label={f.label} value={formData?.[f.key]} />
          ) : (
            <TextField
              key={f.key}
              label={f.label}
              value={formData?.[f.key]}
              isHtml={f.isHtml}
              isRating={f.isRating}
            />
          )
        })}
        {renderMedia()}
        {renderSupportingDocs()}
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: 0,
        width: '100%',
        maxWidth: '720px',
        display: {
          xs: activeStep === 4 || segment === 'performance-review' ? 'block' : 'none',
          md: 'block'
        }
      }}
    >
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
              {segment === 'performance-review'
                ? renderPerformanceReview()
                : renderGeneric()}
            </CardContent>
          </PreviewCard>
        </Body>
      </Box>
    </Box>
  )
}

export default CredentialTracker
