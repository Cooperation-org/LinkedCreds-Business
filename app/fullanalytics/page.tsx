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
  styled,
  Tooltip,
  Chip,
  Button
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'

// Global analytics data interface
interface GlobalAnalyticsData {
  totalUsers: number
  activeUsers: number
  credentialsIssued: {
    skill: number
    employment: number
    performanceReview: number
    volunteer: number
    idVerification: number
  }
  clickRates: {
    requestRecommendation: number
    shareCredential: number
  }
  evidenceAttachmentRates: {
    skillVCs: number
    employmentVCs: number
    volunteerVCs: number
    performanceReviews: number
  }
}

// Styled components (reusing from analytics page)
const StyledCard = styled(Card)(({ theme }) => ({
  boxShadow: '2px 4px 20px 0 rgba(197,208,244,0.35)',
  borderRadius: '10px',
  border: '1px solid #f3f6ff',
  height: '100%'
}))

const StyledMetricCard = styled(StyledCard)({
  minHeight: '100px'
})

const StyledDisabledCard = styled(StyledCard)({
  minHeight: '100px',
  opacity: 0.5,
  cursor: 'not-allowed',
  '&:hover': {
    opacity: 0.5
  }
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
  lineHeight: '30px',
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
        <StyledProgressBar variant='determinate' value={Math.min(value, 100)} />
      </StyledProgressBarContainer>
    </Box>
  )
}

// Main component
export default function FullAnalytics() {
  const { data: session } = useSession()
  const [analyticsData, setAnalyticsData] = useState<GlobalAnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isExporting, setIsExporting] = useState(false)

  useEffect(() => {
    const fetchGlobalAnalytics = async () => {
      if (session?.user?.email) {
        setLoading(true)
        setError(null)
        try {
          const response = await fetch('/api/global-analytics')
          if (response.ok) {
            const data = await response.json()
            setAnalyticsData(data)
          } else {
            const errorData = await response.json()
            setError(errorData.error || 'Failed to fetch global analytics')
          }
        } catch (err) {
          setError('Network error occurred')
          console.error('Error fetching global analytics:', err)
        }
        setLoading(false)
      } else if (session === null) {
        // No active session
        setLoading(false)
        setAnalyticsData(null)
      }
    }

    fetchGlobalAnalytics()
  }, [session])

  const handleExportData = async () => {
    if (!session?.user?.email) return

    setIsExporting(true)
    try {
      const response = await fetch('/api/export-analytics')
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `user-analytics-${new Date().toISOString().split('T')[0]}.xlsx`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error('Failed to export data')
        setError('Failed to export data')
      }
    } catch (err) {
      console.error('Error exporting data:', err)
      setError('Error exporting data')
    }
    setIsExporting(false)
  }

  if (loading) {
    return (
      <Container maxWidth='lg' sx={{ py: 5, textAlign: 'center' }}>
        <Typography>Loading global analytics...</Typography>
        <LinearProgress />
      </Container>
    )
  }

  if (!session) {
    return (
      <Container maxWidth='lg' sx={{ py: 5, textAlign: 'center' }}>
        <Typography>Please log in to view global analytics.</Typography>
      </Container>
    )
  }

  if (error) {
    return (
      <Container maxWidth='lg' sx={{ py: 5, textAlign: 'center' }}>
        <Typography color='error'>Error: {error}</Typography>
      </Container>
    )
  }

  if (!analyticsData) {
    return (
      <Container maxWidth='lg' sx={{ py: 5, textAlign: 'center' }}>
        <Typography>No global analytics data available.</Typography>
      </Container>
    )
  }

  // Calculate total credentials
  const totalCredentials = Object.values(analyticsData.credentialsIssued).reduce(
    (sum, val) => sum + val,
    0
  )
  const totalClicks = Object.values(analyticsData.clickRates).reduce(
    (sum, val) => sum + val,
    0
  )
  const totalEvidenceAttachments = Object.values(
    analyticsData.evidenceAttachmentRates
  ).reduce((sum, val) => sum + val, 0)

  return (
    <Container maxWidth='lg' sx={{ py: 5 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 6
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: '32px', lineHeight: '30px' }}>
            Global App Analytics
          </Typography>
          <Chip
            label='All Users'
            color='primary'
            variant='outlined'
            sx={{ fontSize: '14px', fontWeight: 500 }}
          />
        </Box>
        <Button
          variant='contained'
          startIcon={<DownloadIcon />}
          onClick={handleExportData}
          disabled={isExporting}
          sx={{
            backgroundColor: '#003FE0',
            '&:hover': {
              backgroundColor: '#0035c7'
            },
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            px: 3,
            py: 1
          }}
        >
          {isExporting ? 'Exporting...' : 'Export to Excel'}
        </Button>
      </Box>

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
          {/* User Statistics Section */}
          <Box>
            <StyledSectionTitle>User Statistics</StyledSectionTitle>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Total Users</StyledMetricTitle>
                    <StyledMetricValue>{analyticsData.totalUsers}</StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Active Users (30 days)</StyledMetricTitle>
                    <StyledMetricValue>{analyticsData.activeUsers}</StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Total Credentials</StyledMetricTitle>
                    <StyledMetricValue>{totalCredentials}</StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StyledMetricCard>
                  <StyledCardContent>
                    <StyledMetricTitle>Total Interactions</StyledMetricTitle>
                    <StyledMetricValue>{totalClicks}</StyledMetricValue>
                  </StyledCardContent>
                </StyledMetricCard>
              </Grid>
            </Grid>
          </Box>

          {/* Global Credentials Issued Section */}
          <Box>
            <StyledSectionTitle>Global Credentials Issued</StyledSectionTitle>
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
                <Tooltip title='Under Development </>' arrow>
                  <Box>
                    <StyledDisabledCard>
                      <StyledCardContent>
                        <StyledMetricTitle>ID Verification</StyledMetricTitle>
                        <StyledMetricValue>
                          {analyticsData.credentialsIssued.idVerification}
                        </StyledMetricValue>
                      </StyledCardContent>
                    </StyledDisabledCard>
                  </Box>
                </Tooltip>
              </Grid>
            </Grid>
          </Box>

          {/* Global Click Rates Section */}
          <Box>
            <StyledSectionTitle>Global Click Rates</StyledSectionTitle>
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

          {/* Global Evidence Attachment Rates Section */}
          <Box>
            <StyledSectionTitle>Global Evidence Attachment Rates</StyledSectionTitle>
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
                  Total evidence attachments across all users
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
