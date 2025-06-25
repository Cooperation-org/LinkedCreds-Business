'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  FormLabel,
  TextField,
  Autocomplete,
  Switch,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import { Controller, FieldErrors, FieldPath, UseFormRegister } from 'react-hook-form'
import {
  inputPropsStyles,
  TextFieldStyles,
  formLabelStyles,
  CustomTextField,
  customTextFieldStyles
} from '../../../components/Styles/appStyles'
import { FormData } from '../types/Types'
import { StepTrackShape } from '../fromTexts & stepTrack/StepTrackShape'
import { SVGDescribeBadge } from '../../../Assets/SVGs'
import { EmailVerificationComponent } from '../../../verifyEmail/EmailVerificationComponent'

interface Step2Props {
  register: UseFormRegister<FormData>
  watch: (field: FieldPath<FormData>) => any
  control: any
  errors: FieldErrors<FormData>
  setValue: any
  formType: string
}

const skillsList = [
  'Leadership',
  'Customer Service',
  'Landscape Design',
  'Software Development'
]

type FieldDef = {
  name: FieldPath<FormData>
  label: string
  required?: boolean
  multiline?: boolean
  rows?: number
  max?: number
  autoComplete?: boolean
}

type Config = { title: string; description: string; fields: FieldDef[] }

const CHAR_LIMIT = 294

const formConfigs: Record<string, Config> = {
  skill: {
    title: 'Step 2',
    description:
      'Now take a moment to describe the skill or experience you want to document.',
    fields: [
      {
        name: 'credentialName',
        label: 'Skill Name',
        required: true,
        autoComplete: true
      },
      {
        name: 'credentialDescription',
        label: 'Skill Description',
        required: true,
        multiline: true,
        rows: 11,
        max: CHAR_LIMIT
      },
      {
        name: 'description',
        label: 'How you earned this skill',
        required: true,
        multiline: true,
        rows: 11,
        max: CHAR_LIMIT
      },
      { name: 'credentialDuration', label: 'Time spent acquiring this skill' }
    ]
  },
  volunteer: {
    title: 'Step 2',
    description:
      'Now take a moment to describe the volunteer experience you want to document.',
    fields: [
      { name: 'volunteerWork', label: 'Volunteer Role', required: true },
      {
        name: 'volunteerOrg',
        label: 'Volunteer Organization',
        required: true
      },
      {
        name: 'volunteerDescription',
        label: 'Volunteer Description',
        required: true,
        multiline: true,
        rows: 11
      },
      // { name: 'timeSpent', label: 'Time spent volunteering' }, // Removed - redundant with Volunteer Dates section
      {
        name: 'skillsGained',
        label: 'Skills gained through volunteering',
        required: true,
        multiline: true,
        rows: 11
      }
    ]
  },
  role: {
    title: 'Step 2',
    description: 'Provide some information about your position.',
    fields: [
      { name: 'role', label: 'Your Role', required: true },
      { name: 'company', label: 'Company you work for', required: true }
    ]
  },
  'performance-review': {
    title: 'Step 2',
    description: "Provide some information about the employee you're reviewing.",
    fields: [
      { name: 'company', label: 'Company you work for', required: true },
      { name: 'role', label: 'Your Role', required: true },
      { name: 'employeeName', label: 'Name of Employee', required: true },
      {
        name: 'employeeJobTitle',
        label: 'Employee job title',
        required: true
      }
    ]
  },
  'identity-verification': {
    title: 'Step 2',
    description: 'Provide the basic details from the ID you want to verify.',
    fields: [
      { name: 'documentType', label: 'Document Type', required: true },
      { name: 'documentNumber', label: 'Document Number', required: true },
      { name: 'issuingCountry', label: 'Issuing Country', required: true },
      { name: 'expirationDate', label: 'Expiration Date' }
    ]
  }
}

