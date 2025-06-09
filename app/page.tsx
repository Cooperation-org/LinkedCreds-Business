'use client'
import React from 'react'
import { Box, Button, Typography, useTheme, useMediaQuery, Theme } from '@mui/material'
import Link from 'next/link'
import Card from './components/cards'
interface SectionProps {
  theme: Theme //NOSONAR
}
// Four-card “fan” showcasing every credential type except identity-verification
// Order them left-to-right by using slight rotations (−6°, −2°, +2°, +6°)

export const EXAMPLE_CARDS = [
  // ──────────────────────────────── Skill ────────────────────────────────
  {
    id: 'skill',
    title: 'Elder Medical Carer',
    description:
      'Able to attend to older adults with complex medical needs, delivering both daily assistance and basic clinical care.',
    criteria: [
      'Solo-caretaker certification',
      'Completed 120-hr geriatric-care program',
      'Medication-administration sign-off',
      'Current CPR & First-Aid licence'
    ],
    duration: '5 Years',
    evidence: ['IMG_0630', 'IMG_0624', 'IMG_0640'],
    width: '200px',
    height: '360px',
    rotation: 'rotate(-6deg)',
    image: '/caretaker.jpeg',
    showPlayButton: false,
    showTimer: false
  },

  // ──────────────────────── Performance-Review ───────────────────────────
  {
    id: 'performance-review',
    title: '2025 Performance Review',
    description:
      'Summary of annual review covering job knowledge, teamwork, initiative, and communication.',
    criteria: [
      'Job Knowledge — 4/5',
      'Teamwork — 5/5',
      'Initiative — 4/5',
      'Communication — 4/5'
    ],
    duration: 'Jan – Dec 2024',
    evidence: ['Review_Form.pdf', 'Manager_Comments.txt'],
    width: '200px',
    height: '360px',
    rotation: 'rotate(-2deg)',
    image: '/performance.jpg',
    showPlayButton: true,
    showTimer: true
  },

  // ──────────────────────────────── Role ────────────────────────────────
  {
    id: 'role',
    title: 'Product Manager – FinTech Solutions',
    description:
      'Responsible for roadmap planning, cross-functional coordination, and driving go-to-market success for digital-payments platform.',
    criteria: [
      'Led three major feature launches',
      'Managed $2 M annual budget',
      'Supervised 8-person scrum team'
    ],
    duration: '2 Years',
    evidence: ['OKR_Dashboard.png', 'Launch_Playbook.pdf'],
    width: '200px',
    height: '360px',
    rotation: 'rotate(2deg)',
    image: '/product-manager.webp',
    showPlayButton: false,
    showTimer: false
  },

  // ──────────────────────────── Volunteer ───────────────────────────────
  {
    id: 'volunteer',
    title: 'Community Garden Volunteer',
    description:
      'Organised weekly sessions to cultivate organic produce and deliver it to local shelters.',
    criteria: [
      'Planned 25 community events',
      'Taught 60+ residents sustainable gardening',
      'Logged 300 volunteer hours'
    ],
    duration: '18 Months',
    evidence: ['Garden_Presentation.pptx', 'IMG_0720'],
    width: '200px',
    height: '360px',
    rotation: 'rotate(6deg)',
    image: '/volunteer.jpg',
    showPlayButton: true,
    showTimer: true
  }
]

const STEPS = [
  {
    id: 'capture',
    title: '1. Describe your employees contributions',
    icon: '/Document.svg',
    description:
      'Add your employees’ skills and experiences, from volunteering, special projects, or employee job performance advancing your business.'
  },
  {
    id: 'validate',
    title: '2. Add validation',
    icon: '/Human Insurance.svg',
    description:
      'Upload proof supporting your credentials and request recommendations from employee supervisors and others.'
  },
  {
    id: 'share',
    title: '3. Share',
    icon: '/Network.svg',
    description:
      'Share employee skills with supervisors, add them to personnel records, or upload them to LinkedIn.'
  }
]

