/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react'
import { useTheme, styled } from '@mui/material/styles'
import { Box, Typography, useMediaQuery, Theme } from '@mui/material'
import { GlobalWorkerOptions, getDocument } from 'pdfjs-dist'
import {
  commonTypographyStyles,
  commonBoxStyles,
  evidenceListStyles
} from '../../../components/Styles/appStyles'
import { StepTrackShape } from '../fromTexts & stepTrack/StepTrackShape'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
const isPDF = (fileName: string) => fileName.toLowerCase().endsWith('.pdf')
const isMP4 = (fileName: string) => fileName.toLowerCase().endsWith('.mp4')
const isGoogleDriveImageUrl = (url: string): boolean => {
  return /https:\/\/drive\.google\.com\/uc\?export=view&id=.+/.test(url)
}

const cleanHTML = (htmlContent: string) => {
  return htmlContent
    .replace(/<p><br><\/p>/g, '')
    .replace(/<p><\/p>/g, '')
    .replace(/<br>/g, '')
    .replace(/class="[^"]*"/g, '')
    .replace(/style="[^"]*"/g, '')
}

interface FormData {
  credentialName?: string
  credentialDescription?: string
  description?: string
  credentialDuration?: string
  volunteerDescription?: string
  duration?: string
  skillsGained?: string
  role?: string
  company?: string
  employeeName?: string
  employeeJobTitle?: string
  reviewComments?: string
  overallRating?: string
  goalsNext?: string
  documentType?: string
  documentNumber?: string
  issuingCountry?: string
  expirationDate?: string
  evidenceLink?: string
  supportingDocs?: string
  volunteerWork?: string
  portfolio?: Array<{
    name: string
    url: string
  }>
}

interface DataPreviewProps {
  formData: FormData
  selectedFiles: {
    id: string
    name: string
    url: string
    isFeatured?: boolean
  }[]
}

const Label = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 700,
  lineHeight: '24px',
  color: '#000e40'
})

const Value = styled(Typography)({
  fontFamily: 'Inter',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  color: '#6b7280'
})

const Media = styled(Box)({
  width: '160.506px',
  height: '153.129px',
  position: 'relative',
  borderRadius: '10px',
  overflow: 'hidden',
  margin: '0 auto'
})

const renderPDFThumbnail = async (fileUrl: string) => {
  try {
    const loadingTask = getDocument(fileUrl)
    const pdf = await loadingTask.promise
    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 0.1 })
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      canvas.height = viewport.height
      canvas.width = viewport.width
      await page.render({ canvasContext: context, viewport }).promise
      return canvas.toDataURL()
    }
  } catch (error) {
    console.error('Error rendering PDF thumbnail:', error)
  }
  return '/fallback-pdf-thumbnail.svg'
}

const generateVideoThumbnail = (videoUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.src = videoUrl
    video.addEventListener(
      'loadeddata',
      () => {
        video.currentTime = 1
      },
      { once: true }
    )
    video.addEventListener(
      'seeked',
      () => {
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          reject(new Error('Could not get 2D canvas context'))
          return
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const dataURL = canvas.toDataURL('image/png')
        resolve(dataURL)
      },
      { once: true }
    )

    video.addEventListener('error', e => {
      reject(e)
    })
  })
}