export function Step2({
  register,
  watch,
  control,
  errors,
  setValue,
  formType
}: Readonly<Step2Props>) {
  const [isEmailVerified, setIsEmailVerified] = useState(false)
  const config = formConfigs[formType] || formConfigs.skill

  const renderInputField = (field: FieldDef) => {
    const placeholder = `Example: ${field.label
      .replace(/:\s*$/, '')
      .replace(/\(.*\)/, '')
      .trim()}`
    const commonProps = {
      placeholder,
      variant: 'outlined' as const,
      sx: TextFieldStyles,
      inputProps: { style: inputPropsStyles }
    }

    if (field.autoComplete) {
      return (
        <Controller
          key={field.name}
          name={field.name}
          control={control}
          rules={field.required ? { required: `${field.label} is required` } : {}}
          render={({ field: ctl, fieldState: { error } }) => (
            <Autocomplete
              freeSolo
              options={skillsList}
              value={ctl.value ?? ''}
              onChange={(_, v) => {
                ctl.onChange(v)
              }}
              onInputChange={(_, v) => {
                ctl.onChange(v)
              }}
              renderInput={params => (
                <TextField
                  {...params}
                  {...commonProps}
                  placeholder={commonProps.placeholder}
                  variant={commonProps.variant}
                  sx={commonProps.sx}
                  inputProps={{
                    ...params.inputProps,
                    style: {
                      ...params.inputProps?.style,
                      ...commonProps.inputProps.style
                    }
                  }}
                  error={!!error}
                  helperText={error?.message}
                />
              )}
            />
          )}
        />
      )
    }
    if (field.multiline) {
      return (
        <CustomTextField
          key={field.name}
          {...register(
            field.name,
            field.required ? { required: `${field.label} is required` } : {}
          )}
          sx={customTextFieldStyles}
          multiline
          rows={field.rows}
          inputProps={{ maxLength: field.max }}
          error={!!errors[field.name]}
          helperText={
            (errors[field.name]?.message ?? field.max)
              ? `${String(watch(field.name) ?? '').length}/${field.max} characters`
              : ''
          }
          placeholder={placeholder}
        />
      )
    }
    return (
      <TextField
        key={field.name}
        {...register(
          field.name,
          field.required ? { required: `${field.label} is required` } : {}
        )}
        {...commonProps}
        error={!!errors[field.name]}
        helperText={errors[field.name]?.message}
      />
    )
  }

  // For role type, show email verification first, then fields after verification
  if (formType === 'role' && !isEmailVerified) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          alignItems: 'center'
        }}
      >
        <SVGDescribeBadge />
        <Typography sx={{ fontFamily: 'Lato', fontSize: '24px', fontWeight: 400 }}>
          {config.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: 'Lato',
            fontSize: '16px',
            fontWeight: 400,
            maxWidth: '360px',
            textAlign: 'center'
          }}
        >
          First, let&apos;s verify your email address.
        </Typography>
        <StepTrackShape />
        <EmailVerificationComponent
          onVerificationSuccess={() => setIsEmailVerified(true)}
        />
      </Box>
    )
  }

  return (
    <Box
      sx={{ display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center' }}
    >
      <SVGDescribeBadge />
      <Typography sx={{ fontFamily: 'Lato', fontSize: '24px', fontWeight: 400 }}>
        {config.title}
      </Typography>
      <Typography
        sx={{
          fontFamily: 'Lato',
          fontSize: '16px',
          fontWeight: 400,
          maxWidth: '360px',
          textAlign: 'center'
        }}
      >
        {formType === 'role' && isEmailVerified
          ? 'Great! Now provide some information about your position.'
          : config.description}
      </Typography>
      <StepTrackShape />

      {formType !== 'volunteer' &&
        config.fields.map(f => (
          <Box key={f.name} sx={{ width: '100%' }}>
            <FormLabel sx={formLabelStyles}>
              {f.label}
              {f.required && ' (required)'}
            </FormLabel>
            {renderInputField(f)}
          </Box>
        ))}

      {formType === 'volunteer' && (
        <>
          {config.fields.slice(0, 3).map(f => (
            <Box key={f.name} sx={{ width: '100%' }}>
              <FormLabel sx={formLabelStyles}>
                {f.label}
                {f.required && ' (required)'}
              </FormLabel>
              {renderInputField(f)}
            </Box>
          ))}
          <Box sx={{ width: '100%' }}>
            <FormLabel sx={formLabelStyles}>Volunteer Dates:</FormLabel>
            <FormControlLabel
              control={
                <Controller
                  name='showDuration'
                  control={control}
                  render={({ field }) => (
                    <Switch
                      {...field}
                      onChange={e => {
                        field.onChange(e)
                        setValue('duration', '')
                        setValue('volunteerDates', '')
                      }}
                    />
                  )}
                />
              }
              label='Show duration instead of exact dates'
              sx={{ ml: 0, mb: 1 }}
            />
            <Controller
              name='showDuration'
              control={control}
              render={({ field }) =>
                field.value ? (
                  <TextField
                    {...register('duration')}
                    {...TextFieldStyles}
                    fullWidth
                    placeholder='Time spent volunteering - Ex. 2 years'
                  />
                ) : (
                  <TextField
                    {...register('volunteerDates')}
                    {...TextFieldStyles}
                    fullWidth
                    placeholder='MM/YYYY - MM/YYYY'
                  />
                )
              }
            />
          </Box>
          <Box sx={{ width: '100%' }}>
            <FormControlLabel
              control={
                <Controller
                  name='currentVolunteer'
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      {...field}
                      onChange={e => {
                        field.onChange(e)
                        if (!watch('showDuration')) {
                          const currentValue = watch('volunteerDates') as string
                          if (e.target.checked) {
                            setValue('volunteerDates', `${currentValue} -present`)
                          } else {
                            setValue(
                              'volunteerDates',
                              currentValue.replace(' -present', '')
                            )
                          }
                        }
                      }}
                    />
                  )}
                />
              }
              label='Currently volunteering here'
              sx={{ ml: 0 }}
            />
          </Box>
          {/* Removed timeSpent field - it was redundant with Volunteer Dates section above */}
          {config.fields.slice(3).map(f => (
            <Box key={f.name} sx={{ width: '100%' }}>
              <FormLabel sx={formLabelStyles}>
                {f.label}
                {f.required && ' (required)'}
              </FormLabel>
              {renderInputField(f)}
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}