const LinkedCreds_FEATURES = [
  { id: 'verifiable', text: 'Verifiable' },
  { id: 'shareable', text: 'Shareable' },
  { id: 'tamper-proof', text: 'Tamper proof' },
  { id: 'beautiful', text: 'Presented beautifully' },
  { id: 'ownership', text: 'Owned by you' },
  { id: 'control', text: 'You control access' },
  { id: 'no-degree', text: "Don't require a degree" }
]

const HeroSection: React.FC<SectionProps & { showCards: boolean }> = ({ showCards }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        justifyContent: 'space-between',
        alignItems: 'center',
        ml: 'auto',
        mr: 'auto',
        width: { xs: '100%', md: '100%' },
        maxWidth: '1400px',
        px: { xs: 2, md: 'auto' },
        pb: 4,
        pt: { xs: '43px', md: '75px' },
        mb: { xs: 0, md: '100px' }
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: '40vw' },
          maxWidth: { xs: '100%', md: '771px' },
          textAlign: 'left',
          alignSelf: { xs: 'center', md: 'flex-start' },
          pr: { xs: 0, md: 0 },
          mr: { xs: 0, md: '71px' },
          height: { xs: 'auto', md: '432px' }
          // mt: { xs: '43px', md: 0 }
        }}
      >
        <Typography
          variant='h2'
          sx={{
            color: theme.palette.t3Black,
            mb: { xs: '15px', md: '10px' },
            fontFamily: 'poppins',
            fontSize: { xs: '30px', md: '50px' },
            fontWeight: 'bolder',
            lineHeight: { xs: '37.5px', md: '62.5px' },
            maxWidth: { xs: '360px', md: '771px' }
          }}
        >
          {isMobile ? (
            'Showcase LERs designed for your business'
          ) : (
            <>
              Showcase LERs designed
              <br />
              for your business
            </>
          )}
        </Typography>

        <Typography
          variant='body1'
          sx={{
            color: theme.palette.t3BodyText,
            mb: '30px',
            fontSize: { xs: '16px', md: '18px' },
            lineHeight: '22.5px'
          }}
        >
          {isMobile ? (
            'Whether enabling collaborative Performance Reviews, creating digital Employment Credentials for employees, recognizing staff Volunteerism or documenting employee skills that supervisors can endorse, LinkedCreds for Business gives you the tools to issue verifiable credentials you can use.'
          ) : (
            <>
              Whether enabling collaborative Performance Reviews, creating digital
              Employment Credentials for employees,
              <br />
              recognizing staff Volunteerism or documenting employee skills that
              supervisors can endorse,
              <br />
              LinkedCreds for Business gives you the tools to issue verifiable credentials
              you can use.
            </>
          )}
        </Typography>

        <Link href='/newcredential' passHref>
          <Button
            variant='contained'
            sx={{
              backgroundColor: theme.palette.t3ButtonBlue,
              color: '#FFFFFF',
              width: '220px',
              maxHeight: { xs: '40px', md: '52px' },
              borderRadius: '100px',
              py: '22px',
              px: '20px',
              textTransform: 'none',
              fontSize: '16px',
              fontFamily: 'Roboto',
              lineHeight: '20px',
              fontWeight: '500',
              mb: { xs: '19px', md: 0 }
            }}
          >
            Build your credential
          </Button>
        </Link>
      </Box>

      {showCards && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {EXAMPLE_CARDS.map(card => (
            <Card key={card.id} {...card} />
          ))}
        </Box>
      )}
    </Box>
  )
}