const DataPreview: React.FC<DataPreviewProps> = ({ formData, selectedFiles }) => {
  const theme: Theme = useTheme()
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('sm'))
  const segment = usePathname()?.split('/').filter(Boolean).pop() ?? 'skill'

  const [pdfThumbnails, setPdfThumbnails] = useState<Record<string, string>>({})
  const [videoThumbnails, setVideoThumbnails] = useState<Record<string, string>>({})

  useEffect(() => {
    selectedFiles.forEach(async file => {
      if (isPDF(file.name) && !pdfThumbnails[file.id]) {
        const thumbnail = await renderPDFThumbnail(file.url)
        setPdfThumbnails(prev => ({ ...prev, [file.id]: thumbnail }))
      }

      if (isMP4(file.name) && !videoThumbnails[file.id]) {
        try {
          const thumbnail = await generateVideoThumbnail(file.url)
          setVideoThumbnails(prev => ({ ...prev, [file.id]: thumbnail }))
        } catch (error) {
          console.error('Error generating video thumbnail:', error)
          setVideoThumbnails(prev => ({
            ...prev,
            [file.id]: '/fallback-video.png'
          }))
        }
      }
    })
  }, [selectedFiles, pdfThumbnails, videoThumbnails])

  const handleNavigate = (url: string, target: string = '_self') => {
    window.open(url, target)
  }

  const shouldDisplayUrl = (url: string): boolean => {
    return !isGoogleDriveImageUrl(url)
  }

  const renderFormSpecificContent = () => {
    switch (segment) {
      case 'skill':
        return (
          <>
            <Box sx={{ mb: 2.5 }}>
              <Label>Earning Criteria</Label>
              <Value>
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(formData?.description || '')
                  }}
                />
              </Value>
            </Box>
            {formData.credentialDuration && (
              <Box sx={{ mb: 2.5 }}>
                <Label>Duration</Label>
                <Value>{formData.credentialDuration}</Value>
              </Box>
            )}
          </>
        )
      case 'volunteer':
        return (
          <>
            <Box sx={{ mb: 2.5 }}>
              <Label>Volunteer Description</Label>
              <Value>
                <span
                  dangerouslySetInnerHTML={{
                    __html: cleanHTML(formData?.volunteerDescription || '')
                  }}
                />
              </Value>
            </Box>
            {formData.duration && (
              <Box sx={{ mb: 2.5 }}>
                <Label>Duration</Label>
                <Value>{formData.duration}</Value>
              </Box>
            )}
            {formData.skillsGained && (
              <Box sx={{ mb: 2.5 }}>
                <Label>Skills gained</Label>
                <ul style={{ margin: 0, paddingLeft: '18px' }}>
                  {(formData.skillsGained || '')
                    .split(/\n|,|•/)
                    .map((skill: string, index: number) => (
                      <li
                        key={index}
                        style={{
                          color: '#6b7280',
                          fontFamily: 'Inter',
                          fontSize: '16px'
                        }}
                      >
                        {skill.trim()}
                      </li>
                    ))}
                </ul>
              </Box>
            )}
          </>
        )
      case 'role':
        return (
          <>
            <Box sx={{ mb: 2.5 }}>
              <Label>Role</Label>
              <Value>{formData.role || ''}</Value>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Label>Company</Label>
              <Value>{formData.company || ''}</Value>
            </Box>
          </>
        )
      case 'performance-review':
        return (
          <>
            <Box sx={{ mb: 2.5 }}>
              <Label>Employee</Label>
              <Value>{formData.employeeName || ''}</Value>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Label>Job Title</Label>
              <Value>{formData.employeeJobTitle || ''}</Value>
            </Box>
            {formData.reviewComments && (
              <Box sx={{ mb: 2.5 }}>
                <Label>Review Comments</Label>
                <Value>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: cleanHTML(formData.reviewComments || '')
                    }}
                  />
                </Value>
              </Box>
            )}
            {formData.overallRating && (
              <Box sx={{ mb: 2.5 }}>
                <Label>Overall Rating</Label>
                <Value>{formData.overallRating}</Value>
              </Box>
            )}
            {formData.goalsNext && (
              <Box sx={{ mb: 2.5 }}>
                <Label>Goals for Next Period</Label>
                <Value>
                  <span
                    dangerouslySetInnerHTML={{
                      __html: cleanHTML(formData.goalsNext || '')
                    }}
                  />
                </Value>
              </Box>
            )}
          </>
        )
      case 'identity-verification':
        return (
          <>
            <Box sx={{ mb: 2.5 }}>
              <Label>Document Type</Label>
              <Value>{formData.documentType || ''}</Value>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Label>Document Number</Label>
              <Value>{formData.documentNumber || ''}</Value>
            </Box>
            <Box sx={{ mb: 2.5 }}>
              <Label>Issuing Country</Label>
              <Value>{formData.issuingCountry || ''}</Value>
            </Box>
            {formData.expirationDate && (
              <Box sx={{ mb: 2.5 }}>
                <Label>Expiration Date</Label>
                <Value>{formData.expirationDate}</Value>
              </Box>
            )}
          </>
        )
      default:
        return null
    }
  }

  const renderMedia = () => {
    if (!formData?.evidenceLink) {
      return (
        <Box>
          <Media>
            <Image
              src='/images/SkillMedia.svg'
              alt='Featured Media'
              width={160}
              height={153}
              style={{
                borderRadius: '10px',
                objectFit: 'cover'
              }}
            />
          </Media>
          <Typography
            sx={{
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: 500,
              color: '#6b7280',
              mt: 1,
              textAlign: 'center'
            }}
          >
            Featured Media
          </Typography>
        </Box>
      )
    }

    return (
      <Box>
        <Media>
          <Image
            src={formData.evidenceLink}
            alt='Featured Media'
            width={160}
            height={153}
            style={{
              borderRadius: '10px',
              objectFit: 'cover'
            }}
          />
        </Media>
        <Typography
          sx={{
            fontFamily: 'Inter',
            fontSize: '16px',
            fontWeight: 500,
            color: '#6b7280',
            mt: 1,
            textAlign: 'center'
          }}
        >
          Featured Media
        </Typography>
      </Box>
    )
  }

  const renderSupportingDocs = () => {
    if (!formData?.evidenceLink && !formData?.portfolio?.length) return null

    const evidence = formData.evidenceLink
    const portfolio = formData.portfolio || []
    const hasUrls = evidence || portfolio.length > 0

    if (!hasUrls) return null

    return (
      <Box sx={{ mb: 2.5 }}>
        <Label>Supporting Documentation</Label>
        <ul style={{ margin: 0, paddingLeft: '18px' }}>
          {evidence && shouldDisplayUrl(evidence) && (
            <li style={{ color: '#6b7280', fontFamily: 'Inter', fontSize: '16px' }}>
              <a
                href={evidence}
                target='_blank'
                rel='noopener noreferrer'
                style={{ color: '#6b7280' }}
              >
                {formData.supportingDocs || evidence}
              </a>
            </li>
          )}
          {portfolio.map(
            (file: { name: string; url: string }, index: number) =>
              file.name &&
              file.url &&
              shouldDisplayUrl(file.url) && (
                <li
                  key={index}
                  style={{ color: '#6b7280', fontFamily: 'Inter', fontSize: '16px' }}
                >
                  <a
                    href={file.url}
                    target='_blank'
                    rel='noopener noreferrer'
                    style={{ color: '#6b7280' }}
                  >
                    {file.name || file.url}
                  </a>
                </li>
              )
          )}
        </ul>
      </Box>
    )
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      <Typography
        sx={{
          fontFamily: 'Lato',
          fontSize: '24px',
          fontWeight: 400,
          textAlign: 'center'
        }}
      >
        Here&apos;s what you&apos;ve created!
      </Typography>
      <StepTrackShape />
      <Box
        sx={{
          width: '100%',
          bgcolor: '#FFF',
          borderRadius: '8px',
          border: '1px solid #003FE0',
          p: '10px',
          gap: '20px'
        }}
      >
        <Box sx={{ mb: 2.5 }}>
          <Label sx={{ fontSize: '24px' }}>
            {formData.credentialName ||
              formData.volunteerWork ||
              formData.role ||
              formData.documentType ||
              ''}
          </Label>
          {formData.credentialDescription && (
            <Value>
              <span
                dangerouslySetInnerHTML={{
                  __html: cleanHTML(formData.credentialDescription || '')
                }}
              />
            </Value>
          )}
        </Box>

        {renderMedia()}
        {renderFormSpecificContent()}
        {renderSupportingDocs()}
      </Box>
    </Box>
  )
}

export default DataPreview
