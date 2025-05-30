'use client'
import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Container,
  LinearProgress,
  Card,
  CardContent,
  styled
} from '@mui/material'
import {
  getUserAnalytics
  // updateClickRates, // We might need this if we add interactive elements to update rates
  // UserAnalyticsData, // Already defined below, but good for direct import if needed
} from '../firebase/firestore' // Adjusted path

// Define UserAnalyticsData interface locally if not importing, or ensure it matches Firestore one
interface CredentialsIssued {
  skill: number
  employment: number
  performanceReview: number
  volunteer: number
  idVerification: number
}

interface ClickRates {
  requestRecommendation: number
  shareCredential: number
}

interface EvidenceAttachmentRates {
  skillVCs: number
  employmentVCs: number
  volunteerVCs: number
  performanceReviews: number
}

interface UserAnalyticsData {
  email: string
  credentialsIssued: CredentialsIssued
  clickRates: ClickRates
  evidenceAttachmentRates: EvidenceAttachmentRates
  lastActivity: string
}

// Styled components
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '2px 4px 20px 0 rgba(197,208,244,0.35)',
  borderRadius: '10px',
  border: '1px solid #f3f6ff',
  height: '100%'
}))

const StyledMetricCard = styled(StyledCard)({
  minHeight: '100px'
})

const StyledCardContent = styled(CardContent)({
  padding: '16px 12px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%'
})

const StyledMetricValue = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '24px',
  fontWeight: 700,
  lineHeight: '16.625px',
  marginTop: 'auto'
})

const StyledMetricTitle = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '12px',
  fontWeight: 500,
  color: '#4f4f4f'
})

const StyledSectionTitle = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '32px',
  fontWeight: 600,
  lineHeight: '24px',
  marginBottom: '15px'
})

const StyledChartContainer = styled(Box)({
  width: '126.813px',
  height: '30.848px',
  marginTop: 'auto'
})

const StyledProgressBarContainer = styled(Box)({
  position: 'relative',
  width: '320px',
  height: '17px'
})

const StyledProgressLabel = styled(Typography)({
  position: 'absolute',
  right: '-40px',
  bottom: '5px',
  fontFamily: 'Inter',
  fontSize: '12px',
  fontWeight: 500,
  lineHeight: '16.625px'
})

const StyledProgressBar = styled(LinearProgress)(({ theme }) => ({
  height: 8,
  borderRadius: 8,
  backgroundColor: 'rgba(20,184,166,0.5)',
  '& .MuiLinearProgress-bar': {
    backgroundColor: '#14b8a6',
    borderRadius: 8
  }
}))

// Custom LinearProgress component with label
interface LabeledProgressProps {
  value: number
  label: string
}

const LabeledProgress: React.FC<LabeledProgressProps> = ({ value, label }) => {
  return (
    <Box sx={{ width: '100%', mb: 2 }}>
      <Typography
        variant='body1'
        sx={{
          fontFamily: 'Inter',
          fontSize: '16px',
          fontWeight: 500,
          lineHeight: '16.625px',
          mb: 0.5
        }}
      >
        {label}
      </Typography>
      <StyledProgressBarContainer>
        <StyledProgressLabel>{value}</StyledProgressLabel>
        <StyledProgressBar variant='determinate' value={value} />
      </StyledProgressBarContainer>
    </Box>
  )
}

