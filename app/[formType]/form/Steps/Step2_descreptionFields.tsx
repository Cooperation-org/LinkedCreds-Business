'use client'

import React from 'react'
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
import { usePathname } from 'next/navigation'
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

interface Step2Props {
  register: UseFormRegister<FormData>
  watch: (field: FieldPath<FormData>) => any
  control: any
  errors: FieldErrors<FormData>
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
        label: 'Skill Name (required):',
        required: true,
        autoComplete: true
      },
      {
        name: 'credentialDescription',
        label: 'Skill Description (required):',
        required: true,
        multiline: true,
        rows: 11,
        max: CHAR_LIMIT
      },
      {
        name: 'description',
        label: 'Describe how you earned this skill (required):',
        required: true,
        multiline: true,
        rows: 11,
        max: CHAR_LIMIT
      },
      { name: 'credentialDuration', label: 'Time spent acquiring this skill:' }
    ]
  },
  volunteer: {
    title: 'Step 2',
    description:
      'Now take a moment to describe the volunteer experience you want to document.',
    fields: [
      { name: 'volunteerWork', label: 'Volunteer Role (required):', required: true },
      {
        name: 'volunteerOrg',
        label: 'Volunteer Organization (required):',
        required: true
      },
      {
        name: 'volunteerDescription',
        label: 'Volunteer Description (required):',
        required: true,
        multiline: true,
        rows: 11
      },
      { name: 'timeSpent', label: 'Time spent volunteering:' },
      {
        name: 'skillsGained',
        label: 'Skills gained through volunteering (required):',
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
      { name: 'role', label: 'Your Role (required):', required: true },
      { name: 'company', label: 'Company you work for (required):', required: true }
    ]
  },
  'performance-review': {
    title: 'Step 2',
    description: "Provide some information about the employee you're reviewing.",
    fields: [
      { name: 'company', label: 'Company you work for (required):', required: true },
      { name: 'role', label: 'Your Role (required):', required: true },
      { name: 'employeeName', label: 'Name of Employee (required):', required: true },
      {
        name: 'employeeJobTitle',
        label: 'Employee job title (required):',
        required: true
      }
    ]
  },
  'identity-verification': {
    title: 'Step 2',
    description: 'Provide the basic details from the ID you want to verify.',
    fields: [
      { name: 'documentType', label: 'Document Type (required):', required: true },
      { name: 'documentNumber', label: 'Document Number (required):', required: true },
      { name: 'issuingCountry', label: 'Issuing Country (required):', required: true },
      { name: 'expirationDate', label: 'Expiration Date:' }
    ]
  }
}

export function Step2({ register, watch, control, errors }: Readonly<Step2Props>) {
  const segment = usePathname()?.split('/').filter(Boolean).pop() ?? 'skill'
  const config = formConfigs[segment] || formConfigs.skill

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
          rules={field.required ? { required: field.label.replace(':', '') } : {}}
          render={({ field: ctl, fieldState: { error } }) => (
            <Autocomplete
              freeSolo
              options={skillsList}
              value={ctl.value ?? ''}
              onChange={(_, v) => ctl.onChange(v)}
              onInputChange={(_, v) => ctl.onChange(v)}
              renderInput={params => (
                <TextField
                  {...params}
                  {...commonProps}
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
            field.required ? { required: field.label.replace(':', '') } : {}
          )}
          sx={customTextFieldStyles}
          multiline
          rows={field.rows}
          inputProps={{ maxLength: field.max }}
          error={!!errors[field.name]}
          helperText={
            (errors[field.name]?.message ?? field.max)
              ? `${(watch(field.name) ?? '').length}/${field.max} characters`
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
          field.required ? { required: field.label.replace(':', '') } : {}
        )}
        {...commonProps}
        error={!!errors[field.name]}
        helperText={errors[field.name]?.message}
      />
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
        {config.description}
      </Typography>
      <StepTrackShape />

      {segment !== 'volunteer' &&
        config.fields.map(f => (
          <Box key={f.name} sx={{ width: '100%' }}>
            <FormLabel sx={formLabelStyles}>{f.label}</FormLabel>
            {renderInputField(f)}
          </Box>
        ))}

      {segment === 'volunteer' && (
        <>
          {config.fields.slice(0, 3).map(f => (
            <Box key={f.name} sx={{ width: '100%' }}>
              <FormLabel sx={formLabelStyles}>{f.label}</FormLabel>
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
                  render={({ field }) => <Switch {...field} />}
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
                    placeholder='Ex. 2 years'
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
                  render={({ field }) => <Checkbox {...field} />}
                />
              }
              label='Currently volunteering here'
              sx={{ ml: 0 }}
            />
          </Box>
          {config.fields.slice(3, 4).map(f => (
            <Box key={f.name} sx={{ width: '100%' }}>
              <FormLabel sx={formLabelStyles}>{f.label}</FormLabel>
              {renderInputField(f)}
            </Box>
          ))}
          {config.fields.slice(4).map(f => (
            <Box key={f.name} sx={{ width: '100%' }}>
              <FormLabel sx={formLabelStyles}>{f.label}</FormLabel>
              {renderInputField(f)}
            </Box>
          ))}
        </>
      )}
    </Box>
  )
}
