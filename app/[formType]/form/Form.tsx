/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormControl, Box, Slide } from '@mui/material'
import { FormData } from './types/Types'
import { Step0 } from './Steps/Step0_connectToGoogle'
import { Buttons } from './buttons/Buttons'
import { createDID, signCred } from '../../utils/signCred'
import { GoogleDriveStorage, saveToGoogleDrive } from '@cooperation/vc-storage'
import { useSession, signIn } from 'next-auth/react'
import { handleSign } from '../../utils/formUtils'
import { saveSession } from '../../utils/saveSession'
import SnackMessage from '../../components/SnackMessage'
import { useStepContext } from './StepContext'
import SuccessPage from './Steps/SuccessPage'
import FileUploadAndList from './Steps/Step3_uploadEvidence'
import { Step1 } from './Steps/Step1_userName'
import { Step2 } from './Steps/Step2_descriptionFields'
import { Step3_performanceReviewFields } from './Steps/Step3_performanceReviewFields'
import { storeFileTokens } from '../../firebase/storage'
import {
  incrementCredentialTypeCount,
  incrementEvidenceAttachmentRate
} from '../../firebase/firestore'
import type { CredentialsIssued, EvidenceAttachmentRates } from '../../firebase/firestore'
import CredentialTracker from '../../components/credetialTracker/Page'
import { StepTrackShape } from './fromTexts & stepTrack/StepTrackShape'

interface FormProps {
  onStepChange: () => void
  formType: string
}

