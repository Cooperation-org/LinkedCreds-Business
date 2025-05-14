/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { FormControl, Box, Slide } from '@mui/material'
import { FormData } from './types/Types'
import { Step0 } from './Steps/Step0_connectToGoogle'
import { Buttons } from './buttons/Buttons'
import DataComponent from './Steps/dataPreview'
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
import { Step2 } from './Steps/Step2_descreptionFields'
import { storeFileTokens } from '../../firebase/storage'
import CredentialTracker from '../../components/credetialTracker/Page'

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
  const storage = new GoogleDriveStorage(accessToken ?? '')

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
      expirationDate: ''
    },
    mode: 'onChange'
  })

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
        justifyContent: 'center'
      }}
    >
      <form
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '30px',
          alignItems: 'center',
          padding: '20px',
          overflow: 'auto',
          width: '100%',
          maxWidth: '720px',
          backgroundColor: '#FFF'
        }}
        onSubmit={handleFormSubmit}
      >
        <Box sx={{ width: '100%', maxWidth: '720px' }}>
          <FormControl sx={{ width: '100%' }}>
            {activeStep === 0 && (
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
                  />
                </Box>
              </Slide>
            )}
            {activeStep === 3 && (
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <FileUploadAndList
                  watch={watch}
                  selectedFiles={selectedFiles}
                  setSelectedFiles={setSelectedFiles}
                  setValue={setValue}
                />
              </Box>
            )}
            {activeStep === 4 && (
              <Slide in direction={direction}>
                <Box>
                  <DataComponent formData={watch()} selectedFiles={selectedFiles} />
                </Box>
              </Slide>
            )}
            {activeStep === 5 && (
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
        {activeStep !== 5 && (
          <Buttons
            activeStep={activeStep}
            handleNext={activeStep === 0 ? costumedHandleNextStep : handleNext}
            handleSign={() => handleSign(activeStep, setActiveStep, handleFormSubmit)}
            handleBack={costumedHandleBackStep}
            isValid={isValid}
            handleSaveSession={handleSaveSession}
            loading={loading}
          />
        )}
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
      </form>
      {activeStep >= 1 && <CredentialTracker formData={watch()} />}
    </Box>
  )
}

export default Form
