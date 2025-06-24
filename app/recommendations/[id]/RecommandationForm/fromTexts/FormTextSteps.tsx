'use client'

import React from 'react'
import { Box, Typography } from '@mui/material'

export const textGuid = (fullName: string, credentialType?: string) => {
  const getCredentialTypeLabel = (type?: string) => {
    if (!type) return 'skill'

    switch (type.toLowerCase()) {
      case 'employmentcredential':
      case 'employment':
      case 'role':
        return 'employment experience'
      case 'volunteeringcredential':
      case 'volunteering':
      case 'volunteer':
        return 'volunteer experience'
      case 'performancereviewcredential':
      case 'performance-review':
      case 'performancereview':
        return 'performance review'
      case 'skill':
      default:
        return 'skill'
    }
  }

  const credentialLabel = getCredentialTypeLabel(credentialType)

  return [
    React.createElement(
      React.Fragment,
      null,
      "Hi, I'm Tessa! ",
      React.createElement('br'),
      ' Where do you want to save your LinkedCreds - Business?'
    ),
    React.createElement(
      React.Fragment,
      null,
      'First, choose where to save your recommendation. ',
      React.createElement('span', { style: { color: 'red' } }, '*')
    ),
    React.createElement(
      React.Fragment,
      null,
      'Now tell us more about you and how you know ',
      fullName,
      '. '
    ),
    React.createElement(
      React.Fragment,
      null,
      'Thanks! ',
      React.createElement('br'),
      ' Now share your recommendation and how you know ',
      fullName,
      '.'
    ),
    React.createElement(
      React.Fragment,
      null,
      'Thanks! ',
      React.createElement('br'),
      ' Now share your recommendation for ',
      fullName,
      "'s ",
      credentialLabel,
      '. ',
      React.createElement('br'),
      ' Do you have evidence to share?'
    ),
    React.createElement(
      React.Fragment,
      null,
      'Well done! ',
      React.createElement('br'),
      " Here's what you've created:"
    ),
    React.createElement(
      React.Fragment,
      null,
      'Your recommendation has been saved to Google Drive!'
    ),
    'Success!'
  ]
}

export const storageOptionNote =
  "Your recommendation will be stored in the location you select. This will ensure it can be linked to the individual's credential once you're finished:"

export const CredentialViewText = (fullName: string, credentialType?: string) => {
  const getCredentialTypeLabel = (type?: string) => {
    if (!type) return 'skill'

    switch (type.toLowerCase()) {
      case 'employmentcredential':
      case 'employment':
      case 'role':
        return 'employment experience'
      case 'volunteeringcredential':
      case 'volunteering':
      case 'volunteer':
        return 'volunteer experience'
      case 'performancereviewcredential':
      case 'performance-review':
      case 'performancereview':
        return 'performance review'
      case 'skill':
      default:
        return 'skill'
    }
  }

  const credentialLabel = getCredentialTypeLabel(credentialType)
  return `Hi, I'm Tessa! I'll help you with ${fullName}'s ${credentialLabel} recommendation.`
}

export const StorageText =
  "Your recommendation will be stored in the location you select. This will ensure it can be linked to the individual's credential once you're finished:"

export const featuresRecommentations = (fullName: string, credentialType?: string) => {
  const getCredentialTypeLabel = (type?: string) => {
    if (!type) return 'skills'

    switch (type.toLowerCase()) {
      case 'employmentcredential':
      case 'employment':
      case 'role':
        return 'employment performance'
      case 'volunteeringcredential':
      case 'volunteering':
      case 'volunteer':
        return 'volunteer contributions'
      case 'performancereviewcredential':
      case 'performance-review':
      case 'performancereview':
        return 'performance review outcomes'
      case 'skill':
      default:
        return 'skills'
    }
  }

  const credentialLabel = getCredentialTypeLabel(credentialType)

  return [
    {
      id: 1,
      name: `How you know ${fullName}`,
      description: `Provide details on how you know ${fullName}, including the context of your relationship and the duration.`
    },
    {
      id: 2,
      name: 'Proof of your qualifications',
      description:
        'Attach or mention any relevant qualifications or certifications that support your expertise.'
    },
    {
      id: 3,
      name: `Comment on ${fullName}'s ${credentialLabel}`,
      description: `Share specific examples of ${fullName}'s ${credentialLabel}, strengths, and contributions in relevant projects or roles.`
    },
    {
      id: 4,
      name: 'Any additional evidence, if available',
      description:
        'Include any other supporting documents or evidence that can strengthen the recommendation.'
    }
  ]
}

interface FormTextStepsProps {
  activeStep: number
  activeText: any
}

const FormTextSteps: React.FC<FormTextStepsProps> = ({ activeStep, activeText }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        textAlign: 'center',
        height: '50px'
      }}
    >
      <Typography variant='formTextStep'>{activeText[activeStep]}</Typography>
    </Box>
  )
}

export default FormTextSteps

export function SuccessText() {
  return (
    <Typography variant='successText'>
      Congratulations on your achievement. Tell the world what you have accomplished!
    </Typography>
  )
}

export function NoteText() {
  return (
    <Typography variant='noteText'>
      Please note, all fields marked with an asterisk are required and must be completed.
    </Typography>
  )
}

export function StorageOptionNote() {
  return <Typography variant='noteText'>{storageOptionNote}</Typography>
}
