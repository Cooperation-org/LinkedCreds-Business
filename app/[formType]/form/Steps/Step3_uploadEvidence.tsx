'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Box, Typography, styled, Card } from '@mui/material'

import MediaUploadSection from '../../../components/MediaUploadSection'
import useGoogleDrive from '../../../hooks/useGoogleDrive'
import { useStepContext } from '../StepContext'
import LoadingOverlay from '../../../components/Loading/LoadingOverlay'
import { TasksVector, SVGUplaodLink } from '../../../Assets/SVGs'
import { StepTrackShape } from '../fromTexts & stepTrack/StepTrackShape'
import { FileItem } from '../types/Types'
import LinkAdder from '../../../components/LinkAdder'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

interface LinkItem {
  id: string
  name: string
  url: string
}

interface PortfolioItem {
  name: string
  url: string
  googleId?: string
}

interface FileUploadAndListProps {
  readonly setValue: (field: string, value: any, options?: any) => void
  readonly selectedFiles: readonly FileItem[]
  readonly setSelectedFiles: React.Dispatch<React.SetStateAction<FileItem[]>>
  readonly watch: <T>(name: string) => T
}

const StyledTipBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: '24px',
  width: '100%',
  maxWidth: '800px',
  gap: '1rem',
  marginTop: theme.spacing(2),
  backgroundColor: '#D1E4FF',
  padding: '0.6rem 1rem',
  borderRadius: '1rem'
}))

