'use client'

import { useSession } from 'next-auth/react'
import { useState, useRef, useEffect, useCallback } from 'react'
import useGoogleDrive from '../hooks/useGoogleDrive' // Adjusted path
import { CredentialEngine } from '@cooperation/vc-storage'
import { Box, Typography, TextField, Button } from '@mui/material'
import { useFormContext } from 'react-hook-form'

type VerificationState = 'idle' | 'sending' | 'sent' | 'verifying' | 'verified' | 'error'

export interface EmailVerificationComponentProps {
  // Exporting interface for clarity
  onVerificationSuccess?: () => void
}

export const EmailVerificationComponent = ({
  onVerificationSuccess
}: EmailVerificationComponentProps) => {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [state, setState] = useState<VerificationState>('idle')
  const [error, setError] = useState('')
  const { data: session } = useSession()
  const { storage } = useGoogleDrive()
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const formContext = useFormContext() // Call hook unconditionally
  const emailFromForm = formContext ? formContext.watch('email') : undefined

  const email = emailFromForm || session?.user?.email || ''

  const sendVerificationCode = useCallback(async () => {
    if (!email) {
      setError('Email address is not available.')
      setState('error')
      return
    }
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
  }, [email])

  useEffect(() => {
    if (email && state === 'idle') {
      sendVerificationCode()
    }
  }, [email, state, sendVerificationCode])

  const verifyCode = async (codeToVerify?: string[]) => {
    if (!email) {
      setError('Email address is not available for verification.')
      setState('error')
      return
    }
    try {
      setState('verifying')
      setError('')

      const codeString = (codeToVerify || code).join('')
      const response = await fetch('/api/verification/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: codeString })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Invalid verification code')
      }

      if (!storage) {
        throw new Error('Storage not initialized')
      }

      const engine = new CredentialEngine(storage)
      const encodedSeed = process.env.NEXT_PUBLIC_ENCODED_SEED
      if (!encodedSeed) {
        throw new Error('Encoded seed is not set in environment variables')
      }

      await engine.generateAndSignEmailVC(email, encodedSeed)
      setState('verified')
      if (onVerificationSuccess) {
        onVerificationSuccess()
      }
    } catch (err) {
      console.error('Verification error:', err)
      setState('error')
      setError(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pasted = value.split('').slice(0, 6)
      const newCode = [...code]
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < 6) {
          newCode[index + i] = pasted[i]
        }
      }
      setCode(newCode)
      const lastFilled = Math.min(index + pasted.length - 1, 5)
      inputRefs.current[lastFilled]?.focus()
      if (newCode.every(digit => digit !== '')) {
        setTimeout(() => verifyCode(newCode), 100)
      }
      return
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

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
      {(state === 'idle' || state === 'sending') && !error && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '16px', color: '#64748B' }}>
            Sending verification code to {email}...
          </Typography>
        </Box>
      )}

      {state === 'sent' && !error && (
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
                    '& fieldset': { borderColor: '#D1D5DB' },
                    '&:hover fieldset': { borderColor: '#9CA3AF' },
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

      {state === 'verifying' && !error && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: '16px', color: '#64748B' }}>
            Verifying code...
          </Typography>
        </Box>
      )}

      {state === 'verified' && !error && (
        <Box sx={{ textAlign: 'center' }}>
          <Box
            sx={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              bgcolor: '#E0F7EF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: 2,
              color: '#0D9276'
            }}
          >
            <svg width='32' height='32' viewBox='0 0 24 24' fill='currentColor'>
              <path d='M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z' />
            </svg>
          </Box>
          <Typography sx={{ fontSize: '20px', fontWeight: 600, color: '#2C3E50', mb: 1 }}>
            Email Verified
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#64748B' }}>
            Your email address ({email}) has been successfully verified.
          </Typography>
        </Box>
      )}

      {error && (
        <Box
          sx={{
            textAlign: 'center',
            width: '100%',
            p: 2,
            bgcolor: '#FFEBEE',
            borderRadius: '8px',
            border: '1px solid #FFCDD2'
          }}
        >
          <Typography sx={{ fontSize: '16px', fontWeight: 500, color: '#D32F2F', mb: 1 }}>
            Verification Error
          </Typography>
          <Typography sx={{ fontSize: '14px', color: '#B71C1C' }}>{error}</Typography>
          {state === 'error' && email && (
            <Button
              variant='outlined'
              onClick={handleResend}
              sx={{
                mt: 2,
                color: '#4F8EF7',
                borderColor: '#4F8EF7',
                '&:hover': { borderColor: '#4F8EF7', bgcolor: 'rgba(79, 142, 247, 0.08)' }
              }}
            >
              Resend Code
            </Button>
          )}
        </Box>
      )}
    </Box>
  )
}
