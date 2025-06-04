'use client'

import { useSession } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'
import useGoogleDrive from '../hooks/useGoogleDrive'
import { CredentialEngine } from '@cooperation/vc-storage'
import { Box, Typography, TextField, Button } from '@mui/material'
import { useFormContext } from 'react-hook-form'

type VerificationState = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error'

interface EmailVerificationProps {
  onVerificationSuccess?: () => void
}

const EmailVerification = ({ onVerificationSuccess }: EmailVerificationProps) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [state, setState] = useState<VerificationState>('idle')
  const [error, setError] = useState('')
  const { data: session } = useSession()
  const { storage } = useGoogleDrive()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const { watch } = useFormContext()
  const email = watch('email') || ''

  useEffect(() => {
    // Auto-send verification code when component mounts and email is available
    if (email && state === 'idle') {
      sendVerificationCode()
    }
  }, [email, state])

  const sendVerificationCode = async () => {
    try {
      setState('sending')
      setError('')

      const response = await fetch('/api/verification/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send verification code')
      }

      setState('sent')
    } catch (err) {
      console.error('Error sending code:', err)
      setState('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const verifyCode = async (codeToVerify?: string[]) => {
    try {
      setState('verifying')
      setError('')

      const codeString = (codeToVerify || code).join('')
      console.log(': verifyCode codeString', codeString)
      const response = await fetch('/api/verification/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeString })
      })
      console.log(': verifyCode response', response)

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      if (!storage) {
        throw new Error('Storage not initialized')
      }

      // Initialize credential engine with storage
      const engine = new CredentialEngine(storage)

      const encodedSeed = process.env.NEXT_PUBLIC_ENCODED_SEED
      if (!encodedSeed) {
        throw new Error('Encoded seed is not set in environment variables')
      }

      // Generate and sign email VC
      const result = await engine.generateAndSignEmailVC(email, encodedSeed)
      console.log('Generated email VC:', result)

      setState('verified')
      if (onVerificationSuccess) {
        onVerificationSuccess()
      }
    } catch (err) {
      // setState('verified')
      // if (onVerificationSuccess) {
      //   onVerificationSuccess()
      // }

      console.error('Verification error:', err)
      setState('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent pasting multiple characters

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Auto-verify when all fields are filled
    if (newCode.every(digit => digit !== '') && value) {
      setTimeout(() => verifyCode(newCode), 100)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleResend = () => {
    setCode(['', '', '', '', '', ''])
    setError('')
    sendVerificationCode()
  }

  const isCodeComplete = code.every(digit => digit !== '')

  return (
    <Box
      sx={{
        mt: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        maxWidth: '400px',
        margin: '0 auto'
      }}
    >
      {(state === 'sending' || state === 'idle') && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '16px', color: '#64748B' }}>
            Sending verification code...
          </Typography>
        </Box>
      )}

      {state === 'sent' && (
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#2C3E50', mb: 2 }}>
            Enter verification code
          </Typography>

          <Typography
            sx={{ fontSize: '14px', color: '#64748B', mb: 4, textAlign: 'center' }}
          >
            We have sent a 6-digit code to {email}. Enter the code below to verify your
            email.
          </Typography>

          <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#374151', mb: 2 }}>
            Verification Code (required):
          </Typography>

          <Box sx={{ display: 'flex', gap: '12px', justifyContent: 'center', mb: 3 }}>
            {code.map((digit, index) => (
              <TextField
                key={index}
                inputRef={el => {
                  inputRefs.current[index] = el
                }}
                value={digit}
                onChange={e => handleCodeChange(index, e.target.value)}
                onKeyDown={e => handleKeyDown(index, e)}
                inputProps={{
                  maxLength: 1,
                  style: {
                    textAlign: 'center',
                    fontSize: '20px',
                    fontWeight: 600,
                    padding: '16px'
                  }
                }}
                sx={{
                  width: '48px',
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                    '& fieldset': {
                      borderColor: '#D1D5DB'
                    },
                    '&:hover fieldset': {
                      borderColor: '#9CA3AF'
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4F8EF7',
                      borderWidth: '2px'
                    }
                  }
                }}
              />
            ))}
          </Box>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography sx={{ fontSize: '14px', color: '#64748B' }}>
              Didn&apos;t receive a code?{' '}
              <Typography
                component='span'
                onClick={handleResend}
                sx={{
                  color: '#4F8EF7',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: 500
                }}
              >
                Resend
              </Typography>
            </Typography>
          </Box>
        </Box>
      )}

      {state === 'verifying' && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '16px', color: '#64748B' }}>
            Verifying code...
          </Typography>
        </Box>
      )}

      {state === 'verified' && (
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              p: 3,
              backgroundColor: '#DCFCE7',
              borderRadius: '8px',
              border: '1px solid #BBF7D0',
              mb: 3
            }}
          >
            <Typography sx={{ fontSize: '16px', color: '#166534', fontWeight: 500 }}>
              ✓ Your email has been successfully verified!
            </Typography>
          </Box>
        </Box>
      )}

      {state === 'error' && (
        <Box sx={{ textAlign: 'center', width: '100%' }}>
          <Box
            sx={{
              p: 3,
              backgroundColor: '#FEF2F2',
              borderRadius: '8px',
              border: '1px solid #FECACA',
              mb: 3
            }}
          >
            <Typography sx={{ fontSize: '14px', color: '#DC2626' }}>{error}</Typography>
          </Box>
          <Button
            onClick={handleResend}
            variant='contained'
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: '#4F8EF7',
              borderRadius: '8px',
              textTransform: 'none',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: '#3B82F6'
              }
            }}
          >
            Try Again
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default EmailVerification
