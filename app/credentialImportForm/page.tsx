'use client'
import React, { useState } from 'react'
import {
  Box,
  Link,
  TextField,
  FormLabel,
  Typography,
  CircularProgress,
  Button
} from '@mui/material'
import { useSession, signIn } from 'next-auth/react'
import { importCredential } from '../utils/importCred'
import RawCredentialPopup from '../components/RawCredentialPopup'
import VisibilityIcon from '@mui/icons-material/Visibility'

const formLabelStyles = {
  fontFamily: 'Lato',
  fontSize: '16px',
  fontWeight: 400,
  color: '#000000',
  marginBottom: '8px'
}

const TextFieldStyles = {
  width: '343px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px'
  }
}

const textFieldInputProps = {
  style: {
    padding: '16px',
    fontSize: '16px'
  }
}

interface FileResult {
  success: boolean
  error?: string | undefined
  fileId?: string | undefined
  file?: { id: string | undefined }
}

// Function to extract Google Drive file ID from URL
function extractGoogleDriveId(url: string): string | null {
  // Handle Google Drive links in format https://drive.google.com/file/d/{fileId}/view?usp=...
  const regex = /https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)\/view/
  const match = url.match(regex)

  if (match && match[1]) {
    return match[1]
  }

  // If not a Google Drive link or different format, return null
  return null
}

// Separate status message component for cleaner organization
function StatusMessage({ fileResult }: { fileResult: FileResult | null }) {
  if (!fileResult) return null

  if (!fileResult.success || !fileResult.file) {
    return (
      <Typography
        sx={{
          color: 'error.main',
          mt: 2,
          textAlign: 'center'
        }}
      >
        {fileResult.error || 'Unknown error'}
      </Typography>
    )
  }

  return (
    <Typography
      sx={{
        color: 'success.main',
        mt: 2,
        textAlign: 'center'
      }}
    >
      Success! <Link href={`/view/${fileResult.file?.id}`}>View your credential</Link>
    </Typography>
  )
}

function SimpleCredentialForm() {
  const [fileResult, setFileResult] = useState<FileResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [popupOpen, setPopupOpen] = useState(false)
  const [credentialUrl, setCredentialUrl] = useState('')
  const [extractedFileId, setExtractedFileId] = useState<string | null>(null)
  const { data: session } = useSession()
  const accessToken = session?.accessToken

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value
    setCredentialUrl(url)

    // Extract file ID from Google Drive URL
    const fileId = extractGoogleDriveId(url)
    setExtractedFileId(fileId)
  }

  const handleViewRawData = () => {
    if (!extractedFileId) {
      // Show error or alert that no valid file ID was found
      return
    }
    setPopupOpen(true)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData(event.currentTarget)
    const credentialUrl = formData.get('credentialUrl') as string

    if (!accessToken) {
      setFileResult({
        success: false,
        error: 'Please login first before attempting to import credential'
      })
      setIsLoading(false)
      return
    }

    try {
      const result = await importCredential(credentialUrl, accessToken)
      setFileResult(result)
      setIsLoading(false)
    } catch (error) {
      setFileResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      })
      setIsLoading(false)
    }
  }

  return (
    <Box
      sx={{
        mt: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '32px'
      }}
    >
      <Typography sx={{ fontFamily: 'Lato', fontSize: '24px', fontWeight: 400 }}>
        Credential Import
      </Typography>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <FormLabel sx={{ ...formLabelStyles, mb: 2 }} id='credential-url-label'>
            Enter your credential URL:
          </FormLabel>
          <TextField
            name='credentialUrl'
            value={credentialUrl}
            onChange={handleUrlChange}
            placeholder='https://drive.google.com/file/d/...'
            variant='outlined'
            sx={TextFieldStyles}
            aria-labelledby='credential-url-label'
            inputProps={textFieldInputProps}
            disabled={isLoading}
          />
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}
          {!isLoading && <StatusMessage fileResult={fileResult} />}
        </Box>
      </form>

      {/* Raw Credential Viewer Button */}
      <Box
        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}
      >
        <Typography variant='body2' color='text.secondary'>
          Or view raw credential data from the Google Drive link
        </Typography>
        <Button
          variant='outlined'
          startIcon={<VisibilityIcon />}
          onClick={handleViewRawData}
          disabled={!extractedFileId}
          sx={{
            borderRadius: '8px',
            textTransform: 'none',
            fontFamily: 'Lato'
          }}
        >
          View Raw Credential Data
        </Button>
        {credentialUrl && !extractedFileId && (
          <Typography variant='caption' color='error.main'>
            Please enter a valid Google Drive link to view raw data
          </Typography>
        )}
      </Box>

      {/* Raw Credential Popup */}
      <RawCredentialPopup
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        initialFileId={extractedFileId || ''}
      />
    </Box>
  )
}

export default function Page() {
  return (
    <Box
      sx={{
        minHeight: {
          xs: 'calc(100vh - 182px)',
          md: 'calc(100vh - 255px)'
        },
        display: 'block',
        flexDirection: 'column',
        overflow: 'auto'
      }}
    >
      <SimpleCredentialForm />
    </Box>
  )
}
