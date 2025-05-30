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
  setActiveStep: (step: number) => void
  handleNext: () => Promise<void>
  handleBack: () => void
  setUploadImageFn: (fn: () => Promise<void>) => void
}

const StepContext = createContext<StepContextType>({
  activeStep: 0,
  loading: false,
  setActiveStep: () => {},
  handleNext: async () => {},
  handleBack: () => {},
  setUploadImageFn: () => () => {}
})

export const StepProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeStep, setActiveStep] = useState(0)
  const [uploadImageFn, setUploadImageFn] = useState<() => Promise<void>>(
    () => async () => {}
  )
  const [loading, setLoading] = useState(false)

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
    if (activeStep === 3 && typeof uploadImageFn === 'function') {
      setLoading(true)
      try {
        await uploadImageFn()
      } catch (error) {
        console.error('Error during image upload:', error)
      } finally {
        setLoading(false)
      }
    }
    setActiveStep(prev => prev + 1)
  }, [activeStep, uploadImageFn])

  const handleBack = useCallback(() => {
    setActiveStep(prev => (prev > 0 ? prev - 1 : 0))
  }, [])

  const contextValue = useMemo(
    () => ({
      activeStep,
      loading,
      setActiveStep,
      handleNext,
      handleBack,
      setUploadImageFn
    }),
    [activeStep, loading, handleNext, handleBack]
  )

  return <StepContext.Provider value={contextValue}>{children}</StepContext.Provider>
}

export const useStepContext = () => useContext(StepContext)