const Form: React.FC<FormProps> = ({ onStepChange, formType }) => {
  const { activeStep, handleNext, handleBack, setActiveStep, loading } = useStepContext()
  const [prevStep, setPrevStep] = useState(0)
  const [link, setLink] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [hasSignedIn, setHasSignedIn] = useState(false)
  const [snackMessage, setSnackMessage] = useState('')
  const [fileId, setFileId] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<any[]>([])
  const [res, setRes] = useState<any>(null)

  const { data: session } = useSession()
  const accessToken = session?.accessToken as string | undefined
  const refreshToken = session?.refreshToken as string | undefined
  const userEmail = session?.user?.email
  const storage = new GoogleDriveStorage(accessToken ?? '')

  const isPerformanceReview = formType === 'performance-review'

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    trigger,
    formState: { errors, isValid }
  } = useForm<FormData>({
    defaultValues: {
      storageOption: 'Google Drive',
      fullName: session?.user?.name ?? '',
      persons: '',
      credentialName: '',
      credentialDuration: '',
      credentialDescription: '',
      portfolio: [],
      evidenceLink: '',
      description: '',
      volunteerWork: '',
      volunteerOrg: '',
      volunteerDescription: '',
      duration: '',
      timeSpent: '',
      skillsGained: '',
      volunteerDates: '',
      role: '',
      company: '',
      employeeName: '',
      employeeJobTitle: '',
      reviewComments: '',
      overallRating: '',
      goalsNext: '',
      reviewDates: '',
      documentType: '',
      documentNumber: '',
      issuingCountry: '',
      expirationDate: '',
      reviewEndDate: '',
      reviewStartDate: '',
      reviewDuration: '',
      jobKnowledgeRating: '',
      teamworkRating: '',
      initiativeRating: '',
      communicationRating: ''
    },
    mode: 'onChange',
    reValidateMode: 'onChange'
  })

  const formValues = watch()

  useEffect(() => {
    if (formType) {
      if (accessToken) {
        setActiveStep(1)
      } else {
        setActiveStep(0)
      }
      reset()
    }
  }, [formType, setActiveStep, reset, accessToken])

  useEffect(() => {
    setPrevStep(activeStep + 1)
  }, [activeStep])

  useEffect(() => {
    onStepChange()
  }, [activeStep, onStepChange])

  const direction = activeStep > prevStep ? 'left' : 'right'

  const costumedHandleNextStep = async () => {
    if (
      activeStep === 0 &&
      watch('storageOption') === 'Google Drive' &&
      !accessToken &&
      !hasSignedIn
    ) {
      const ok = await signIn('google')
      if (!ok) return
      setHasSignedIn(true)
      handleNext()
    } else {
      handleNext()
    }
  }

  const costumedHandleBackStep = async () => {
    if (activeStep > 0) {
      handleBack()
      await trigger()
    }
  }

  const handleFormSubmit = handleSubmit(async (d: FormData) => {
    try {
      await sign(d)
    } catch {
      setErrorMessage('An error occurred during the signing process.')
    }
  })

  const sign = async (data: FormData) => {
    if (formType === 'volunteer') {
      if (data.showDuration) {
        data.duration = String(data.duration) + (data.currentVolunteer ? ' -present' : '')
      } else {
        data.volunteerDates =
          String(data.volunteerDates) + (data.currentVolunteer ? ' -present' : '')
      }
      delete data.showDuration
      delete data.currentVolunteer
    }

    if (formType === 'volunteer' && data.volunteerWork) {
      ;(data as any).credentialName = data.volunteerWork
    }

    if (!accessToken) {
      setErrorMessage('Access token is missing')
      return
    }
    try {
      const { didDocument, keyPair, issuerId } = await createDID(accessToken)
      await saveToGoogleDrive({ storage, data: { didDocument, keyPair }, type: 'DID' })
      const credRes = await signCred(accessToken, data, issuerId, keyPair, 'VC')
      const file: any = await saveToGoogleDrive({ storage, data: credRes, type: 'VC' })
      await storeFileTokens({
        googleFileId: file.id,
        tokens: { accessToken, refreshToken: refreshToken ?? '' }
      })
      const folderIds = await storage.getFileParents(file.id)
      await storage.createRelationsFile({ vcFolderId: folderIds[0] })
      setLink(`https://drive.google.com/file/d/${file.id}/view`)
      setFileId(file.id)
      setRes(credRes)
      localStorage.removeItem('vcs')

      if (userEmail) {
        const credentialTypeMap: Record<string, keyof CredentialsIssued> = {
          skill: 'skill',
          volunteer: 'volunteer',
          role: 'employment',
          'performance-review': 'performanceReview',
          'identity-verification': 'idVerification'
        }
        const fbCredentialType = credentialTypeMap[formType]
        if (fbCredentialType) {
          try {
            await incrementCredentialTypeCount(
              userEmail,
              fbCredentialType as keyof CredentialsIssued
            )
          } catch (fbError) {
            console.error(
              'Failed to update Firebase analytics (credential count):',
              fbError
            )
          }
        }

        // Check for evidence and increment evidence attachment rate
        const hasPortfolioEvidence = data.portfolio && data.portfolio.length > 0
        const hasLinkEvidence = data.evidenceLink && data.evidenceLink.trim() !== ''

        if (hasPortfolioEvidence || hasLinkEvidence) {
          const evidenceTypeMap: Record<string, keyof EvidenceAttachmentRates> = {
            skill: 'skillVCs',
            volunteer: 'volunteerVCs',
            role: 'employmentVCs', // Assuming 'role' formType maps to 'employmentVCs'
            'performance-review': 'performanceReviews'
            // Note: idVerification typically might not have evidence in the same way,
            // but can be added if needed.
          }
          const fbEvidenceType = evidenceTypeMap[formType]

          if (fbEvidenceType) {
            try {
              await incrementEvidenceAttachmentRate(
                userEmail,
                fbEvidenceType as keyof EvidenceAttachmentRates
              )
            } catch (fbError) {
              console.error(
                'Failed to update Firebase analytics (evidence rate):',
                fbError
              )
            }
          }
        }
      }
    } catch (e) {
      console.error(e)
      throw e
    }
  }

  const handleSaveSession = async () => {
    try {
      const current = watch()
      setSnackMessage('Successfully saved in Your ' + current.storageOption)
      if (!accessToken) {
        setErrorMessage('Access token is missing')
        return
      }
      await saveSession(current, accessToken)
    } catch {
      setSnackMessage('Something went wrong, please try again later')
    }
  }

  return (
    <Box
      sx={{
        m: { xs: '50px auto', md: '120px auto' },
        display: 'flex',
        gap: '90px',
        alignItems: 'flex-start',
        justifyContent: 'center',
        p: { xs: '0 20px', md: '0' }
      }}
    >
      <Box
        component='form'
        onSubmit={handleFormSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          alignItems: 'center',
          padding: '20px',
          overflow: 'auto',
          width: '100%',
          maxWidth: '720px',
          backgroundColor: { xs: 'transparent', md: '#FFF' }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '720px' }}>
          <FormControl sx={{ width: '100%' }}>
            {activeStep === 0 && !accessToken && (
              <Slide in direction={direction} timeout={500}>
                <Box>
                  <Step0 />
                </Box>
              </Slide>
            )}
            {activeStep === 1 && (
              <Slide in direction={direction} timeout={500}>
                <Box>
                  <Step1
                    watch={watch}
                    setValue={setValue}
                    register={register}
                    errors={errors}
                    handleNext={handleNext}
                  />
                </Box>
              </Slide>
            )}
            {activeStep === 2 && (
              <Slide in direction={direction}>
                <Box>
                  <Step2
                    register={register}
                    watch={watch}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    formType={formType}
                  />
                </Box>
              </Slide>
            )}
            {activeStep === 3 && isPerformanceReview && (
              <Slide in direction={direction}>
                <Box>
                  <Step3_performanceReviewFields
                    register={register}
                    watch={watch}
                    control={control}
                    errors={errors}
                    setValue={setValue}
                  />
                </Box>
              </Slide>
            )}
            {activeStep === 3 && !isPerformanceReview && (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <FileUploadAndList
                  watch={watch}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  setValue={setValue}
                  formType={formType}
                />
              </Box>
            )}
            {activeStep === 4 && isPerformanceReview && (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <FileUploadAndList
                  watch={watch}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  setValue={setValue}
                  formType={formType}
                />
              </Box>
            )}
            {activeStep === 4 && !isPerformanceReview && (
              <Slide in direction={direction}>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: 'Lato',
                        fontSize: '24px',
                        fontWeight: 400,
                        textAlign: 'center'
                      }}
                    >
                      Step 4
                    </Box>
                    <Box
                      sx={{
                        fontFamily: 'Lato',
                        fontSize: '16px',
                        fontWeight: 400,
                        textAlign: 'center',
                        mb: 1
                      }}
                    >
                      Please review your credential before signing.
                    </Box>
                    <StepTrackShape />
                  </Box>
                  <CredentialTracker formData={watch()} hideHeader={true} />
                </Box>
              </Slide>
            )}
            {activeStep === 5 && isPerformanceReview && (
              <Slide in direction={direction}>
                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 1,
                      mb: 2
                    }}
                  >
                    <Box
                      sx={{
                        fontFamily: 'Lato',
                        fontSize: '24px',
                        fontWeight: 400,
                        textAlign: 'center'
                      }}
                    >
                      Step 5
                    </Box>
                    <Box
                      sx={{
                        fontFamily: 'Lato',
                        fontSize: '16px',
                        fontWeight: 400,
                        textAlign: 'center',
                        mb: 1
                      }}
                    >
                      Please review your credential before signing.
                    </Box>
                    <StepTrackShape />
                  </Box>
                  <CredentialTracker formData={watch()} hideHeader={true} />
                </Box>
              </Slide>
            )}
            {activeStep === 5 && !isPerformanceReview && (
              <Slide in direction={direction}>
                <Box>
                  <SuccessPage
                    formData={watch()}
                    setActiveStep={setActiveStep}
                    reset={reset}
                    link={link}
                    setLink={setLink}
                    setFileId={setFileId}
                    fileId={fileId}
                    storageOption={watch('storageOption')}
                    res={res}
                    selectedImage=''
                  />
                </Box>
              </Slide>
            )}
            {activeStep === 6 && isPerformanceReview && (
              <Slide in direction={direction}>
                <Box>
                  <SuccessPage
                    formData={watch()}
                    setActiveStep={setActiveStep}
                    reset={reset}
                    link={link}
                    setLink={setLink}
                    setFileId={setFileId}
                    fileId={fileId}
                    storageOption={watch('storageOption')}
                    res={res}
                    selectedImage=''
                  />
                </Box>
              </Slide>
            )}
          </FormControl>
        </Box>
        {(() => {
          const successStep = isPerformanceReview ? 6 : 5
          const previewStep = isPerformanceReview ? 5 : 4

          if (activeStep !== successStep) {
            return (
              <Buttons
                activeStep={activeStep}
                handleNext={activeStep === 0 ? costumedHandleNextStep : handleNext}
                handleSign={() => handleSign(activeStep, setActiveStep, handleFormSubmit)}
                handleBack={costumedHandleBackStep}
                isValid={isValid}
                handleSaveSession={handleSaveSession}
                loading={loading}
                isPerformanceReview={isPerformanceReview}
                maxStepsBeforeSign={previewStep}
              />
            )
          }
          return null
        })()}
        {errorMessage && (
          <div
            style={{
              color: errorMessage.includes('MetaMask') ? 'red' : 'black',
              textAlign: 'center'
            }}
          >
            {errorMessage}
          </div>
        )}
        {snackMessage && <SnackMessage message={snackMessage} />}
      </Box>
      {(() => {
        const previewStep = isPerformanceReview ? 5 : 4
        if (
          activeStep >= 1 &&
          activeStep !== previewStep &&
          activeStep < (isPerformanceReview ? 6 : 5)
        ) {
          return <CredentialTracker formData={formValues} hideHeader={false} />
        }
        return null
      })()}
    </Box>
  )
}

export default Form
