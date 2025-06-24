'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Switch,
  Tooltip,
  Grid
} from '@mui/material'
import { Controller, useFormContext, Path } from 'react-hook-form'
import { FormData } from '../types/Types'
import InfoIcon from '@mui/icons-material/Info'
import { StepTrackShape } from '../fromTexts & stepTrack/StepTrackShape'

interface PerformanceReviewFieldsProps {}

export const Step3_performanceReviewFields: React.FC<
  PerformanceReviewFieldsProps
> = () => {
  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors }
  } = useFormContext<FormData>()

  const [showDuration, setShowDuration] = useState(false)
  const [overallRatingManuallySet, setOverallRatingManuallySet] = useState(false)

  const jobKnowledgeRating = watch('jobKnowledgeRating')
  const teamworkRating = watch('teamworkRating')
  const initiativeRating = watch('initiativeRating')
  const communicationRating = watch('communicationRating')
  const overallRating = watch('overallRating')

  useEffect(() => {
    if (!overallRatingManuallySet) {
      const ratings = [
        jobKnowledgeRating,
        teamworkRating,
        initiativeRating,
        communicationRating
      ]
      const validRatings = ratings
        .filter(r => r && !isNaN(parseFloat(r)))
        .map(r => parseFloat(r!))
      if (validRatings.length > 0) {
        const average =
          validRatings.reduce((sum, val) => sum + val, 0) / validRatings.length
        setValue('overallRating', average.toFixed(1), { shouldValidate: true })
      }
    }
  }, [
    jobKnowledgeRating,
    teamworkRating,
    initiativeRating,
    communicationRating,
    setValue,
    overallRatingManuallySet
  ])

  useEffect(() => {
    if (showDuration) {
      setValue('reviewStartDate', '')
      setValue('reviewEndDate', '')
    } else {
      setValue('reviewDuration', '')
    }
  }, [showDuration, setValue])

  const ratingFields: Array<{
    name: Path<FormData>
    label: string
  }> = [
    { name: 'jobKnowledgeRating', label: 'Job Knowledge' },
    { name: 'teamworkRating', label: 'Teamwork & Collaboration' },
    { name: 'initiativeRating', label: 'Initiative & Proactivity' },
    { name: 'communicationRating', label: 'Communication Skills' }
  ]

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 1 }}>
        <Typography
          variant='h6'
          component='h2'
          gutterBottom
          sx={{ fontFamily: 'Lato', fontSize: '24px', fontWeight: 400 }}
        >
          Step 3: Performance Review Details
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Lato',
            fontSize: '16px',
            fontWeight: 400,
            maxWidth: '460px',
            margin: '0 auto',
            textAlign: 'center'
          }}
        >
          Please provide the details for the performance review.
        </Typography>
        <StepTrackShape />
      </Box>

      <Grid container spacing={2} alignItems='flex-end'>
        <Grid item xs={12} md={showDuration ? 12 : 6}>
          {showDuration ? (
            <TextField
              label='Review Duration (e.g., Q1 2023, 6 months)'
              variant='outlined'
              fullWidth
              {...register('reviewDuration')}
              error={!!errors.reviewDuration}
              helperText={errors.reviewDuration?.message}
            />
          ) : (
            <TextField
              label='Review Period Start Date'
              type='date'
              variant='outlined'
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('reviewStartDate')}
              error={!!errors.reviewStartDate}
              helperText={errors.reviewStartDate?.message}
            />
          )}
        </Grid>
        {!showDuration && (
          <Grid item xs={12} md={6}>
            <TextField
              label='Review Period End Date'
              type='date'
              variant='outlined'
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register('reviewEndDate')}
              error={!!errors.reviewEndDate}
              helperText={errors.reviewEndDate?.message}
            />
          </Grid>
        )}
        <Grid
          item
          xs={12}
          sx={{ display: 'flex', alignItems: 'center', mt: showDuration ? 1 : 0 }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={showDuration}
                onChange={e => setShowDuration(e.target.checked)}
              />
            }
            label='Show duration instead of exact dates'
          />
          <Tooltip title='If this Performance Review will be made public, setting the review dates to ‘Duration Only’ can help protect the personal details of both the employee and the company.'>
            <InfoIcon sx={{ color: 'action.active', ml: 0.5 }} />
          </Tooltip>
        </Grid>
      </Grid>

      {ratingFields.map(field => (
        <Box key={field.name} sx={{ mb: 2 }}>
          <Typography variant='subtitle1' gutterBottom>
            {field.label}
          </Typography>
          <Controller
            name={field.name}
            control={control}
            render={({ field: controllerField }) => (
              <RadioGroup
                row
                {...controllerField}
                sx={{ justifyContent: 'space-between' }}
              >
                {[1, 2, 3, 4, 5].map(value => (
                  <Box
                    key={value}
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}
                  >
                    <FormControlLabel
                      value={String(value)}
                      control={<Radio />}
                      label={String(value)}
                      labelPlacement='top'
                      sx={{ mr: 0, ml: 0 }}
                    />
                    {value === 1 && (
                      <Typography variant='caption' sx={{ textAlign: 'center' }}>
                        Needs work
                      </Typography>
                    )}
                    {value === 5 && (
                      <Typography variant='caption' sx={{ textAlign: 'center' }}>
                        Excellent
                      </Typography>
                    )}
                  </Box>
                ))}
              </RadioGroup>
            )}
          />
          {errors[field.name as keyof FormData] && (
            <Typography color='error' variant='caption'>
              {errors[field.name as keyof FormData]?.message}
            </Typography>
          )}
        </Box>
      ))}

      <Box
        sx={{
          mb: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant='subtitle1' gutterBottom sx={{ mb: 0, mr: 1 }}>
          Overall Performance Rating:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Controller
            name='overallRating'
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                type='number'
                variant='outlined'
                size='small'
                inputProps={{ step: '0.1', min: '0', max: '5' }}
                sx={{
                  width: '70px',
                  textAlign: 'center',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px'
                }}
                onChange={e => {
                  field.onChange(e.target.value)
                  setOverallRatingManuallySet(true)
                }}
              />
            )}
          />
          <Typography variant='body1' sx={{ ml: 0.5 }}>
            / 5
          </Typography>
        </Box>
      </Box>
      {errors.overallRating && (
        <Typography
          color='error'
          variant='caption'
          sx={{ display: 'block', textAlign: 'right', mt: -2, mb: 1 }}
        >
          {errors.overallRating?.message}
        </Typography>
      )}

      <TextField
        label='Review Comments / Key Achievements'
        placeholder='Enter review comments and key achievements...'
        variant='outlined'
        fullWidth
        multiline
        rows={4}
        {...register('reviewComments')}
        error={!!errors.reviewComments}
        helperText={errors.reviewComments?.message}
      />

      <TextField
        label='Goals for Next Period / Areas for Development'
        placeholder='Enter goals and areas for development...'
        variant='outlined'
        fullWidth
        multiline
        rows={4}
        {...register('goalsNext')}
        error={!!errors.goalsNext}
        helperText={errors.goalsNext?.message}
      />
    </Box>
  )
}

export default Step3_performanceReviewFields
