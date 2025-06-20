'use client'
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback
} from 'react'

interface StepContextType {
  activeStep: number
  loading: boolean
  setLoading: (isLoading: boolean) => void
  setActiveStep: (step: number) => void
  handleNext: () => Promise<void>
  handleBack: () => void
  setUploadImageFn: (
    fn: ((loader: (l: boolean) => void) => () => Promise<void>) | null
  ) => void
  uploadImageFnRef: React.MutableRefObject<
    ((loader: (l: boolean) => void) => () => Promise<void>) | null
  >
}

const StepContext = createContext<StepContextType>(undefined!)

export const StepProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)

  const uploadImageFnRef = React.useRef<
    ((loader: (l: boolean) => void) => () => Promise<void>) | null
  >(null)

  const setUploadImageFn = useCallback(
    (fn: ((loader: (l: boolean) => void) => () => Promise<void>) | null) => {
      uploadImageFnRef.current = fn
    },
    []
  )

  const excludedPaths = useMemo(
    () => ['/', '/privacy', '/accessibility', '/terms', '/claims'],
    []
  )

  const getStorageKey = (pathname: string) => `activeStep-${pathname}`

  const getStepFromHash = () => {
    const hash = window.location.hash
    const step = Number(hash.replace('#step', ''))
    return isNaN(step) ? null : step
  }

  useEffect(() => {
    const updateActiveStep = () => {
      const pathname = window.location.pathname
      const hashStep = getStepFromHash()
      const savedStep = localStorage.getItem(getStorageKey(pathname))

      if (excludedPaths.includes(pathname)) return

      if (hashStep !== null) setActiveStep(hashStep)
      else if (savedStep) setActiveStep(Number(savedStep))
      else setActiveStep(0)
    }

    updateActiveStep()

    const handleLocationChange = () => updateActiveStep()

    window.addEventListener('popstate', handleLocationChange)
    window.addEventListener('hashchange', handleLocationChange)

    return () => {
      window.removeEventListener('popstate', handleLocationChange)
      window.removeEventListener('hashchange', handleLocationChange)
    }
  }, [excludedPaths])

  useEffect(() => {
    const pathname = window.location.pathname
    if (excludedPaths.includes(pathname)) return

    localStorage.setItem(getStorageKey(pathname), String(activeStep))
    window.location.hash = `#step${activeStep}`
  }, [activeStep, excludedPaths])

  const handleNext = useCallback(async () => {
    const pathname = window.location.pathname
    const isRecommendationForm = pathname.includes('/recommendations/')
    const isCredentialForm = pathname.includes('/credentialForm')

    const shouldTriggerUpload =
      (isCredentialForm && activeStep === 3) || (isRecommendationForm && activeStep === 2)

    if (shouldTriggerUpload && uploadImageFnRef.current) {
      setLoading(true)
      try {
        const uploadFnExecutor = uploadImageFnRef.current(setLoading)
        await uploadFnExecutor()
      } catch (error) {
        console.error('Error during image upload:', error)
      } finally {
        setLoading(false)
      }
    }
    setActiveStep(prev => prev + 1)
  }, [activeStep])

  const handleBack = useCallback(() => {
    setActiveStep(prev => (prev > 0 ? prev - 1 : 0))
  }, [])

  const contextValue = useMemo(
    () => ({
      activeStep,
      loading,
      setLoading,
      setActiveStep,
      handleNext,
      handleBack,
      setUploadImageFn,
      uploadImageFnRef
    }),
    [activeStep, loading, setLoading, handleNext, handleBack, setUploadImageFn]
  )

  return <StepContext.Provider value={contextValue}>{children}</StepContext.Provider>
}

export const useStepContext = () => useContext(StepContext)
