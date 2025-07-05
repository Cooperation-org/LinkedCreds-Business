'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Paper,
  IconButton
} from '@mui/material'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import CloseIcon from '@mui/icons-material/Close'

interface RawCredentialPopupProps {
  open: boolean
  onClose: () => void
  initialFileId?: string
}

interface CredentialData {
  '@context': string[]
  id: string
  type: string[]
  issuer: {
    id: string
    type: string[]
  }
  issuanceDate: string
  expirationDate: string
  credentialSubject: any
  proof: {
    type: string
    created: string
    verificationMethod: string
    proofPurpose: string
    proofValue: string
  }
}

const RawCredentialPopup: React.FC<RawCredentialPopupProps> = ({
  open,
  onClose,
  initialFileId = ''
}) => {
  const [fileId, setFileId] = useState(initialFileId)
  const [loading, setLoading] = useState(false)
  const [credentialData, setCredentialData] = useState<CredentialData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [snackbar, setSnackbar] = useState<{
    open: boolean
    message: string
    severity: 'success' | 'error'
  }>({
    open: false,
    message: '',
    severity: 'success'
  })

  useEffect(() => {
    setFileId(initialFileId)
  }, [initialFileId])

  useEffect(() => {
    if (open && initialFileId && initialFileId.trim()) {
      setFileId(initialFileId)
      const timer = setTimeout(() => {
        if (initialFileId.trim()) {
          setLoading(true)
          setError(null)
          setCredentialData(null)

          fetch(`/api/credential-raw/${initialFileId}`)
            .then(response => {
              if (!response.ok) {
                return response.json().then(errorData => {
                  throw new Error(
                    errorData.error || `Failed to fetch data: ${response.statusText}`
                  )
                })
              }
              return response.json()
            })
            .then(data => {
              setCredentialData(data)
            })
            .catch(err => {
              setError(
                err instanceof Error ? err.message : 'Failed to fetch credential data'
              )
            })
            .finally(() => {
              setLoading(false)
            })
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [open, initialFileId])

  const handleFetchData = async () => {
    if (!fileId.trim()) {
      setError('Please enter a file ID')
      return
    }

    setLoading(true)
    setError(null)
    setCredentialData(null)

    try {
      const response = await fetch(`/api/credential-raw/${fileId}`)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to fetch data: ${response.statusText}`)
      }

      const data = await response.json()
      setCredentialData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch credential data')
    } finally {
      setLoading(false)
    }
  }

  const handleCopyToClipboard = async () => {
    if (!credentialData) return

    try {
      await navigator.clipboard.writeText(JSON.stringify(credentialData, null, 2))
      setSnackbar({
        open: true,
        message: 'Credential data copied to clipboard!',
        severity: 'success'
      })
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to copy to clipboard',
        severity: 'error'
      })
    }
  }

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }))
  }

  const handleClose = () => {
    setFileId('')
    setCredentialData(null)
    setError(null)
    onClose()
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
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
            View Raw Credential Data
          </Typography>
          <IconButton onClick={handleClose} size='small'>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant='body1' sx={{ mb: 2, color: 'text.secondary' }}>
              Enter a credential file ID to view its raw data
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
              <TextField
                fullWidth
                label='File ID'
                value={fileId}
                onChange={e => setFileId(e.target.value)}
                placeholder='Enter credential file ID'
                error={!!error}
                helperText={error}
                disabled={loading}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    handleFetchData()
                  }
                }}
              />
              <Button
                variant='contained'
                onClick={handleFetchData}
                disabled={loading || !fileId.trim()}
                sx={{ minWidth: '120px' }}
              >
                {loading ? <CircularProgress size={20} /> : 'Fetch Data'}
              </Button>
            </Box>
          </Box>

          {credentialData && (
            <Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <Typography variant='h6' sx={{ fontWeight: 'bold' }}>
                  Raw Credential Data
                </Typography>
                <Button
                  startIcon={<ContentCopyIcon />}
                  onClick={handleCopyToClipboard}
                  variant='outlined'
                  size='small'
                >
                  Copy JSON
                </Button>
              </Box>

              <Paper
                sx={{
                  p: 2,
                  bgcolor: 'grey.50',
                  border: '1px solid',
                  borderColor: 'grey.300',
                  borderRadius: 1,
                  maxHeight: '400px',
                  overflow: 'auto'
                }}
              >
                <pre
                  style={{
                    margin: 0,
                    fontSize: '12px',
                    lineHeight: '1.4',
                    fontFamily: 'monospace',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {JSON.stringify(credentialData, null, 2)}
                </pre>
              </Paper>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleClose} color='primary'>
            Close
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
    </>
  )
}

export default RawCredentialPopup