const FileUploadAndList: React.FC<FileUploadAndListProps & { formType?: string }> = ({
  formType,
  ...props
}) => {
  const { setValue, selectedFiles, setSelectedFiles, watch } = props
  const { loading, setUploadImageFn, setLoading } = useStepContext()
  const [showLinkAdder, setShowLinkAdder] = useState(false)
  const { storage } = useGoogleDrive()
  const [files, setFiles] = useState<FileItem[]>([...selectedFiles])
  const [links, setLinks] = useState<LinkItem[]>([
    { id: crypto.randomUUID(), name: '', url: '' }
  ])

  useEffect(() => {
    setFiles([...selectedFiles])
  }, [selectedFiles])

  const handleFilesSelected = useCallback(
    (newFiles: FileItem[]) => {
      setFiles(newFiles)
      setSelectedFiles(newFiles)
    },
    [setSelectedFiles]
  )

  const handleReorder = useCallback(
    (reorderedFiles: FileItem[]) => {
      // Update local state
      setFiles(reorderedFiles)
      setSelectedFiles(reorderedFiles)

      // Update portfolio items order in form
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      const newPortfolioOrder = reorderedFiles
        .filter(file => file.googleId) // Only include uploaded files
        .map(file => ({
          name: file.name,
          url: `https://drive.google.com/uc?export=view&id=${file.googleId}`,
          googleId: file.googleId
        }))

      // If there's a featured file (first in the list), update the evidenceLink
      if (reorderedFiles[0]?.googleId) {
        setValue(
          'evidenceLink',
          `https://drive.google.com/uc?export=view&id=${reorderedFiles[0].googleId}`
        )
      }

      // Update the portfolio with the new order
      setValue('portfolio', newPortfolioOrder)
    },
    [setValue, watch, setSelectedFiles]
  )

  const handleUpload = useCallback(async () => {
    try {
      if (selectedFiles.length === 0) return
      const filesToUpload = selectedFiles.filter(
        fileItem => !fileItem.uploaded && fileItem.file && fileItem.name
      )
      if (filesToUpload.length === 0) return
      const uploadedFiles = await Promise.all(
        filesToUpload.map(async (fileItem, index) => {
          const newFile = new File([fileItem.file!], fileItem.name, {
            type: fileItem.file!.type
          })
          const uploadedFile = await storage?.uploadBinaryFile({
            file: newFile
          })
          const fileId = (uploadedFile as { id: string }).id
          return {
            ...fileItem,
            googleId: fileId,
            uploaded: true,
            isFeatured: index === 0 && !watch<string>('evidenceLink')
          }
        })
      )
      const featuredFile = uploadedFiles.find(file => file.isFeatured)
      if (featuredFile?.googleId) {
        setValue(
          'evidenceLink',
          `https://drive.google.com/uc?export=view&id=${featuredFile.googleId}`
        )
      }
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      const newPortfolioEntries: PortfolioItem[] = uploadedFiles.map(file => ({
        name: file.name,
        url: `https://drive.google.com/uc?export=view&id=${file.googleId}`,
        googleId: file.googleId
      }))
      setValue('portfolio', [...currentPortfolio, ...newPortfolioEntries])
      setSelectedFiles(prevFiles =>
        prevFiles.map(file => {
          const uploadedFile = uploadedFiles.find(f => f.name === file.name)
          return uploadedFile
            ? { ...file, googleId: uploadedFile.googleId, uploaded: true }
            : file
        })
      )
    } catch (error) {
      console.error('Error uploading files:', error)
      throw error
    }
  }, [selectedFiles, setValue, setSelectedFiles, storage, watch])

  const handleAddLink = useCallback(() => {
    setLinks(prev => [...prev, { id: crypto.randomUUID(), name: '', url: '' }])
  }, [])

  const handleRemoveLink = useCallback(
    (index: number) => {
      setLinks(prev => prev.filter((_, i) => i !== index))
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      setValue(
        'portfolio',
        currentPortfolio.filter((_, i) => i !== index)
      )
    },
    [setValue, watch]
  )

  const handleLinkChange = useCallback(
    (index: number, field: 'name' | 'url', value: string) => {
      setLinks(prev =>
        prev.map((link, i) => (i === index ? { ...link, [field]: value } : link))
      )
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      const updatedPortfolio = [...currentPortfolio]
      if (updatedPortfolio[index]) {
        updatedPortfolio[index] = { ...updatedPortfolio[index], [field]: value }
      } else {
        const newLinkEntry: PortfolioItem = { name: '', url: '' }
        if (field === 'name') newLinkEntry.name = value
        if (field === 'url') newLinkEntry.url = value
        updatedPortfolio[index] = newLinkEntry
      }
      setValue('portfolio', updatedPortfolio)
    },
    [setValue, watch]
  )

  const handleNameChange = useCallback(
    (id: string, newName: string) => {
      const updateFiles = (prevFiles: FileItem[]) =>
        prevFiles.map(file => (file.id === id ? { ...file, name: newName } : file))
      setFiles(updateFiles)
      setSelectedFiles(updateFiles)
    },
    [setSelectedFiles]
  )

  const setAsFeatured = useCallback(
    (id: string) => {
      const updateFiles = (prevFiles: FileItem[]) =>
        prevFiles
          .map(file => ({ ...file, isFeatured: file.id === id }))
          .sort((a, b) => (a.isFeatured === b.isFeatured ? 0 : a.isFeatured ? -1 : 1))
      setFiles(updateFiles)
      setSelectedFiles(updateFiles)
    },
    [setSelectedFiles]
  )

  const handleDelete = useCallback(
    (event: React.MouseEvent, id: string) => {
      event.stopPropagation()
      let isFeaturedFileDeleted = false
      let newFeaturedFileId: string | undefined = undefined

      setFiles(prevFiles => {
        const originalFeaturedFile = prevFiles.find(f => f.isFeatured)
        const isDeletingFeatured =
          originalFeaturedFile?.googleId === id || originalFeaturedFile?.id === id
        const updatedFiles = prevFiles.filter(
          file => file.googleId !== id && file.id !== id
        )
        isFeaturedFileDeleted = isDeletingFeatured

        if (isFeaturedFileDeleted && updatedFiles.length > 0) {
          updatedFiles[0].isFeatured = true
          newFeaturedFileId = updatedFiles[0].googleId
        } else if (updatedFiles.length === 0) {
          isFeaturedFileDeleted = true
          newFeaturedFileId = undefined
        }
        return updatedFiles
      })
      setSelectedFiles(prevFiles =>
        prevFiles.filter(file => file.googleId !== id && file.id !== id)
      )
      const currentPortfolio = watch<PortfolioItem[]>('portfolio') || []
      let updatedPortfolio = currentPortfolio.filter(file => file.googleId !== id)

      if (isFeaturedFileDeleted) {
        if (newFeaturedFileId) {
          setValue(
            'evidenceLink',
            `https://drive.google.com/uc?export=view&id=${newFeaturedFileId}`
          )
        } else {
          setValue('evidenceLink', '')
        }
      }
      const remainingFileGoogleIds = files
        .filter(f => f.googleId && f.googleId !== id && f.id !== id)
        .map(f => f.googleId)
      updatedPortfolio = updatedPortfolio.filter(p =>
        remainingFileGoogleIds.includes(p.googleId)
      )

      setValue('portfolio', updatedPortfolio)
    },
    [setValue, watch, files, setSelectedFiles]
  )

  useEffect(() => {
    setUploadImageFn(contextualSetLoading => async () => {
      if (files.filter(f => !f.uploaded && f.file).length === 0) {
        return
      }
      contextualSetLoading(true)
      try {
        await handleUpload()
      } catch (error) {
      } finally {
        contextualSetLoading(false)
      }
    })

    return () => {
      setUploadImageFn(null)
    }
  }, [handleUpload, setUploadImageFn, files])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        margin: '0 auto',
        gap: '24px'
      }}
    >
      <TasksVector />

      <Typography sx={{ fontFamily: 'Lato', fontSize: '24px', fontWeight: 400 }}>
        Step 3
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
        Do you have any supporting documentation or links that you would like to add?{' '}
      </Typography>

      <StepTrackShape />

      <Box
        display='flex'
        flexDirection='column'
        bgcolor='#FFFFFF'
        gap={3}
        borderRadius={2}
        width='100%'
      >
        {/* Add Links Section */}
        <CardStyle variant='outlined' onClick={() => setShowLinkAdder(true)}>
          {showLinkAdder && (
            <Box mb={3} width='100%'>
              <LinkAdder
                fields={links}
                onAdd={handleAddLink}
                onRemove={handleRemoveLink}
                onNameChange={(index, value) => handleLinkChange(index, 'name', value)}
                onUrlChange={(index, value) => handleLinkChange(index, 'url', value)}
                maxLinks={5}
                nameLabel='Name'
                urlLabel='URL'
                namePlaceholder='(e.g., LinkedIn profile, github repo, etc.)'
                urlPlaceholder='https://'
              />{' '}
            </Box>
          )}
          <SVGUplaodLink />
          <Typography variant='body1' color='primary' align='center'>
            + Add links
            <br />
            (social media, articles, your website, etc.)
          </Typography>
        </CardStyle>
        <MediaUploadSection
          files={files}
          onFilesSelected={handleFilesSelected}
          onDelete={handleDelete}
          onNameChange={handleNameChange}
          onSetAsFeatured={setAsFeatured}
          onReorder={handleReorder}
          maxFiles={10}
          maxSizeMB={20}
        />
      </Box>
      <LoadingOverlay text='Uploading files...' open={loading} />
    </Box>
  )
}

const CardStyle = styled(Card)({
  padding: '40px 20px',
  cursor: 'pointer',
  width: '100%',
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  p: 4,
  borderRadius: 2,
  gap: 2,
  border: '2px dashed #ccc',
  '&:hover': {
    borderColor: '#2563EB'
  }
})

export default FileUploadAndList
