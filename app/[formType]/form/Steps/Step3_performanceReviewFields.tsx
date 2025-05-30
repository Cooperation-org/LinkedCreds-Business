'use client'

import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  FormLabel,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Slider,
  Switch,
  Tooltip,
  IconButton
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import { Controller, UseFormRegister, FieldErrors, FieldPath } from 'react-hook-form'
import { FormData } from '../types/Types'
import { StepTrackShape } from '../fromTexts & stepTrack/StepTrackShape'
import { SVGDescribeBadge } from '../../../Assets/SVGs'
import {
  formLabelStyles,
  TextFieldStyles,
  inputPropsStyles,
  CustomTextField,
  customTextFieldStyles
} from '../../../components/Styles/appStyles'

interface RatingOption {
  value: string
  label: string
}

const ratingOptions: RatingOption[] = [
  { value: '1', label: '1 - Needs Work' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5', label: '5 - Excelling' }
]

interface Step3PerformanceReviewProps {
  register: UseFormRegister<FormData>
  watch: (field: FieldPath<FormData>) => any
  control: any
  errors: FieldErrors<FormData>
  setValue: any
}

export function Step3_performanceReviewFields({
  register,
  watch,
  control,
  errors,
  setValue
}: Readonly<Step3PerformanceReviewProps>) {
  const overallRatingValue = watch('overallRating')
  const [showDuration, setShowDuration] = useState(false)

  const jobKnowledge = watch('jobKnowledgeRating')
  const teamwork = watch('teamworkRating')
  const initiative = watch('initiativeRating')
  const communication = watch('communicationRating')

  const [lastAutoCalculatedOverall, setLastAutoCalculatedOverall] = useState<
    string | undefined
  >(undefined)
  const [overallRatingManuallySet, setOverallRatingManuallySet] = useState(false)

  useEffect(() => {
    if (overallRatingManuallySet) return

    const ratings = [jobKnowledge, teamwork, initiative, communication]
      .map(r => parseInt(r, 10))
      .filter(r => !isNaN(r) && r >= 1 && r <= 5)

    if (ratings.length > 0) {
      const average = Math.round(
        ratings.reduce((sum, val) => sum + val, 0) / ratings.length
      )
      const averageString = String(average)

      setValue('overallRating', averageString)
      setLastAutoCalculatedOverall(averageString)
    } else {
    }
  }, [
    jobKnowledge,
    teamwork,
    initiative,
    communication,
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

  const tooltipText =
    "If this Performance Review will be made public, setting the review dates to 'Duration Only' can help protect the personal details of both the employee and the company."

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 1,
          mb: 2
        }}
      >
        <SVGDescribeBadge />
        <Typography
          variant='h5'
          component='h1'
          sx={{ fontFamily: 'Lato', fontWeight: 'bold', textAlign: 'center' }}
        >
          Step 3
        </Typography>
        <Typography
          variant='body1'
          sx={{ fontFamily: 'Lato', textAlign: 'center', mb: 1 }}
        >
          Now take a moment to describe the performance review you want to document.
        </Typography>
        <StepTrackShape />
      </Box>

      <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {!showDuration ? (
          <>
            <Box>
              <FormLabel sx={formLabelStyles}>Start of Review Period:</FormLabel>
              <TextField
                type='date'
                variant='outlined'
                sx={TextFieldStyles}
                InputProps={{ style: inputPropsStyles }}
                {...register('reviewStartDate')}
                error={!!errors.reviewStartDate}
                helperText={errors.reviewStartDate?.message}
                fullWidth
              />
            </Box>

            <Box>
              <FormLabel sx={formLabelStyles}>End of Review Period:</FormLabel>
              <TextField
                type='date'
                variant='outlined'
                sx={TextFieldStyles}
                InputProps={{ style: inputPropsStyles }}
                {...register('reviewEndDate')}
                error={!!errors.reviewEndDate}
                helperText={errors.reviewEndDate?.message}
                fullWidth
              />
            </Box>
          </>
        ) : (
          <Box>
            <FormLabel sx={formLabelStyles}>Review Duration:</FormLabel>
            <TextField
              type='text'
              variant='outlined'
              placeholder='e.g., 3 months, 1 year'
              sx={TextFieldStyles}
              InputProps={{ style: inputPropsStyles }}
              {...register('reviewDuration')}
              error={!!errors.reviewDuration}
              helperText={errors.reviewDuration?.message}
              fullWidth
            />
          </Box>
        )}

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mt: 1
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={showDuration}
                onChange={e => {
                  setShowDuration(e.target.checked)
                }}
              />
            }
            label='Show duration instead of exact dates'
          />
          <Tooltip title={tooltipText}>
            <IconButton size='small'>
              <InfoIcon fontSize='small' />
            </IconButton>
          </Tooltip>
        </Box>

        <Box>
          <FormLabel sx={formLabelStyles}>Job Knowledge rating:</FormLabel>
          <Controller
            name='jobKnowledgeRating'
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                {ratingOptions.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                    sx={{ mr: 1 }}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </Box>

        <Box>
          <FormLabel sx={formLabelStyles}>Teamwork rating:</FormLabel>
          <Controller
            name='teamworkRating'
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                {ratingOptions.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                    sx={{ mr: 1 }}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </Box>

        <Box>
          <FormLabel sx={formLabelStyles}>Initiative rating:</FormLabel>
          <Controller
            name='initiativeRating'
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                {ratingOptions.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                    sx={{ mr: 1 }}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </Box>

        <Box>
          <FormLabel sx={formLabelStyles}>Communication rating:</FormLabel>
          <Controller
            name='communicationRating'
            control={control}
            render={({ field }) => (
              <RadioGroup row {...field}>
                {ratingOptions.map(option => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio />}
                    label={option.label}
                    sx={{ mr: 1 }}
                  />
                ))}
              </RadioGroup>
            )}
          />
        </Box>

        <Box>
          <FormLabel sx={formLabelStyles}>
            Overall Performance rating: {overallRatingValue ?? '-'} / 5
          </FormLabel>
          <Controller
            name='overallRating'
            control={control}
            defaultValue=''
            render={({ field }) => (
              <Slider
                value={Number(field.value) || 0}
                onChange={(_, newValue) => {
                  field.onChange(String(newValue))
                  if (!overallRatingManuallySet) {
                    setOverallRatingManuallySet(true)
                  }
                }}
                aria-labelledby='overall-performance-rating-slider'
                valueLabelDisplay='auto'
                step={1}
                marks
                min={1}
                max={5}
                sx={{ width: '95%', ml: '2.5%' }}
              />
            )}
          />
        </Box>

        <Box>
          <FormLabel sx={formLabelStyles}>Review Comments (optional):</FormLabel>
          <CustomTextField
            placeholder='Example: Employee showed good initiative in taking on responsibilities for new projects.'
            multiline
            rows={4}
            sx={customTextFieldStyles}
            InputProps={{ style: inputPropsStyles }}
            {...register('reviewComments')}
          />
        </Box>

        <Box>
          <FormLabel sx={formLabelStyles}>Goals for next period (optional):</FormLabel>
          <CustomTextField
            placeholder='Example: Employee should work on collaborating more with other team members and taking charge when his expertise is required.'
            multiline
            rows={4}
            sx={customTextFieldStyles}
            InputProps={{ style: inputPropsStyles }}
            {...register('goalsNext')}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default Step3_performanceReviewFields
