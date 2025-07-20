'use client'

import React, { useCallback, useEffect, useState } from 'react'
import '../utils/promise-polyfill'
import {
  Typography,
  CircularProgress,
  Box,
  Button,
  IconButton,
  Collapse,
  Avatar,
  useTheme,
  useMediaQuery,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Divider,
  Snackbar,
  Alert
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import VisibilityIcon from '@mui/icons-material/Visibility'
import useGoogleDrive from '../hooks/useGoogleDrive'
import LoadingOverlay from '../components/Loading/LoadingOverlay'
import ComprehensiveClaimDetails from '../view/[id]/ComprehensiveClaimDetails'
import { updateClickRates } from '../firebase/firestore'

import {
  SVGHeart,
  SVGLinkedIn,
  SVGEmail,
  SVGCopy,
  SVGTrush,
  BlueBadge,
  SVGExport
} from '../Assets/SVGs'

// Types
interface ViewClaimDialogContentProps {
  fileID: string
}

interface Claim {
  [x: string]: any
  id: string
  achievementName: string
}

interface SnackbarState {
  open: boolean
  message: string
  severity: 'success' | 'error'
}

const borderColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#6366f1']

const getRandomBorderColor = () => {
  return borderColors[Math.floor(Math.random() * borderColors.length)]
}

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getTimeAgo = (isoDateString: string): string => {
  try {
    if (!isoDateString || typeof isoDateString !== 'string') {
      return 'Unknown date'
    }
    const date = new Date(isoDateString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }
    return formatDate(date)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Unknown date'
  }
}

const getTimeDifference = (isoDateString: string): string => {
  try {
    if (!isoDateString || typeof isoDateString !== 'string') {
      return 'Unknown'
    }

    const date = new Date(isoDateString)
    if (isNaN(date.getTime())) {
      return 'Unknown'
    }

    const now = new Date()
    const diffInMilliseconds = now.getTime() - date.getTime()
    const diffInSeconds = Math.floor(diffInMilliseconds / 1000)
    const diffInMinutes = Math.floor(diffInSeconds / 60)
    const diffInHours = Math.floor(diffInMinutes / 60)
    const diffInDays = Math.floor(diffInHours / 24)
    const months =
      (now.getFullYear() - date.getFullYear()) * 12 + (now.getMonth() - date.getMonth())

    if (months > 0) return `${months} ${months === 1 ? 'month' : 'months'}`
    if (diffInDays >= 30) return `${diffInDays} days`
    if (diffInDays > 0) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'}`
    if (diffInHours > 0) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'}`
    if (diffInMinutes > 0)
      return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'}`
    return `${diffInSeconds} ${diffInSeconds === 1 ? 'second' : 'seconds'}`
  } catch (error) {
    console.error('Error calculating time difference:', error)
    return 'Unknown'
  }
}

const ViewClaimDialogContent: React.FC<ViewClaimDialogContentProps> = ({ fileID }) => {
  return (
    <Box sx={{ py: 2 }}>
      <ComprehensiveClaimDetails fileID={fileID} />
    </Box>
  )
}

const safeJSON = (v: string) => {
  try {
    const j = JSON.parse(v)
    if (typeof j === 'string' && j.trim().startsWith('<')) return null
    return j
  } catch {
    return null
  }
}

const pickDriveIds = (url: string) => {
  const re1 = /\/d\/([\w-]{10,})/
  const re2 = /[?&]id=([\w-]{10,})/
  const match = re1.exec(url) ?? re2.exec(url)
  return match ? match[1] : null
}

const safeDelete = async (storage: any, fileId: string | null) => {
  if (!fileId) return
  try {
    await storage.delete(fileId)
  } catch (err: any) {
    const msg: string = err?.message ?? ''
    if (msg.includes('File not found') || msg.includes('Expected JSON')) return
    throw err
  }
}

const tearDown = async (storage: any, claim: any) => {
  const fileId = claim.id?.id ?? ''
  let parents
  try {
    parents = await storage.getFileParents(fileId)
  } catch (err: any) {
    const msg: string = err?.message ?? ''
    if (!msg.includes('File not found')) throw err
    parents = []
  }
  const folderId = parents?.[0] ?? null
  let relationsId: string | null = null
  if (folderId != null) {
    try {
      const kids = await storage.findFilesUnderFolder(folderId)
      const r = kids.find((f: any) => f?.name === 'RELATIONS')
      relationsId = r?.id ?? null
    } catch {}
  }
  await safeDelete(storage, fileId)
  await safeDelete(storage, relationsId)
  const data = safeJSON(claim.id.data?.body ?? '') ?? claim
  const urls: string[] = []
  data?.credentialSubject?.portfolio?.forEach((p: any) => urls.push(p.url))
  if (data?.credentialSubject?.evidenceLink)
    urls.push(data.credentialSubject.evidenceLink)
  data?.credentialSubject?.achievement?.forEach((a: any) => {
    if (a.image?.id) urls.push(a.image.id)
  })
  const ids = urls.map(pickDriveIds).filter(Boolean) as string[]
  await Promise.all(ids.map((i: string) => safeDelete(storage, i)))
}

const withResolversPolyfill = <T,>() => {
  let resolve!: (value: T | PromiseLike<T>) => void
  let reject!: (reason?: any) => void

  const promise = new Promise<T>((res, rej) => {
    resolve = res
    reject = rej
  })

  return { promise, resolve, reject }
}

// Add helper function to safely get credential name
const getCredentialName = (claim: any): string => {
  try {
    // Safety check for claim object
    if (!claim || typeof claim !== 'object') {
      return 'Invalid Credential'
    }

    const credentialSubject = claim.credentialSubject
    if (!credentialSubject || typeof credentialSubject !== 'object') {
      return 'Unknown Credential'
    }

    // Handle new credential format (direct access)
    if (credentialSubject.employeeName) {
      return `Performance Review: ${credentialSubject.employeeJobTitle || 'Unknown Position'}`
    }
    if (credentialSubject.volunteerWork) {
      return `Volunteer: ${credentialSubject.volunteerWork}`
    }
    if (credentialSubject.role) {
      return `Employment: ${credentialSubject.role}`
    }
    if (credentialSubject.credentialName) {
      return credentialSubject.credentialName
    }

    // Handle old credential format (achievement array)
    if (
      Array.isArray(credentialSubject.achievement) &&
      credentialSubject.achievement.length > 0 &&
      credentialSubject.achievement[0]?.name
    ) {
      return credentialSubject.achievement[0].name
    }

    // Fallback
    return 'Unknown Credential'
  } catch (error) {
    console.error('Error getting credential name:', error)
    return 'Invalid Credential'
  }
}

// Add helper function to safely get credential type
const getCredentialType = (claim: any): string => {
  try {
    if (!claim || typeof claim !== 'object') {
      return 'Unknown'
    }

    const types = Array.isArray(claim.type) ? claim.type : []
    if (types.includes('EmploymentCredential')) return 'Employment'
    if (types.includes('VolunteeringCredential')) return 'Volunteer'
    if (types.includes('PerformanceReviewCredential')) return 'Performance Review'
    return 'Skill'
  } catch (error) {
    console.error('Error getting credential type:', error)
    return 'Unknown'
  }
}

const ClaimsPageClient: React.FC = () => {
  const [claims, setClaims] = useState<any[]>([])
  const [renderError, setRenderError] = useState<string | null>(null)
  console.log(': claims', claims)
  const [loading, setLoading] = useState(true)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [selectedClaim, setSelectedClaim] = useState<any>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showOverlappingCards, setShowOverlappingCards] = useState(false)
  const [desktopMenuAnchorEl, setDesktopMenuAnchorEl] = useState<null | HTMLElement>(null)
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  })
  const [viewClaimDialogOpen, setViewClaimDialogOpen] = useState(false)
  const [viewClaimId, setViewClaimId] = useState<string | null>(null)

  const { data: session } = useSession()
  const accessToken = session?.accessToken
  const userEmail = session?.user?.email
  const { storage } = useGoogleDrive()
  const router = useRouter()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const handleRecommendationClick = async (claimId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const url = `${window.location.origin}/askforrecommendation/${claimId}`
    await navigator.clipboard.writeText(url)
    router.push(`/askforrecommendation/${claimId}`)
    if (userEmail) {
      updateClickRates(userEmail, 'requestRecommendation')
    }
  }

  const handleViewClaimClick = (claimId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    setViewClaimId(claimId)
    setViewClaimDialogOpen(true)
  }

  const handleCloseViewClaimDialog = () => {
    setViewClaimDialogOpen(false)
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const handleEmailShare = (claim: any, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const claimId = claim?.id?.id || claim?.id
    if (claimId) {
      const mailPageUrl = `${window.location.origin}/mail/${claimId}`
      window.location.href = mailPageUrl
    }
  }
  const handleDesktopMenuOpen = (event: React.MouseEvent<HTMLElement>, claim: any) => {
    event.stopPropagation()
    setDesktopMenuAnchorEl(event.currentTarget)
    setSelectedClaim(claim)
  }

  const generateLinkedInUrl = (claim: any) => {
    const baseLinkedInUrl = 'https://www.linkedin.com/profile/add'
    const credentialName = getCredentialName(claim)

    // Get current date for issue date
    const currentDate = new Date()
    const issueYear = currentDate.getFullYear().toString()
    const issueMonth = (currentDate.getMonth() + 1).toString()

    // Get expiration date (2 years from now)
    const expirationDate = new Date()
    expirationDate.setFullYear(currentDate.getFullYear() + 2)
    const expirationYear = expirationDate.getFullYear().toString()
    const expirationMonth = (expirationDate.getMonth() + 1).toString()

    const claimId = claim?.id?.id || claim?.id || ''
    const params = new URLSearchParams({
      startTask: 'CERTIFICATION_NAME',
      name: credentialName,
      organizationName: 'LinkedTrust',
      issueYear,
      issueMonth,
      expirationYear,
      expirationMonth,
      certId: claimId,
      certUrl: `https://linked-creds-author-businees-enhancement.vercel.app/view/${claimId}`
    })
    return `${baseLinkedInUrl}?${params.toString()}`
  }

  const handleLinkedInShare = (claim: any) => {
    const linkedInUrl = generateLinkedInUrl(claim)
    window.open(linkedInUrl, '_blank')
    if (userEmail) {
      updateClickRates(userEmail, 'shareCredential')
    }
  }

  const handleDesktopMenuClose = () => {
    setDesktopMenuAnchorEl(null)
  }

  const handleCardClick = (claimId: string) => {
    if (isMobile) {
      setExpandedCard(expandedCard === claimId ? null : claimId)
    }
  }

  const handleCopyUrl = async (claimId: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    const url = `${window.location.origin}/view/${claimId}`
    await navigator.clipboard.writeText(url)
  }

  const handleConfirmDelete = async () => {
    if (!selectedClaim || !storage) return
    try {
      setIsDeleting(true)
      setShowOverlappingCards(true)
      localStorage.removeItem('vcs')
      await tearDown(storage, selectedClaim)
      setClaims(prevClaims => {
        const updated = prevClaims.filter(claim => claim?.id !== selectedClaim.id)
        return updated
      })
      setOpenDeleteDialog(false)
      setSelectedClaim(null)
      setDesktopMenuAnchorEl(null)
    } catch (error) {
      console.error('Error deleting claim:', error)
    } finally {
      setIsDeleting(false)
      setShowOverlappingCards(false)
      setExpandedCard(null)
    }
  }

  const getAllClaims = useCallback(async (): Promise<any> => {
    try {
      const driveFiles = await storage?.getAllFilesByType('VCs')
      if (!driveFiles?.length) {
        const cachedVCs = localStorage.getItem('vcs')
        if (cachedVCs) {
          try {
            const parsedVCs = JSON.parse(cachedVCs)
            if (Array.isArray(parsedVCs) && parsedVCs.length > 0) {
              console.log('No drive files, returning cached VCs from localStorage')
              return parsedVCs
            }
          } catch (error) {
            console.error('Error parsing cached VCs from localStorage:', error)
          }
        }
        return []
      }

      const vcs = []
      for (const file of driveFiles) {
        try {
          // Safety checks for file structure
          if (!file || !file.data || !file.data.body) {
            console.warn('Invalid file structure, skipping:', file)
            continue
          }

          const content = JSON.parse(file.data.body)

          // Validate the content structure
          if (
            content &&
            typeof content === 'object' &&
            '@context' in content &&
            content.credentialSubject &&
            typeof content.credentialSubject === 'object'
          ) {
            vcs.push({
              ...content,
              id: file
            })
          } else {
            console.warn('Invalid credential content structure, skipping:', content)
          }
        } catch (error) {
          console.error(`Error processing file ${file?.id || 'unknown'}:`, error)
          continue
        }
      }

      // Cache the fresh data
      localStorage.setItem('vcs', JSON.stringify(vcs))
      return vcs
    } catch (error) {
      console.error('Error fetching claims from drive:', error)
      // Fallback to cache if drive fetch fails
      const cachedVCs = localStorage.getItem('vcs')
      if (cachedVCs) {
        try {
          const parsedVCs = JSON.parse(cachedVCs)
          if (Array.isArray(parsedVCs)) {
            console.log('Drive fetch failed, returning cached VCs from localStorage')
            return parsedVCs
          }
        } catch (cacheError) {
          console.error('Error parsing cached VCs from localStorage:', cacheError)
        }
      }
      return []
    }
  }, [storage])

  useEffect(() => {
    const fetchClaims = async () => {
      // Check if user is authenticated
      if (!session || !accessToken) {
        console.log('No session or access token available. User not authenticated.')
        setLoading(false)
        setClaims([])
        return
      }

      if (!storage) {
        return // Don't fetch if storage is not available yet
      }

      try {
        setLoading(true)
        const claimsData = await getAllClaims()
        // Ensure we always have a valid array
        const validClaims = Array.isArray(claimsData) ? claimsData : []
        setClaims(validClaims)
      } catch (error) {
        console.error('Error fetching claims:', error)
        setClaims([])
        // Show error message to user
        setSnackbar({
          open: true,
          message: 'Error loading credentials. Please try refreshing the page.',
          severity: 'error'
        })
      } finally {
        setLoading(false)
      }
    }
    fetchClaims()
  }, [getAllClaims, storage, session, accessToken])

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem('vcs')
    }

    window.addEventListener('beforeunload', handleBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        p: { xs: 2, sm: 3, md: '100px 20px 16px 50px' }
      }}
    >
      {isMobile && (
        <Box sx={{ mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 3
            }}
          >
            <Avatar
              sx={{ border: '2px solid #003fe0' }}
              alt='Profile Picture'
              src={session?.user?.image}
            />
            <Box>
              <Typography variant='h6'>
                Hi, <span style={{ color: '#033fe0' }}>{session?.user?.name}</span>
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                What would you like to do?
              </Typography>
            </Box>
          </Box>

          <Button
            fullWidth
            variant='nextButton'
            onClick={() => router.push('/newcredential')}
          >
            Add a new credential
          </Button>

          <Typography
            variant='subtitle1'
            sx={{ fontSize: '24px', fontFamily: 'Lato', mt: 2 }}
          >
            Work with my existing credentials:
          </Typography>
        </Box>
      )}

      {!isMobile && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 4
          }}
        >
          <Typography variant='h4' sx={{ fontWeight: 'bold' }}>
            My Credentials
          </Typography>
          <Button
            variant='nextButton'
            sx={{ textTransform: 'none' }}
            onClick={() => router.push('/newcredential')}
          >
            Add a new credential
          </Button>
        </Box>
      )}

      {claims.length === 0 && !loading && !accessToken && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Typography variant='h6'>
            Please Sign in to be able to see your credentials.
          </Typography>
        </Box>
      )}

      {claims.length === 0 && !loading && accessToken && (
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Typography variant='h6'>You don&apos;t have any credentials yet.</Typography>
        </Box>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {claims
            .filter(claim => {
              // Filter out invalid claims to prevent rendering errors
              try {
                return (
                  claim &&
                  typeof claim === 'object' &&
                  claim.id &&
                  claim.credentialSubject &&
                  typeof claim.credentialSubject === 'object'
                )
              } catch (error) {
                console.error('Error validating claim:', error)
                return false
              }
            })
            .map(claim => {
              try {
                return (
                  <Paper
                    key={claim?.id?.id || claim?.id || Math.random()}
                    onClick={() => handleCardClick(claim?.id?.id || claim?.id)}
                    elevation={0}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      cursor: isMobile ? 'pointer' : 'default',
                      border: '3px solid',
                      borderColor: isMobile ? getRandomBorderColor() : 'transparent',
                      bgcolor: 'background.paper',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}
                    >
                      {isMobile ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <BlueBadge />
                          <Typography
                            variant='subtitle1'
                            sx={{
                              fontWeight: 600,
                              textDecoration: 'underline',
                              cursor: 'pointer'
                            }}
                            onClick={e => {
                              e.stopPropagation()
                              window.open(
                                `${window.location.origin}/view/${claim.id.id}`,
                                '_blank'
                              )
                            }}
                          >
                            {getCredentialName(claim)}
                          </Typography>
                        </Box>
                      ) : (
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box sx={{ mt: '5px' }}>
                              <BlueBadge />
                            </Box>
                            <Typography
                              sx={{
                                fontWeight: 'bold',
                                fontSize: '1.25rem',
                                textDecoration: 'underline',
                                cursor: 'pointer'
                              }}
                              onClick={e => {
                                e.stopPropagation()
                                window.open(
                                  `${window.location.origin}/view/${claim.id.id}`,
                                  '_blank'
                                )
                              }}
                            >
                              {getCredentialName(claim)}
                            </Typography>
                            <Typography
                              sx={{
                                color: 'text.secondary',
                                fontWeight: 'bold',
                                fontSize: '1.25rem'
                              }}
                            >
                              {getTimeAgo(claim.issuanceDate || '')}
                            </Typography>
                          </Box>
                          <Typography sx={{ color: 'text.secondary' }}>
                            {claim.credentialSubject?.name || 'Unknown'} -{' '}
                            {getCredentialType(claim)} -{' '}
                            {getTimeDifference(claim.issuanceDate || '')}
                          </Typography>
                        </Box>
                      )}

                      {isMobile ? (
                        <IconButton
                          size='small'
                          onClick={e => {
                            e.stopPropagation()
                            handleCardClick(claim.id)
                          }}
                        >
                          <KeyboardArrowDownIcon
                            sx={{
                              transform:
                                expandedCard === claim.id ? 'rotate(180deg)' : 'none',
                              transition: 'transform 0.3s'
                            }}
                          />
                        </IconButton>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              border: '1px solid',
                              borderColor: 'primary.main',
                              borderRadius: '100px',
                              overflow: 'hidden',
                              bgcolor: 'primary.50'
                            }}
                          >
                            <Button
                              onClick={e => handleRecommendationClick(claim.id.id, e)}
                              startIcon={<SVGHeart />}
                              sx={{
                                bgcolor: '#eff6ff',
                                borderColor: '#eff6ff',
                                '&:hover': { bgcolor: 'primary.100' },
                                p: '2px 20px',
                                backgroundColor: '#f0f6ff',
                                fontSize: '12px',
                                fontWeight: 'medium',
                                color: '#003fe0'
                              }}
                            >
                              Ask for a recommendation
                            </Button>
                            <Divider orientation='vertical' flexItem color='#003fe0' />
                            <Button
                              startIcon={<ContentCopyIcon />}
                              onClick={e => handleCopyUrl(claim.id.id, e)}
                              sx={{
                                bgcolor: '#eff6ff',
                                '&:hover': { bgcolor: 'primary.100' },
                                p: '2px 20px',
                                backgroundColor: '#f0f6ff',
                                fontSize: '12px',
                                fontWeight: 'medium',
                                color: '#003fe0'
                              }}
                            >
                              Copy URL
                            </Button>
                          </Box>
                          <IconButton onClick={e => handleDesktopMenuOpen(e, claim)}>
                            <MoreVertIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    {isMobile && (
                      <Collapse in={expandedCard === claim.id}>
                        <Box
                          sx={{
                            mt: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 1
                          }}
                        >
                          <Button
                            startIcon={<SVGHeart />}
                            endIcon={<SVGExport />}
                            onClick={e => handleRecommendationClick(claim.id.id, e)}
                            fullWidth
                            sx={{
                              justifyContent: 'flex-start',
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                          >
                            Ask for a recommendation
                          </Button>
                          <Button
                            startIcon={<VisibilityIcon sx={{ color: 'primary.main' }} />}
                            endIcon={<SVGExport />}
                            onClick={e => handleViewClaimClick(claim.id.id, e)}
                            fullWidth
                            sx={{
                              justifyContent: 'flex-start',
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                          >
                            View Credential
                          </Button>
                          <Button
                            startIcon={<SVGLinkedIn />}
                            endIcon={<SVGExport />}
                            fullWidth
                            sx={{
                              justifyContent: 'flex-start',
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                            onClick={() => handleLinkedInShare(claim)}
                          >
                            Share to LinkedIn
                          </Button>
                          <Button
                            startIcon={<SVGEmail />}
                            endIcon={<SVGExport />}
                            onClick={e => handleEmailShare(claim, e)}
                            fullWidth
                            sx={{
                              justifyContent: 'flex-start',
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                          >
                            Share via Email
                          </Button>
                          <Button
                            startIcon={<SVGCopy />}
                            onClick={e => handleCopyUrl(claim.id.id, e)}
                            fullWidth
                            sx={{
                              justifyContent: 'flex-start',
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                          >
                            Copy URL
                          </Button>
                          <Button
                            startIcon={<DeleteIcon />}
                            onClick={e => {
                              e.stopPropagation()
                              setSelectedClaim(claim)
                              setOpenDeleteDialog(true)
                            }}
                            fullWidth
                            sx={{
                              justifyContent: 'flex-start',
                              color: 'primary.main',
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      </Collapse>
                    )}
                  </Paper>
                )
              } catch (error) {
                console.error('Error rendering claim:', error)
                return (
                  <Paper
                    key={claim?.id || Math.random()}
                    sx={{ p: 2, borderRadius: 2, bgcolor: 'error.50' }}
                  >
                    <Typography color='error'>Error loading credential</Typography>
                  </Paper>
                )
              }
            })}
        </Box>
      )}

      {!isMobile && (
        <Menu
          anchorEl={desktopMenuAnchorEl}
          open={Boolean(desktopMenuAnchorEl)}
          onClose={handleDesktopMenuClose}
          PaperProps={{
            sx: {
              width: 320,
              mt: 1,
              borderRadius: 2
            }
          }}
        >
          <MenuItem
            onClick={e => {
              handleViewClaimClick(selectedClaim.id.id, e)
              handleDesktopMenuClose()
            }}
            sx={{ py: 1.5, gap: 2 }}
          >
            <VisibilityIcon sx={{ color: '#003fe0' }} />
            <Typography sx={{ textDecoration: 'underline', color: '#003fe0' }}>
              View Credential
            </Typography>
            <SVGExport />
          </MenuItem>
          <MenuItem
            onClick={e => {
              handleLinkedInShare(selectedClaim)
              handleDesktopMenuClose()
            }}
            sx={{ py: 1.5, gap: 2 }}
          >
            <SVGLinkedIn />
            <Typography sx={{ textDecoration: 'underline', color: '#003fe0' }}>
              Share to LinkedIn
            </Typography>
            <SVGExport />
          </MenuItem>
          <MenuItem
            onClick={e => {
              handleEmailShare(selectedClaim, e)
              handleDesktopMenuClose()
            }}
            sx={{ py: 1.5, gap: 2 }}
          >
            <SVGEmail />
            <Typography sx={{ textDecoration: 'underline', color: '#003fe0' }}>
              Share via Email
            </Typography>
            <SVGExport />
          </MenuItem>
          <MenuItem
            onClick={e => {
              handleCopyUrl(selectedClaim?.id.id, e)
              handleDesktopMenuClose()
            }}
            sx={{ py: 1.5, gap: 2 }}
          >
            <SVGCopy />
            <Typography sx={{ textDecoration: 'underline', color: '#003fe0' }}>
              Copy URL
            </Typography>
          </MenuItem>
          <MenuItem
            onClick={() => {
              setOpenDeleteDialog(true)
              handleDesktopMenuClose()
            }}
            sx={{ py: 1.5, gap: 2 }}
          >
            <SVGTrush />
            <Typography sx={{ textDecoration: 'underline', color: '#003fe0' }}>
              Delete
            </Typography>
          </MenuItem>
        </Menu>
      )}
      <Dialog
        open={viewClaimDialogOpen}
        onClose={handleCloseViewClaimDialog}
        maxWidth='md'
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography variant='h6' sx={{ fontWeight: 'bold', fontFamily: 'Lato' }}>
            Credential Details
          </Typography>
          <Button
            onClick={handleCloseViewClaimDialog}
            color='primary'
            sx={{
              color: 'primary.main',
              '&:hover': { bgcolor: 'primary.50' },
              fontWeight: 'bold',
              fontFamily: 'Lato'
            }}
          >
            Close
          </Button>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          {viewClaimId && <ViewClaimDialogContent fileID={viewClaimId} />}
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            bgcolor: 'grey.900',
            maxWidth: '400px',
            width: '100%',
            m: 2
          }
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Are you sure?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'grey.300' }}>
            You cannot recover deleted items and any links to this content will be broken.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 2 }}>
          <Button
            onClick={() => setOpenDeleteDialog(false)}
            variant='outlined'
            fullWidth
            sx={{
              borderRadius: '100px',
              color: 'primary.main',
              borderColor: 'primary.main',
              '&:hover': {
                borderColor: 'primary.dark',
                bgcolor: 'primary.50'
              }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            variant='contained'
            disabled={isDeleting}
            fullWidth
            sx={{
              borderRadius: '100px',
              bgcolor: 'primary.main',
              '&:hover': {
                bgcolor: 'primary.dark'
              }
            }}
          >
            {isDeleting ? <CircularProgress size={24} /> : 'Yes, delete'}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
      <LoadingOverlay text='Deleting...' open={showOverlappingCards} />
    </Box>
  )
}

export default ClaimsPageClient
