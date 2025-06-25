'use client'

import React, { useEffect, useState, MouseEvent } from 'react'
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Snackbar,
  Button
  // ButtonGroup,
  // Menu,
  // MenuItem,
  // ListItemIcon,
  // ListItemText
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useParams } from 'next/navigation'
// import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
// import EmailIcon from '@mui/icons-material/Email'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import useGoogleDrive from '../../hooks/useGoogleDrive'
import { NewEmail2 } from '../../Assets/SVGs'
import ComprehensiveClaimDetails from '../../view/[id]/ComprehensiveClaimDetails'

interface DriveData {
  data: {
    type?: string[]
    credentialSubject: {
      achievement?: {
        name: string
        description: string
        criteria?: { narrative: string }
        image?: { id: string }
      }[]
      // Employment credentials
      company?: string
      role?: string
      credentialName?: string
      credentialDuration?: string
      credentialDescription?: string
      // Volunteering credentials
      volunteerOrg?: string
      volunteerWork?: string
      volunteerDescription?: string
      skillsGained?: string[]
      volunteerDates?: string
      // Performance review credentials
      employeeName?: string
      employeeJobTitle?: string
      // Common fields
      fullName?: string
      name?: string
    }
  }
}

export default function MailRecommendation() {
  const [isLoading, setIsLoading] = useState(true)
  const [driveData, setDriveData] = useState<DriveData | null>(null) //NOSONAR
  const params = useParams()
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarMessage, setSnackbarMessage] = useState('')
  const [messageToCopy, setMessageToCopy] = useState<string>('')
  const { getContent } = useGoogleDrive()
  const [achievementName, setAchievementName] = useState<string>('')
  // const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null)
  // const menuOpen = Boolean(menuAnchorEl)

  const { reset } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      reference: ''
    },
    mode: 'onChange'
  })

  const fileID = params?.id as string

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const content = await getContent(fileID)
        setDriveData(content as any)
        const achievement = content?.data?.credentialSubject?.achievement?.[0]
        const name = achievement?.name || 'your skill'
        const credentialType = content?.data?.type?.[1] || 'skill'
        const baseMessage = generateMessage(
          name,
          fileID,
          credentialType,
          content?.data?.credentialSubject
        )
        setMessageToCopy(baseMessage)
      } catch (error) {
        console.error('Error fetching data:', error)
        showNotification('Failed to fetch data')
      } finally {
        setIsLoading(false)
      }
    }
    if (fileID) {
      fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileID, getContent]) //NOSONAR

  const generateMessage = (
    skillName: string,
    id: string,
    credentialType?: string,
    credentialSubject?: any
  ) => {
    const recommendationUrl = `https://linked-creds-author-businees-enhancement.vercel.app/recommendations/${id}`

    // Get additional context from credential data if available
    const actualCredentialSubject =
      credentialSubject || driveData?.data?.credentialSubject
    const company = actualCredentialSubject?.company || '[Insert Company Name]'
    const organization =
      actualCredentialSubject?.volunteerOrg ||
      '[organization to which you volunteered your time]'

    switch (credentialType?.toLowerCase()) {
      case 'employmentcredential':
      case 'employment':
      case 'role':
        return `[Insert Supervisor's name] Below you'll find the link to my employment credential stating I work at ${company} as described. This credential is intended to accurately represent my current position and affirms I'm employee in good standing at ${company}. I appreciate confirmation of my employment through your endorsement of my employment credential.\n\n${recommendationUrl}`

      case 'volunteeringcredential':
      case 'volunteering':
      case 'volunteer':
        return `[Supervisor's name]: the link below describes my recent volunteer work for ${organization}. I would appreciate your acknowledgement of and support for my efforts working with this group. I found it [rewarding/enjoyable.etc in your words] and sought to represent our company in positive and professional manner. I look forward to your affirmation of my volunteering work.\n\n${recommendationUrl}`

      case 'performancereviewcredential':
      case 'performance-review':
      case 'performancereview':
        return `[supervisor's name]: Please review my performance review draft found in the URL below. I look forward to your comments, critiques, and suggestions. Based on your feedback I'll review my PR and with your input. If you think a second version is appropriate, I'll generate a new PR for your consideration. Thank you for making the time to review my work. I look forward to your response.\n\n${recommendationUrl}`

      case 'skill':
      default:
        // Keep original message for skills and other types
        return `Hey there! I hope you're doing well. I am writing to ask if you would consider supporting me by providing validation of my expertise in ${skillName}. If you're comfortable, could you please take a moment to write a brief reference highlighting your observations of my capabilities and how they have contributed to the work we have done together? It would mean a lot to me!\n\n${recommendationUrl}`
    }
  }

  const handleAchievementLoad = (name: string, credentialType?: string) => {
    if (name && name !== achievementName) {
      setAchievementName(name)
      const updatedMessage = generateMessage(
        name,
        fileID,
        credentialType,
        driveData?.data?.credentialSubject
      )
      setMessageToCopy(updatedMessage)
      reset({
        reference: updatedMessage
      })
    }
  }

  const showNotification = (message: string) => {
    setSnackbarMessage(message)
    setSnackbarOpen(true)
  }

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') return
    setSnackbarOpen(false)
  }

  /* Commented out email handler functions - keeping only copy functionality
  const handleMenuClick = (event: MouseEvent<HTMLButtonElement>) => {
    setMenuAnchorEl(event.currentTarget)
  }

  // const handleMenuClose = () => {
  //   setMenuAnchorEl(null)
  // }

  // const handleSendMailto = () => {
  //   try {
  //     const subject = `Support Request: Validation of Expertise`
  //     const mailToLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageToCopy)}`
  //     const mailWindow = window.open(mailToLink, '_blank')
  //     if (!mailWindow) {
  //       window.location.href = mailToLink
  //     }
  //     showNotification('Mail client opened.')
  //   } catch (err) {
  //     console.error('Error opening mail client:', err)
  //     showNotification('Failed to open mail client')
  //   }
  //   handleMenuClose()
  // }

  // const handleSendGmail = () => {
  //   try {
  //     const subject = `Support Request: Validation of Expertise`
  //     const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(messageToCopy)}`
  //     window.open(gmailLink, '_blank')

      navigator.clipboard
        .writeText(messageToCopy)
        .then(() => {
          showNotification('Email body copied to clipboard. Ready to paste in Gmail!')
        })
        .catch(err => {
          console.error('Failed to copy text: ', err)
          showNotification('Failed to copy text')
        })
    } catch (err) {
      showNotification('Failed to open Gmail')
    }
    handleMenuClose()
  }
  */

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(messageToCopy)
      showNotification('Text copied to clipboard!')
    } catch (err) {
      showNotification('Failed to copy text')
    }
  }

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        overflow: 'auto',
        my: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '30px',
        px: 3,
        maxWidth: '800px',
        mx: 'auto'
      }}
    >
      <NewEmail2 />

      <Typography
        variant='h1'
        sx={{
          fontFamily: 'Lato',
          fontSize: '24px',
          fontWeight: 400,
          color: '#202E5B',
          textAlign: 'center'
        }}
      >
        Let&apos;s get some recommendations for you from people you know.
      </Typography>

      <Box
        sx={{
          width: '100%',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          p: 3,
          position: 'relative'
        }}
      >
        <Typography
          sx={{
            fontFamily: 'Lato',
            fontSize: '16px',
            mb: 3,
            fontWeight: 600,
            color: '#202E5B'
          }}
        >
          Follow these steps:
        </Typography>

        <ol
          style={{
            marginBottom: '20px',
            paddingLeft: '20px',
            color: '#202E5B',
            fontFamily: 'Lato'
          }}
        >
          <li style={{ marginBottom: '8px' }}>
            Use the button below to copy the message
          </li>
          <li style={{ marginBottom: '8px' }}>
            Paste it into your preferred email application
          </li>
          <li>Send it to the person you want to request a recommendation from</li>
        </ol>

        {/* Commented out email buttons - keeping only copy functionality */}
        {/*
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            onClick={copyToClipboard}
            variant='contained'
            startIcon={<ContentCopyIcon />}
            sx={{
              borderRadius: '100px',
              textTransform: 'lowercase',
              fontFamily: 'Roboto',
              color: '#FFFFFF',
              fontSize: '14px',
              backgroundColor: '#003FE0',
              width: '100%',
              maxWidth: '400px',
              '&:hover': {
                backgroundColor: '#002bb5'
              }
            }}
          >
            Copy Message
          </Button>
        </Box>

        {/* <Menu
          id='email-menu'
          anchorEl={menuAnchorEl}
          open={menuOpen}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left'
          }}
        >
          <MenuItem onClick={handleSendGmail}>
            <ListItemIcon>
              <EmailIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Gmail</ListItemText>
          </MenuItem>
          <MenuItem onClick={copyToClipboard}>
            <ListItemIcon>
              <ContentCopyIcon fontSize='small' />
            </ListItemIcon>
            <ListItemText>Copy</ListItemText>
          </MenuItem>
        </Menu>
        */}

        {/* Main Copy Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
          <Button
            onClick={copyToClipboard}
            variant='contained'
            startIcon={<ContentCopyIcon />}
            sx={{
              borderRadius: '100px',
              textTransform: 'lowercase',
              fontFamily: 'Roboto',
              color: '#FFFFFF',
              fontSize: '14px',
              backgroundColor: '#003FE0',
              px: 4,
              py: 1.5,
              '&:hover': {
                backgroundColor: '#002bb5'
              }
            }}
          >
            Copy Message
          </Button>
        </Box>

        <Box
          sx={{
            backgroundColor: 'white',
            p: 3,
            borderRadius: '4px',
            position: 'relative',
            border: '1px solid #e0e0e0',
            flexWrap: 'wrap',
            display: 'flex',
            flexDirection: 'column',
            width: '100%'
          }}
        >
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              width: '100%',
              fontFamily: 'Lato',
              color: '#333',
              fontSize: '14px',
              flexGrow: 1
            }}
          >
            <Typography
              sx={{
                fontFamily: 'Lato',
                color: '#333',
                fontSize: '14px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flexGrow: 1,
                lineHeight: 1.5
              }}
            >
              {messageToCopy}
            </Typography>
          </Box>
          <ComprehensiveClaimDetails
            onAchievementLoad={handleAchievementLoad}
            fileID={fileID}
            vcData={driveData?.data as any}
          />
        </Box>
      </Box>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity='success' sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  )
}
