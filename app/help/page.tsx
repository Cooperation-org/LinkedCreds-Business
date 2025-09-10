/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState } from 'react'
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import AddIcon from '@mui/icons-material/Add'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import ShareIcon from '@mui/icons-material/Share'
import ImportExportIcon from '@mui/icons-material/ImportExport'
import PersonIcon from '@mui/icons-material/Person'
import WorkIcon from '@mui/icons-material/Work'
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism'
import AssessmentIcon from '@mui/icons-material/Assessment'
import Link from 'next/link'

const HelpPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [expanded, setExpanded] = useState<string | false>('getting-started')

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const QuickStartSteps = [
    {
      step: 1,
      title: 'Sign In',
      description: 'Click "Sign In" in the top right corner and authenticate with your Google account.',
      icon: <PersonIcon />
    },
    {
      step: 2,
      title: 'Create Your First Credential',
      description: 'Click "Add a New Credential" to start documenting employee skills, employment, or volunteer work.',
      icon: <AddIcon />
    },
    {
      step: 3,
      title: 'Fill Out the Form',
      description: 'Complete the multi-step form with details about the credential, evidence, and duration.',
      icon: <CheckCircleIcon />
    },
    {
      step: 4,
      title: 'Request Recommendations',
      description: 'Ask supervisors or colleagues to provide recommendations to validate the credential.',
      icon: <ShareIcon />
    },
    {
      step: 5,
      title: 'View Your Credentials',
      description: 'Check "My Skills" to see all your created credentials and their status.',
      icon: <WorkIcon />
    }
  ]

  const CredentialTypes = [
    {
      type: 'Skills',
      description: 'Document specific abilities, competencies, or expertise',
      examples: ['Technical skills', 'Soft skills', 'Certifications', 'Training completion'],
      icon: <WorkIcon />
    },
    {
      type: 'Employment',
      description: 'Record job roles, positions, and work experience',
      examples: ['Job titles', 'Responsibilities', 'Achievements', 'Duration'],
      icon: <WorkIcon />
    },
    {
      type: 'Performance Reviews',
      description: 'Capture annual or periodic performance evaluations',
      examples: ['Manager feedback', 'Goal achievements', 'Ratings', 'Improvement areas'],
      icon: <AssessmentIcon />
    },
    {
      type: 'Volunteer Work',
      description: 'Document community service and volunteer activities',
      examples: ['Community service', 'Non-profit work', 'Event organization', 'Hours volunteered'],
      icon: <VolunteerActivismIcon />
    }
  ]

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
          Help & Instructions
        </Typography>
        <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: '800px', mx: 'auto' }}>
          Learn how to use LinkedCreds - Business to create, manage, and share verifiable credentials for your employees.
        </Typography>
      </Box>

      {/* Quick Start Guide */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: theme.palette.primary.main }}>
          🚀 Quick Start Guide
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          {QuickStartSteps.map((step) => (
            <Box key={step.step} sx={{ flex: 1, textAlign: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  bgcolor: theme.palette.primary.main, 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 1
                }}>
                  {step.icon}
                </Box>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Step {step.step}: {step.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {step.description}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* FAQ Accordion */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: theme.palette.primary.main }}>
          Frequently Asked Questions
        </Typography>

        {/* Getting Started */}
        <Accordion expanded={expanded === 'getting-started'} onChange={handleChange('getting-started')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Getting Started
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                What is LinkedCreds - Business?
              </Typography>
              <Typography sx={{ mb: 3 }}>
                LinkedCreds - Business is a platform that helps organizations create, manage, and share verifiable credentials for their employees. 
                These credentials can include skills, employment records, performance reviews, and volunteer work.
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                How do I sign up?
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Click the "Sign In" button in the top right corner and authenticate with your Google account. 
                No separate registration is required.
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                What types of credentials can I create?
              </Typography>
              <List>
                {CredentialTypes.map((credential, index) => (
                  <ListItem key={index} sx={{ pl: 0 }}>
                    <ListItemIcon>{credential.icon}</ListItemIcon>
                    <ListItemText
                      primary={credential.type}
                      secondary={`${credential.description}. Examples: ${credential.examples.join(', ')}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Creating Credentials */}
        <Accordion expanded={expanded === 'creating-credentials'} onChange={handleChange('creating-credentials')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Creating Credentials
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                How do I create a new credential?
              </Typography>
              <List>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Click 'Add a New Credential' in the navigation menu" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Select the type of credential you want to create (Skill, Employment, Performance Review, or Volunteer)" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Fill out the multi-step form with all required information" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Upload supporting evidence (documents, images, videos)" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Submit the credential for processing" />
                </ListItem>
              </List>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
                What information do I need to provide?
              </Typography>
              <Typography sx={{ mb: 2 }}>
                The required information varies by credential type, but generally includes:
              </Typography>
              <List>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Credential name and description" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Duration or date range" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Supporting evidence (documents, certificates, photos)" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Contact information for verification" />
                </ListItem>
              </List>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Managing Credentials */}
        <Accordion expanded={expanded === 'managing-credentials'} onChange={handleChange('managing-credentials')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Managing Your Credentials
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                How do I view all my credentials?
              </Typography>
              <Typography sx={{ mb: 3 }}>
                Click "My Skills" in the navigation menu to see all your created credentials. 
                You can view details, share credentials, and manage recommendations from this dashboard.
              </Typography>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                How do I share a credential?
              </Typography>
              <List>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Go to 'My Skills' and find the credential you want to share" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Click the share button (📤) on the credential card" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Copy the shareable link or send it directly via email" />
                </ListItem>
              </List>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
                How do I import existing credentials?
              </Typography>
              <Typography sx={{ mb: 2 }}>
                If you have existing credentials in JSON format, you can import them:
              </Typography>
              <List>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Click 'Import Skill Credential' in the navigation menu" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Paste your credential JSON data or provide a URL" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Review the extracted information and submit" />
                </ListItem>
              </List>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Recommendations */}
        <Accordion expanded={expanded === 'recommendations'} onChange={handleChange('recommendations')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Recommendations & Validation
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                How do I request recommendations?
              </Typography>
              <List>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="When creating a credential, you can request recommendations from supervisors or colleagues" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Provide the recommender's email address" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="They will receive an email with a link to provide their recommendation" />
                </ListItem>
              </List>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
                How do I review recommendations?
              </Typography>
              <List>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="When someone provides a recommendation, you'll be notified" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Click on the recommendation link to review the details" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Choose to 'Approve' or 'Hide' the recommendation" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Approved recommendations will be visible on your credential" />
                </ListItem>
              </List>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Analytics */}
        <Accordion expanded={expanded === 'analytics'} onChange={handleChange('analytics')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Analytics & Tracking
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                What analytics are available?
              </Typography>
              <Typography sx={{ mb: 2 }}>
                The Analytics page provides insights into your credential usage:
              </Typography>
              <List>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><AnalyticsIcon /></ListItemIcon>
                  <ListItemText primary="Credentials Issued: Track how many credentials you've created by type" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><ShareIcon /></ListItemIcon>
                  <ListItemText primary="Click Rates: Monitor how often people click on your shared credentials" />
                </ListItem>
                <ListItem sx={{ pl: 0 }}>
                  <ListItemIcon><CheckCircleIcon /></ListItemIcon>
                  <ListItemText primary="Evidence Attachment Rates: See how often you include supporting evidence" />
                </ListItem>
              </List>

              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, mt: 3 }}>
                How do I access analytics?
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Click "Analytics" in the navigation menu to view your credential statistics and engagement metrics.
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>

        {/* Troubleshooting */}
        <Accordion expanded={expanded === 'troubleshooting'} onChange={handleChange('troubleshooting')}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Troubleshooting
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ pl: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Common Issues and Solutions
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                Can't sign in?
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Make sure you're using a valid Google account. Clear your browser cache and cookies, then try again.
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                Credential not showing up?
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Check that you completed all required fields in the form. Credentials may take a few minutes to appear after submission.
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                Can't upload files?
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Ensure your files are in supported formats (PDF, JPG, PNG, MP4). Check that files are under the size limit.
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                Recommendation emails not received?
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Check spam folders. Ensure the email address is correct and the recipient has access to their email.
              </Typography>

              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1, mt: 2 }}>
                Need more help?
              </Typography>
              <Typography sx={{ mb: 2 }}>
                Contact our support team at{' '}
                <Link href="mailto:lc.business-support@allskillscount.org" style={{ color: theme.palette.primary.main }}>
                  lc.business-support@allskillscount.org
                </Link>
              </Typography>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Contact Information */}
      <Paper sx={{ p: 3, borderRadius: 2, bgcolor: theme.palette.primary.main, color: 'white' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Still Need Help?
        </Typography>
        <Typography sx={{ mb: 2 }}>
          If you can't find the answer to your question, our support team is here to help.
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Email Support
            </Typography>
            <Typography>
              <Link href="mailto:lc.business-support@allskillscount.org" style={{ color: 'white', textDecoration: 'underline' }}>
                lc.business-support@allskillscount.org
              </Link>
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Response Time
            </Typography>
            <Typography>We typically respond within 24-48 hours</Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default HelpPage