const MobileLinkedCredsSection: React.FC<SectionProps> = ({ theme }) => (
  <Box
    sx={{
      background: 'linear-gradient(180deg, #F1F5FC, #FFFFFF)',
      py: '15px',
      px: { xs: '10px', md: 8 },
      mt: '15px'
    }}
  >
    <Typography
      variant='h4'
      sx={{
        color: theme.palette.t3Black,
        textAlign: { xs: 'left', md: 'center' },
        mb: '22.5px',
        fontFamily: 'poppins',
        fontSize: '22px',
        fontWeight: '700'
      }}
    >
      What are LinkedCreds - Business?
    </Typography>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '15px',
        pt: '15px',
        pb: '30px'
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Typography
          variant='body1'
          sx={{
            color: theme.palette.t3BodyText,
            mb: '15px',
            fontSize: '18px',
            fontWeight: 700
          }}
        >
          LinkedCreds are verifiable skills that you create to showcase your experiences.
          <br />
          <br />
          LinkedCreds are:
        </Typography>
        <Box
          component='ul'
          sx={{
            color: theme.palette.t3BodyText,
            pl: 2,
            mb: 0,
            fontSize: '14px',
            fontWeight: 400
          }}
        >
          {LinkedCreds_FEATURES.map(feature => (
            <Typography key={feature.id} component='li' variant='body2'>
              {feature.text}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box sx={{ height: '100%', width: 'auto' }}>
        <Card
          {...EXAMPLE_CARDS[1]}
          width='195px'
          height='410px'
          rotation='rotate(0deg)'
          showPlayButton={true}
          showTimer={true}
          showDuration={true}
        />
      </Box>
    </Box>
  </Box>
)

const StepsSection: React.FC<SectionProps> = ({ theme }) => (
  <Box sx={{ maxWidth: '1400px', mr: 'auto', ml: 'auto' }}>
    <Box
      sx={{
        display: 'flex',
        width: { xs: '92.308vw', md: '360px' },
        height: '39px',
        mr: 'auto',
        ml: 'auto',
        mt: { xs: '15px', md: '60px' },
        mb: '15px',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Typography
        sx={{
          textAlign: 'center',
          color: theme.palette.t3Black,
          fontSize: '22px',
          pb: '10px',
          px: '15px',
          fontFamily: 'Poppins',
          fontStyle: 'normal',
          fontWeight: '600',
          lineHeight: '27.5px'
        }}
      >
        How it works - 3 simple steps
      </Typography>
    </Box>
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        gap: { xs: 3, md: 4 },
        px: { xs: '17.5px', md: 8 },
        mb: { xs: '15px', md: '0px' }
      }}
    >
      {STEPS.map(step => (
        <Box
          key={step.id}
          sx={{
            background: '#EEF5FF',
            borderRadius: '8px',
            pt: '15px',
            pb: { xs: '15px', md: '30px' },
            px: '10px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
            textAlign: 'center'
          }}
        >
          <Box
            component='img'
            src={step.icon}
            alt={step.title}
            sx={{ mb: '15px', width: '60px', height: '60px' }}
          />
          <Typography
            sx={{
              color: theme.palette.t3BodyText,
              mb: '15px',
              fontSize: '18px',
              fontWeight: 700,
              lineHeight: '22px'
            }}
          >
            {step.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: 'Lato',
              fontWeight: 400,
              fontSize: '18px',
              color: theme.palette.t3BodyText
            }}
          >
            {step.description}
          </Typography>
        </Box>
      ))}
    </Box>
    <Link href='/newcredential' passHref>
      <Button
        variant='contained'
        sx={{
          backgroundColor: theme.palette.t3ButtonBlue,
          color: '#FFFFFF',
          fontFamily: 'Roboto',
          borderRadius: '100px',
          py: 1.5,
          px: 4,
          textTransform: 'none',
          fontSize: '16px',
          lineHeight: '20px',
          mx: 'auto',
          display: { xs: 'block', md: 'none' },
          mb: '30px',
          width: { xs: '100%', md: 'auto' },
          maxWidth: '360px',
          fontWeight: 500
        }}
      >
        Start building your first skill
      </Button>
    </Link>
  </Box>
)

const Page = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        background:
          'url(/Background.png) lightgray 50% / contain no-repeat, rgba(255, 255, 255, 0.5)',
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <HeroSection showCards={!isMobile} theme={theme} />
      {isMobile && <MobileLinkedCredsSection theme={theme} />}
      <StepsSection theme={theme} />
    </Box>
  )
}

export default Page
