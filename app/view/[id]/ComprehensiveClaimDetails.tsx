/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useEffect, useState } from 'react'
import {
  Box,
  CircularProgress,
  Typography,
  useMediaQuery,
  Button,
  Collapse,
  Container,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Link as MuiLink,
  Chip,
  Grid
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Link from 'next/link'
import { usePathname, useParams } from 'next/navigation'
import { SVGDate, SVGBadge, CheckMarkSVG, LineSVG } from '../../Assets/SVGs'
import { useSession } from 'next-auth/react'
import useGoogleDrive from '../../hooks/useGoogleDrive'
import { ExpandLess, ExpandMore } from '@mui/icons-material'
import { GoogleDriveStorage } from '@cooperation/vc-storage'
import EvidencePreview from './EvidencePreview'
import { getAccessToken, getFileViaFirebase } from '../../firebase/storage'
import QRCode from 'qrcode'

// Define types for different VC structures
interface Portfolio {
  name: string
  url: string
}

interface Achievement {
  name: string
  description: string
  criteria?: { narrative: string }
  image?: { id: string }
}

// Extended CredentialSubject to handle all VC types
interface CredentialSubject {
  type?: string[]
  name?: string
  fullName?: string
  persons?: string

  // Achievement-based (legacy skill credentials)
  achievement?: Achievement[]
  duration?: string

  // Employment credentials
  credentialName?: string
  credentialDuration?: string
  credentialDescription?: string
  company?: string
  role?: string

  // Volunteering credentials
  volunteerWork?: string
  volunteerOrg?: string
  volunteerDescription?: string
  skillsGained?: string[]
  volunteerDates?: string

  // Performance review credentials
  employeeName?: string
  employeeJobTitle?: string
  reviewStartDate?: string
  reviewEndDate?: string
  reviewDuration?: string
  jobKnowledgeRating?: string
  teamworkRating?: string
  initiativeRating?: string
  communicationRating?: string
  overallRating?: string
  reviewComments?: string
  goalsNext?: string

  // Common fields
  portfolio?: Portfolio[]
  createdTime?: string
  evidenceLink?: string
  evidenceDescription?: string

  // Recommendation fields
  howKnow?: string
  recommendationText?: string
  qualifications?: string
  explainAnswer?: string
}

interface ClaimDetail {
  '@context': string[]
  id: string
  type: string[]
  issuanceDate: string
  expirationDate: string
  credentialSubject: CredentialSubject
}

interface ComprehensiveClaimDetailsProps {
  onAchievementLoad?: (achievementName: string) => void
  fileID?: string
}

// Helper function to check if text is placeholder
const isPlaceholderText = (text: string): boolean => {
  if (!text || typeof text !== 'string') return true
  const lowerText = text.toLowerCase().trim()
  return (
    lowerText.includes('(required)') ||
    lowerText.includes('required:') ||
    lowerText === '' ||
    lowerText === 'unnamed achievement' ||
    lowerText === 'unknown' ||
    lowerText.includes('please enter') ||
    lowerText.includes('enter your')
  )
}

// Helper function to extract actual content from mixed placeholder/content strings
const extractActualContent = (text: string): string => {
  if (!text || typeof text !== 'string') return ''

  // Remove common placeholder patterns and extract the actual content
  let cleaned = text
    .replace(/.*\(required\)\s*/gi, '') // Remove "Something (required) " pattern
    .replace(/.*required:\s*/gi, '') // Remove "Something required: " pattern
    .replace(/^[^:]*:\s*/g, '') // Remove "Label: " pattern
    .trim()

  // Check if we have meaningful content after cleaning (avoid recursive call)
  if (cleaned && cleaned.length > 0) {
    const lowerCleaned = cleaned.toLowerCase()
    const isStillPlaceholder =
      lowerCleaned.includes('(required)') ||
      lowerCleaned.includes('required:') ||
      lowerCleaned === '' ||
      lowerCleaned === 'unnamed achievement' ||
      lowerCleaned === 'unknown' ||
      lowerCleaned.includes('please enter') ||
      lowerCleaned.includes('enter your')

    if (!isStillPlaceholder) {
      return cleaned
    }
  }

  return ''
}

// Helper function to clean up field values
const cleanFieldValue = (value: string | undefined): string => {
  if (!value || typeof value !== 'string') return ''
  const cleaned = value
    .replace(/\s*\(required\):?\s*/gi, '')
    .replace(/:\s*$/g, '')
    .trim()
  return isPlaceholderText(cleaned) ? '' : cleaned
}

// Helper function to determine VC type
const getVCType = (
  credential: ClaimDetail
): 'employment' | 'volunteering' | 'performance-review' | 'skill' | 'recommendation' => {
  const types = credential.type || []

  if (types.includes('EmploymentCredential')) return 'employment'
  if (types.includes('VolunteeringCredential')) return 'volunteering'
  if (types.includes('PerformanceReviewCredential')) return 'performance-review'
  if (
    credential.credentialSubject?.howKnow ||
    credential.credentialSubject?.recommendationText
  )
    return 'recommendation'

  return 'skill' // Default to skill/achievement for legacy credentials
}

// Helper function to get credential title based on type
const getCredentialTitle = (credential: ClaimDetail, vcType: string): string => {
  const subject = credential.credentialSubject

  switch (vcType) {
    case 'employment':
      const empTitle =
        cleanFieldValue(subject?.credentialName) || cleanFieldValue(subject?.role)
      return empTitle || 'Employment Credential'
    case 'volunteering':
      const volTitle = cleanFieldValue(subject?.volunteerWork)
      return volTitle || 'Volunteering Credential'
    case 'performance-review':
      const prTitle = cleanFieldValue(subject?.employeeJobTitle)
      return prTitle ? `Performance Review: ${prTitle}` : 'Performance Review'
    case 'recommendation':
      return 'Recommendation'
    case 'skill':
    default:
      const skillTitle =
        cleanFieldValue(subject?.achievement?.[0]?.name) ||
        cleanFieldValue(subject?.credentialName)
      return skillTitle || 'Skill Credential'
  }
}

// Helper function to get person name
const getPersonName = (subject: CredentialSubject): string => {
  const name =
    cleanFieldValue(subject?.fullName) ||
    cleanFieldValue(subject?.name) ||
    cleanFieldValue(subject?.persons) ||
    cleanFieldValue(subject?.employeeName)
  return name || 'Unknown Person'
}

const cleanHTML = (htmlContent: any): string => {
  if (typeof htmlContent !== 'string') {
    return ''
  }
  return htmlContent
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p><\/p>/g, '')
    .replace(/<br>/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
}

const ComprehensiveClaimDetails: React.FC<ComprehensiveClaimDetailsProps> = ({
  onAchievementLoad,
  fileID: propFileID
}) => {
  const params = useParams()
  const fileID = propFileID || (params?.id as string)

  const [claimDetail, setClaimDetail] = useState<ClaimDetail | null>(null)
  const [comments, setComments] = useState<ClaimDetail[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('')
  const [qrCodeDataUrlMobile, setQrCodeDataUrlMobile] = useState<string>('')
  const theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm'))
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const pathname = usePathname()
  const { data: session, status } = useSession()
  const accessToken = session?.accessToken
  const isAskForRecommendation = pathname?.includes('/askforrecommendation')
  const isView = pathname?.includes('/view')
  const isRecommendationsPage = pathname?.includes('/recommendations')
  const {} = useGoogleDrive()
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (fileID) {
      const sourceUrl = `${window.location.origin}/api/credential-raw/${fileID}`
      QRCode.toDataURL(sourceUrl, {
        width: 120,
        margin: 1,
        color: {
          dark: '#2563eb',
          light: '#F0F4F8'
        }
      })
        .then((url: string) => {
          setQrCodeDataUrl(url)
        })
        .catch((err: any) => {
          console.error('Error generating QR code:', err)
        })
      QRCode.toDataURL(sourceUrl, {
        width: 80,
        margin: 1,
        color: {
          dark: '#2563eb',
          light: '#F0F4F8'
        }
      })
        .then((url: string) => {
          setQrCodeDataUrlMobile(url)
        })
        .catch((err: any) => {
          console.error('Error generating mobile QR code:', err)
        })
    }
  }, [fileID])

  useEffect(() => {
    if (!fileID) {
      setErrorMessage('Invalid claim ID.')
      setLoading(false)
      return
    }
    if (status === 'loading') {
      return
    }
    if (status === 'unauthenticated') {
      setLoading(false)
      return
    }
    if (!accessToken) {
      setErrorMessage('You need to log in to view this content.')
      setLoading(false)
      return
    }
    const fetchDriveData = async () => {
      try {
        const accessToken1 = await getAccessToken(fileID)
        const uncachedStorage = new GoogleDriveStorage(accessToken1)
        let vcData = await getFileViaFirebase(fileID)
        vcData = JSON.parse(vcData.body)

        if (vcData) {
          setClaimDetail(vcData as unknown as ClaimDetail)
        }

        const shouldFetchRecommendations = isView || !!propFileID
        if (shouldFetchRecommendations) {
          const vcFolderId = await uncachedStorage.getFileParents(fileID)
          const files = await uncachedStorage.findFilesUnderFolder(vcFolderId)
          const relationsFile = files.find((f: any) => f.name === 'RELATIONS')

          if (relationsFile) {
            const relationsContent = await uncachedStorage.retrieve(relationsFile.id)
            const relationsData = relationsContent?.data.body
              ? JSON.parse(relationsContent?.data.body)
              : relationsContent?.data

            const recommendationIds = relationsData.recommendations || []
            const recommendations = await Promise.all(
              recommendationIds.map(async (rec: string) => {
                const recFile = await getFileViaFirebase(rec)
                return JSON.parse(recFile.body)
              })
            )
            if (recommendations) {
              setComments(recommendations as any)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching claim details:', error)
        setErrorMessage('Failed to fetch claim details.')
      } finally {
        setLoading(false)
      }
    }

    fetchDriveData()
  }, [accessToken, fileID, status, isView, propFileID])

  const handleToggleComment = (commentId: string) => {
    setExpandedComments(prevState => ({
      ...prevState,
      [commentId]: !prevState[commentId]
    }))
  }

  if (status === 'loading' || loading) {
    return (
      <Box
        sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 4 }}
      >
        <CircularProgress />
      </Box>
    )
  }

  if (errorMessage) {
    return (
      <Typography variant='h6' color='error' align='center' sx={{ mt: 4 }}>
        {errorMessage}
      </Typography>
    )
  }

  if (!claimDetail) {
    return (
      <Typography variant='h6' align='center' sx={{ mt: 4 }}>
        No claim details available.
      </Typography>
    )
  }

  const credentialSubject = claimDetail.credentialSubject
  const vcType = getVCType(claimDetail)
  const credentialTitle = getCredentialTitle(claimDetail, vcType)
  const personName = getPersonName(credentialSubject)
  const hasValidEvidence =
    credentialSubject?.portfolio && credentialSubject?.portfolio.length > 0

  // Render different content based on VC type
  const renderCredentialContent = () => {
    switch (vcType) {
      case 'employment':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
              Employment Details
            </Typography>
            <Grid container spacing={2}>
              {cleanFieldValue(credentialSubject.company) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Company:
                  </Typography>
                  <Typography>{cleanFieldValue(credentialSubject.company)}</Typography>
                </Grid>
              )}
              {cleanFieldValue(credentialSubject.role) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Role:
                  </Typography>
                  <Typography>{cleanFieldValue(credentialSubject.role)}</Typography>
                </Grid>
              )}
              {cleanFieldValue(credentialSubject.credentialDuration) && (
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.secondary'>
                    Duration:
                  </Typography>
                  <Typography>
                    {cleanFieldValue(credentialSubject.credentialDuration)}
                  </Typography>
                </Grid>
              )}
              {cleanFieldValue(credentialSubject.credentialDescription) && (
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.secondary'>
                    Description:
                  </Typography>
                  <Typography>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: cleanHTML(credentialSubject.credentialDescription)
                      }}
                    />
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )

      case 'volunteering':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
              Volunteering Details
            </Typography>
            <Grid container spacing={2}>
              {cleanFieldValue(credentialSubject.volunteerOrg) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Organization:
                  </Typography>
                  <Typography>
                    {cleanFieldValue(credentialSubject.volunteerOrg)}
                  </Typography>
                </Grid>
              )}
              {cleanFieldValue(credentialSubject.volunteerDates) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Dates:
                  </Typography>
                  <Typography>
                    {cleanFieldValue(credentialSubject.volunteerDates)}
                  </Typography>
                </Grid>
              )}
              {cleanFieldValue(credentialSubject.volunteerDescription) && (
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.secondary'>
                    Description:
                  </Typography>
                  <Typography>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: cleanHTML(credentialSubject.volunteerDescription)
                      }}
                    />
                  </Typography>
                </Grid>
              )}
              {credentialSubject.skillsGained && (
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.secondary'>
                    Skills Gained:
                  </Typography>
                  <Typography>
                    {Array.isArray(credentialSubject.skillsGained)
                      ? credentialSubject.skillsGained.join(', ')
                      : credentialSubject.skillsGained}
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )

      case 'performance-review':
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant='h6' sx={{ mb: 2, fontWeight: 600 }}>
              Performance Review Details
            </Typography>
            <Grid container spacing={2}>
              {cleanFieldValue(credentialSubject.employeeName) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Employee Name:
                  </Typography>
                  <Typography>
                    {cleanFieldValue(credentialSubject.employeeName)}
                  </Typography>
                </Grid>
              )}
              {cleanFieldValue(credentialSubject.employeeJobTitle) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Employee Job Title:
                  </Typography>
                  <Typography>
                    {cleanFieldValue(credentialSubject.employeeJobTitle)}
                  </Typography>
                </Grid>
              )}
              {cleanFieldValue(credentialSubject.company) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Company:
                  </Typography>
                  <Typography>{cleanFieldValue(credentialSubject.company)}</Typography>
                </Grid>
              )}
              {cleanFieldValue(credentialSubject.role) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Reviewer Role:
                  </Typography>
                  <Typography>{cleanFieldValue(credentialSubject.role)}</Typography>
                </Grid>
              )}
              {cleanFieldValue(credentialSubject.reviewDuration) && (
                <Grid item xs={12} sm={6}>
                  <Typography variant='body2' color='text.secondary'>
                    Review Period:
                  </Typography>
                  <Typography>
                    {cleanFieldValue(credentialSubject.reviewDuration)}
                  </Typography>
                </Grid>
              )}

              {/* Ratings */}
              {(credentialSubject.jobKnowledgeRating ||
                credentialSubject.teamworkRating ||
                credentialSubject.initiativeRating ||
                credentialSubject.communicationRating) && (
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    Ratings:
                  </Typography>
                  <Grid container spacing={2}>
                    {credentialSubject.jobKnowledgeRating && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body2'>
                          Job Knowledge: {credentialSubject.jobKnowledgeRating}/5
                        </Typography>
                      </Grid>
                    )}
                    {credentialSubject.teamworkRating && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body2'>
                          Teamwork: {credentialSubject.teamworkRating}/5
                        </Typography>
                      </Grid>
                    )}
                    {credentialSubject.initiativeRating && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body2'>
                          Initiative: {credentialSubject.initiativeRating}/5
                        </Typography>
                      </Grid>
                    )}
                    {credentialSubject.communicationRating && (
                      <Grid item xs={6} sm={3}>
                        <Typography variant='body2'>
                          Communication: {credentialSubject.communicationRating}/5
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Grid>
              )}

              {credentialSubject.overallRating && (
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.secondary'>
                    Overall Rating:
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {credentialSubject.overallRating}/5
                  </Typography>
                </Grid>
              )}

              {cleanFieldValue(credentialSubject.reviewComments) && (
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.secondary'>
                    Comments:
                  </Typography>
                  <Typography>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: cleanHTML(credentialSubject.reviewComments)
                      }}
                    />
                  </Typography>
                </Grid>
              )}

              {cleanFieldValue(credentialSubject.goalsNext) && (
                <Grid item xs={12}>
                  <Typography variant='body2' color='text.secondary'>
                    Goals for Next Period:
                  </Typography>
                  <Typography>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: cleanHTML(credentialSubject.goalsNext)
                      }}
                    />
                  </Typography>
                </Grid>
              )}
            </Grid>
          </Box>
        )

      case 'skill':
      default:
        const achievement = credentialSubject?.achievement?.[0]
        return (
          <Box sx={{ mt: 2 }}>
            {cleanFieldValue(credentialSubject?.credentialDescription) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  Description:
                </Typography>
                <Typography>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: cleanHTML(credentialSubject.credentialDescription)
                    }}
                  />
                </Typography>
              </Box>
            )}
            {achievement?.description && cleanFieldValue(achievement.description) && (
              <Box sx={{ mb: 2 }}>
                <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                  How you earned this skill:
                </Typography>
                <Typography>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: cleanHTML(achievement.description)
                    }}
                  />
                </Typography>
              </Box>
            )}
            {achievement?.criteria?.narrative &&
              cleanFieldValue(achievement.criteria.narrative) && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant='body2' color='text.secondary' sx={{ mb: 1 }}>
                    What does that entail?:
                  </Typography>
                  <ul style={{ marginLeft: '25px', marginTop: '8px' }}>
                    <li>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: cleanHTML(achievement.criteria.narrative)
                        }}
                      />
                    </li>
                  </ul>
                </Box>
              )}
          </Box>
        )
    }
  }

  return (
    <Container sx={{ maxWidth: '800px' }}>
      <Box
        sx={{
          p: isAskForRecommendation ? '5px' : '20px',
          gap: '20px',
          margin: '20px auto 0',
          border: '1px solid #003FE0',
          borderRadius: '10px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: isAskForRecommendation ? 'center' : 'flex-start',
          position: 'relative'
        }}
      >
        {fileID && !isMobile && (
          <Box
            sx={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px',
              zIndex: 1
            }}
          >
            <Link
              href={`/api/credential-raw/${fileID}`}
              target='_blank'
              style={{ textDecoration: 'none' }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  fontFamily: 'Lato',
                  color: '#003FE0',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }}
              >
                View Source
              </Typography>
            </Link>
            {qrCodeDataUrl && (
              <img
                src={qrCodeDataUrl}
                alt='QR Code for credential source'
                style={{ width: '120px', height: '120px' }}
              />
            )}
          </Box>
        )}

        {isAskForRecommendation && (
          <Box
            sx={{
              width: credentialSubject?.evidenceLink ? '30%' : '0',
              marginRight: credentialSubject?.evidenceLink ? '20px' : '15px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden'
            }}
          >
            {credentialSubject?.evidenceLink ? (
              <EvidencePreview
                url={credentialSubject.evidenceLink}
                width={180}
                height={150}
              />
            ) : (
              <Box
                sx={{ width: '15px', height: '100px', backgroundColor: 'transparent' }}
              />
            )}
          </Box>
        )}

        <Box sx={{ flex: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              justifyContent: 'center'
            }}
          >
            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <SVGBadge />
              <Typography
                sx={{
                  color: 't3BodyText',
                  fontSize: '24px',
                  fontWeight: 700,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  overflowWrap: 'anywhere'
                }}
              >
                {personName} has claimed:
              </Typography>
            </Box>
            <Typography
              sx={{
                color: 't3BodyText',
                fontSize: '24px',
                fontWeight: 700,
                mt: 2,
                wordBreak: 'break-word',
                whiteSpace: 'pre-line',
                overflowWrap: 'anywhere'
              }}
            >
              {credentialTitle}
            </Typography>
          </Box>

          {(cleanFieldValue(credentialSubject?.duration) ||
            cleanFieldValue(credentialSubject?.credentialDuration)) && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                padding: '2px 5px',
                borderRadius: '5px',
                width: 'fit-content',
                mb: '10px',
                bgcolor: '#d5e1fb',
                mt: 2
              }}
            >
              <Box sx={{ mt: '2px' }}>
                <SVGDate />
              </Box>
              <Typography
                sx={{
                  color: 't3BodyText',
                  fontSize: '13px',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-line',
                  overflowWrap: 'anywhere'
                }}
              >
                {cleanFieldValue(credentialSubject?.duration) ||
                  cleanFieldValue(credentialSubject?.credentialDuration)}
              </Typography>
            </Box>
          )}

          {!isAskForRecommendation && (
            <>
              {credentialSubject?.evidenceLink && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '20px',
                    my: '10px',
                    justifyContent: 'center',
                    width: '100%'
                  }}
                >
                  <EvidencePreview
                    url={credentialSubject.evidenceLink}
                    width={180}
                    height={150}
                  />
                </Box>
              )}

              {/* Render credential-specific content */}
              {renderCredentialContent()}

              {hasValidEvidence &&
                credentialSubject?.portfolio?.some(item => item.name && item.url) && (
                  <Box sx={{ mt: 3 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-line',
                        overflowWrap: 'anywhere'
                      }}
                    >
                      Supporting Evidence / Portfolio:
                    </Typography>
                    <ul
                      style={{
                        marginLeft: '25px',
                        textDecorationLine: 'underline',
                        color: 'blue',
                        wordBreak: 'break-word',
                        whiteSpace: 'pre-line',
                        overflowWrap: 'anywhere'
                      }}
                    >
                      {credentialSubject?.portfolio
                        ?.filter(item => item.name && item.url)
                        .map((portfolioItem, idx) => (
                          <li
                            key={`main-portfolio-${idx}`}
                            style={{
                              cursor: 'pointer',
                              width: 'fit-content',
                              marginBottom: '10px',
                              wordBreak: 'break-word',
                              whiteSpace: 'pre-line',
                              overflowWrap: 'anywhere'
                            }}
                          >
                            <Link
                              href={portfolioItem.url}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              {portfolioItem.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </Box>
                )}
            </>
          )}

          {(pathname?.includes('/view') || !!propFileID) &&
            claimDetail &&
            !isRecommendationsPage && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  mt: '20px'
                }}
              >
                <Typography sx={{ fontSize: '13px', fontWeight: 700, color: '#000E40' }}>
                  Credential Details
                </Typography>
                <Box
                  sx={{ display: 'flex', gap: '5px', mt: '10px', alignItems: 'center' }}
                >
                  <Box sx={{ borderRadius: '4px', bgcolor: '#C2F1BE', p: '4px' }}>
                    <CheckMarkSVG />
                  </Box>
                  <Typography>Has a valid digital signature</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <Box sx={{ borderRadius: '4px', bgcolor: '#C2F1BE', p: '4px' }}>
                    <CheckMarkSVG />
                  </Box>
                  <Typography>Has not expired</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <Box sx={{ borderRadius: '4px', bgcolor: '#C2F1BE', p: '4px' }}>
                    <CheckMarkSVG />
                  </Box>
                  <Typography>Has not been revoked by issuer</Typography>
                </Box>
              </Box>
            )}
        </Box>
      </Box>

      {fileID && isMobile && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            mt: '16px',
            p: '16px',
            border: '1px solid #E0E7FF',
            borderRadius: '8px',
            backgroundColor: '#F8FAFC'
          }}
        >
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: 'Lato',
              color: '#64748B',
              textAlign: 'center'
            }}
          >
            Scan QR code or click to view credential source
          </Typography>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {qrCodeDataUrlMobile && (
              <img
                src={qrCodeDataUrlMobile}
                alt='QR Code for credential source'
                style={{ width: '80px', height: '80px' }}
              />
            )}
            <Link
              href={`/api/credential-raw/${fileID}`}
              target='_blank'
              style={{ textDecoration: 'none' }}
            >
              <Typography
                sx={{
                  fontSize: '14px',
                  fontWeight: 600,
                  fontFamily: 'Lato',
                  color: '#003FE0',
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'none'
                  }
                }}
              >
                View Source
              </Typography>
            </Link>
          </Box>
        </Box>
      )}

      {/* Comments Section */}
      {(isView || !!propFileID) && claimDetail && !isRecommendationsPage && (
        <Box>
          {loading ? (
            <Box display='flex' justifyContent='center' my={2}>
              <CircularProgress size={24} />
            </Box>
          ) : comments && comments.length > 0 ? (
            <List sx={{ p: 0, mb: 2 }}>
              {comments.map((comment: ClaimDetail, index: number) => (
                <React.Fragment key={index}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      pr: '30px'
                    }}
                  >
                    <LineSVG />
                  </Box>
                  <ListItem
                    sx={{ borderRadius: '10px', border: '1px solid #003FE0' }}
                    alignItems='flex-start'
                    secondaryAction={
                      <IconButton
                        edge='end'
                        onClick={() =>
                          handleToggleComment(comment.id || index.toString())
                        }
                        aria-label='expand'
                      >
                        {expandedComments[comment.id || index.toString()] ? (
                          <ExpandLess />
                        ) : (
                          <ExpandMore />
                        )}
                      </IconButton>
                    }
                  >
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <SVGBadge />
                          <Box>
                            <Typography variant='h6' component='div'>
                              {getPersonName(comment.credentialSubject)}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              Vouched for {personName}
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                  <Collapse
                    in={expandedComments[comment.id || index.toString()]}
                    timeout='auto'
                    unmountOnExit
                  >
                    <Box sx={{ pl: 7, pr: 2, pb: 2 }}>
                      {/* How They Know Each Other */}
                      {comment.credentialSubject?.howKnow && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant='subtitle2' color='text.secondary'>
                            How They Know Each Other:
                          </Typography>
                          <Typography variant='body2'>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: cleanHTML(comment.credentialSubject.howKnow)
                              }}
                            />
                          </Typography>
                        </Box>
                      )}
                      {/* Recommendation Text */}
                      {comment.credentialSubject?.recommendationText && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant='subtitle2' color='text.secondary'>
                            Recommendation:
                          </Typography>
                          <Typography variant='body2'>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: cleanHTML(
                                  comment.credentialSubject.recommendationText
                                )
                              }}
                            />
                          </Typography>
                        </Box>
                      )}
                      {/* Your Qualifications */}
                      {comment.credentialSubject?.qualifications && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant='subtitle2' color='text.secondary'>
                            Your Qualifications:
                          </Typography>
                          <Typography variant='body2'>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: cleanHTML(
                                  comment.credentialSubject.qualifications
                                )
                              }}
                            />
                          </Typography>
                        </Box>
                      )}
                      {/* Explain Your Answer */}
                      {comment.credentialSubject?.explainAnswer && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant='subtitle2' color='text.secondary'>
                            Explain Your Answer:
                          </Typography>
                          <Typography variant='body2'>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: cleanHTML(comment.credentialSubject.explainAnswer)
                              }}
                            />
                          </Typography>
                        </Box>
                      )}
                      {/* Supporting Evidence */}
                      {Array.isArray(comment.credentialSubject?.portfolio) &&
                        comment.credentialSubject.portfolio.length > 0 && (
                          <Box sx={{ mt: 1 }}>
                            <Typography variant='subtitle2' color='text.secondary'>
                              Supporting Evidence:
                            </Typography>
                            {comment.credentialSubject.portfolio.map((item, idx) => (
                              <Box key={`comment-portfolio-${idx}`} sx={{ mt: 1 }}>
                                {item.name && item.url ? (
                                  <MuiLink
                                    href={item.url}
                                    underline='hover'
                                    color='primary'
                                    sx={{
                                      fontSize: '15px',
                                      textDecoration: 'underline',
                                      color: '#003fe0'
                                    }}
                                    target='_blank'
                                  >
                                    {item.name}
                                  </MuiLink>
                                ) : null}
                              </Box>
                            ))}
                          </Box>
                        )}
                    </Box>
                  </Collapse>
                  {/* Add Divider between comments */}
                  {index < comments.length - 1 && <Divider component='li' />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                mb: '20px'
              }}
            >
              <Typography variant='body2'>No recommendations available.</Typography>
              <Link href={`/askforrecommendation/${fileID}`}>
                <Button
                  variant='contained'
                  sx={{
                    backgroundColor: '#003FE0',
                    textTransform: 'none',
                    borderRadius: '100px',
                    width: { xs: 'fit-content', sm: '300px', md: '300px' }
                  }}
                >
                  Ask for Recommendation
                </Button>
              </Link>
            </Box>
          )}
        </Box>
      )}
    </Container>
  )
}

export default ComprehensiveClaimDetails