// Main component
export default function Main() {
  const { data: session } = useSession()
  const [analyticsData, setAnalyticsData] = useState<UserAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      if (session?.user?.email) {
        setLoading(true)
        // Fetch from Firestore first - this contains the correct analytics
        const firestoreData = await getUserAnalytics(session.user.email)
        setAnalyticsData(firestoreData)
        setLoading(false)
      } else if (session === null) {
        // No active session
        setLoading(false)
        setAnalyticsData(null)
      }
    }

    fetchData()
  }, [session])

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ py: 5, textAlign: 'center' }}>
        <Typography>Loading analytics...</Typography>
        <LinearProgress />
      </Container>
    )
  }

  if (!session || !analyticsData) {
    return (
      <Container maxWidth='lg' sx={{ py: 5, textAlign: 'center' }}>
        <Typography>Please log in to view analytics.</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth='lg' sx={{ py: 5 }}>
      <Typography sx={{ fontWeight: 600, fontSize: '32px', lineHeight: '24px', mb: 6 }}>
        Analytics for {session.user?.name || session.user?.email}
      </Typography>
      <Paper
        sx={{
          p: 4,
          borderRadius: '20px',
          border: '1px solid #d1e4ff',
          width: '100%',
          maxWidth: '1240px',
          margin: '0 auto'
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
          {/* Credentials Issued Section - Data from Google Drive (placeholder) */}
          <Box>
            <StyledSectionTitle>Credentials Issued</StyledSectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Skill</StyledMetricTitle>
                    <StyledMetricValue>
                      {analyticsData.credentialsIssued.skill}
                    </StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Employment</StyledMetricTitle>
                    <StyledMetricValue>
                      {analyticsData.credentialsIssued.employment}
                    </StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Performance Review</StyledMetricTitle>
                    <StyledMetricValue>
                      {analyticsData.credentialsIssued.performanceReview}
                    </StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Volunteer</StyledMetricTitle>
                    <StyledMetricValue>
                      {analyticsData.credentialsIssued.volunteer}
                    </StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>ID Verification</StyledMetricTitle>
                    <StyledMetricValue>
                      {analyticsData.credentialsIssued.idVerification}
                    </StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
            </Grid>
          </Box>

          {/* Click Rates Section - Data from Firestore */}
          <Box>
            <StyledSectionTitle>Click Rates</StyledSectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StyledCard>
                  <StyledCardContent sx={{ gap: '16px' }}>
                    <StyledMetricTitle
                      sx={{ height: '32px', display: 'flex', alignItems: 'center' }}
                    >
                      Request Recommendation
                    </StyledMetricTitle>
                    <StyledMetricValue>
                      {analyticsData.clickRates.requestRecommendation}
                    </StyledMetricValue>
                    <StyledChartContainer
                      sx={{
                        backgroundImage:
                          'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-09/xGjGNzEWD4.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </StyledCardContent>
                </StyledCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledCard>
                  <StyledCardContent sx={{ gap: '16px' }}>
                    <StyledMetricTitle
                      sx={{ height: '32px', display: 'flex', alignItems: 'center' }}
                    >
                      Share Credential
                    </StyledMetricTitle>
                    <StyledMetricValue>
                      {analyticsData.clickRates.shareCredential}
                    </StyledMetricValue>
                    <StyledChartContainer
                      sx={{
                        backgroundImage:
                          'url(https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-04-09/JXFgo9MP2P.png)',
                        backgroundSize: '100% 100%',
                        backgroundRepeat: 'no-repeat'
                      }}
                    />
                  </StyledCardContent>
                </StyledCard>
              </Grid>
            </Grid>
          </Box>

          {/* Evidence Attachment Rates Section - Data from Google Drive (placeholder) */}
          <Box>
            <StyledSectionTitle>Evidence Attachment Rates</StyledSectionTitle>
            <StyledCard sx={{ maxWidth: '396px' }}>
              <Box sx={{ p: 1, pl: 2 }}>
                <Typography
                  sx={{
                    fontFamily: 'Inter',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#828282',
                    py: 0.5
                  }}
                >
                  Rate of VCs with evidence attached
                </Typography>
              </Box>
              <CardContent>
                <LabeledProgress
                  value={analyticsData.evidenceAttachmentRates.skillVCs}
                  label='Skill VCs'
                />
                <LabeledProgress
                  value={analyticsData.evidenceAttachmentRates.employmentVCs}
                  label='Employment VCs'
                />
                <LabeledProgress
                  value={analyticsData.evidenceAttachmentRates.volunteerVCs}
                  label='Volunteer VCs'
                />
                <LabeledProgress
                  value={analyticsData.evidenceAttachmentRates.performanceReviews}
                  label='Performance Reviews'
                />
              </CardContent>
            </StyledCard>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
