'use client'

import React from 'react'
import { Box, Button, CircularProgress } from '@mui/material'

interface ButtonsProps {
  activeStep: number
  handleBack: React.MouseEventHandler<HTMLButtonElement> | undefined
  handleNext: React.MouseEventHandler<HTMLButtonElement> | undefined
  handleSign: React.MouseEventHandler<HTMLButtonElement> | undefined
  isValid: boolean
  handleSaveSession: () => void
  loading: boolean
  isPerformanceReview?: boolean
  maxStepsBeforeSign?: number
}

export function Buttons({
  activeStep,
  handleNext,
  handleSign,
  isValid,
  handleSaveSession,
  loading,
  isPerformanceReview,
  maxStepsBeforeSign
}: Readonly<ButtonsProps>) {
  const actualMaxStepsBeforeSign = (maxStepsBeforeSign ?? isPerformanceReview) ? 5 : 4
  const evidenceUploadStep = isPerformanceReview ? 4 : 3

  return (
    <Box
      sx={{
        width: '100%',
        height: '40px',
        display: 'flex',
        gap: '15px',
        justifyContent: 'center'
      }}
    >
      {activeStep !== 0 && (
        <Button
          sx={{ minWidth: '130px' }}
          onClick={handleSaveSession}
          color='secondary'
          variant='finishButton'
        >
          Save & Exit
        </Button>
      )}
      {activeStep === evidenceUploadStep && (
        <Button variant='finishButton' onClick={handleNext} color='secondary'>
          Skip
        </Button>
      )}
      {activeStep !== actualMaxStepsBeforeSign && activeStep !== 0 && (
        <Button
          onClick={handleNext}
          color='primary'
          disabled={activeStep !== 0 && activeStep !== evidenceUploadStep && !isValid}
          variant='nextButton'
        >
          Next
        </Button>
      )}
      {activeStep === actualMaxStepsBeforeSign && (
        <Button variant='nextButton' onClick={handleSign} color='primary'>
          Finish & Sign
        </Button>
      )}
      {activeStep === actualMaxStepsBeforeSign + 1 && (
        <Button
          onClick={handleNext}
          disabled={loading}
          color='primary'
          variant='nextButton'
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} /> Uploading...
            </>
          ) : (
            'Preview'
          )}
        </Button>
      )}
    </Box>
  )
}
