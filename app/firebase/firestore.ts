import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  FieldValue,
  serverTimestamp,
  increment
} from 'firebase/firestore'
import { db, auth } from './config/firebase' // Import db and auth

// Function to get user email prefix
const getUserEmailPrefix = (email: string | null | undefined): string | null => {
  if (!email) return null
  return email.split('@')[0]
}

// Firestore data structures (matching your schema)
export interface CredentialsIssued {
  skill: number
  employment: number
  performanceReview: number
  volunteer: number
  idVerification: number
}

interface ClickRates {
  requestRecommendation: number
  shareCredential: number
}

export interface EvidenceAttachmentRates {
  skillVCs: number
  employmentVCs: number
  volunteerVCs: number
  performanceReviews: number
}

interface UserAnalyticsData {
  email: string
  credentialsIssued: CredentialsIssued
  clickRates: ClickRates
  evidenceAttachmentRates: EvidenceAttachmentRates
  lastActivity: string
}

// Function to get or create user analytics document
export const getUserAnalytics = async (
  userEmail: string
): Promise<UserAnalyticsData | null> => {
  const emailPrefix = getUserEmailPrefix(userEmail)
  if (!emailPrefix) {
    console.error('User email is invalid or not available.')
    return null
  }

  const userDocRef = doc(db, 'users', emailPrefix)
  const userDocSnap = await getDoc(userDocRef)

  if (userDocSnap.exists()) {
    const data = userDocSnap.data()
    if (data.lastActivity && typeof data.lastActivity.toDate === 'function') {
      data.lastActivity = data.lastActivity.toDate().toISOString()
    }
    return data as UserAnalyticsData
  } else {
    console.log(`No document found for ${emailPrefix}, creating a new one.`)
    const now = new Date().toISOString()
    const defaultData: UserAnalyticsData = {
      email: userEmail,
      credentialsIssued: {
        skill: 0,
        employment: 0,
        performanceReview: 0,
        volunteer: 0,
        idVerification: 0
      },
      clickRates: { requestRecommendation: 0, shareCredential: 0 },
      evidenceAttachmentRates: {
        skillVCs: 0,
        employmentVCs: 0,
        volunteerVCs: 0,
        performanceReviews: 0
      },
      lastActivity: now
    }
    try {
      await setDoc(userDocRef, defaultData)
      return defaultData
    } catch (error) {
      console.error('Error creating user document:', error)
      return null
    }
  }
}

// Function to update click rates
export const updateClickRates = async (
  userEmail: string,
  clickType: keyof ClickRates
): Promise<void> => {
  const emailPrefix = getUserEmailPrefix(userEmail)
  if (!emailPrefix) {
    console.error('User email is invalid or not available for updating click rates.')
    return
  }
  const userDocRef = doc(db, 'users', emailPrefix)

  try {
    await updateDoc(userDocRef, {
      email: userEmail,
      [`clickRates.${clickType}`]: increment(1),
      lastActivity: serverTimestamp()
    })
    console.log(`Successfully incremented/updated ${clickType} for ${emailPrefix}`)
  } catch (error: any) {
    console.warn(
      `Failed to update document for ${emailPrefix} (it might not exist). Attempting to create. Error:`,
      error.message || error
    )

    const initialClickRates: ClickRates = {
      requestRecommendation: 0,
      shareCredential: 0
    }
    initialClickRates[clickType] = 1

    const dataToSet: Omit<UserAnalyticsData, 'lastActivity'> & {
      lastActivity: FieldValue
    } = {
      email: userEmail,
      credentialsIssued: {
        skill: 0,
        employment: 0,
        performanceReview: 0,
        volunteer: 0,
        idVerification: 0
      },
      clickRates: initialClickRates,
      evidenceAttachmentRates: {
        skillVCs: 0,
        employmentVCs: 0,
        volunteerVCs: 0,
        performanceReviews: 0
      },
      lastActivity: serverTimestamp()
    }

    try {
      await setDoc(userDocRef, dataToSet)
      console.log(
        `Successfully created document for ${emailPrefix} and set initial ${clickType}`
      )
    } catch (setDocError: any) {
      console.error(
        `Error creating document for ${emailPrefix} after update failed:`,
        setDocError.message || setDocError
      )
    }
  }
}

// Function to update credentials issued
export const updateCredentialsIssued = async (
  userEmail: string,
  credentialType: keyof CredentialsIssued,
  count: number
): Promise<void> => {
  const emailPrefix = getUserEmailPrefix(userEmail)
  if (!emailPrefix) {
    console.error('User email is invalid for updating credentials.')
    return
  }
  const userDocRef = doc(db, 'users', emailPrefix)
  try {
    await updateDoc(userDocRef, {
      email: userEmail,
      [`credentialsIssued.${credentialType}`]: count,
      lastActivity: serverTimestamp()
    })
    console.log(`Updated ${credentialType} count for ${emailPrefix} to ${count}`)
  } catch (error: any) {
    const errorMessage =
      typeof error.message === 'string' ? error.message.toLowerCase() : ''
    if (error.code === 'not-found' || errorMessage.includes('no document to update')) {
      console.warn(
        `Document not found for ${emailPrefix} during credential update. Creating document.`
      )
      const initialCredentials: CredentialsIssued = {
        skill: 0,
        employment: 0,
        performanceReview: 0,
        volunteer: 0,
        idVerification: 0
      }
      initialCredentials[credentialType] = count
      const dataToSet: Omit<UserAnalyticsData, 'lastActivity'> & {
        lastActivity: FieldValue
      } = {
        email: userEmail,
        credentialsIssued: initialCredentials,
        clickRates: { requestRecommendation: 0, shareCredential: 0 },
        evidenceAttachmentRates: {
          skillVCs: 0,
          employmentVCs: 0,
          volunteerVCs: 0,
          performanceReviews: 0
        },
        lastActivity: serverTimestamp()
      }
      try {
        await setDoc(userDocRef, dataToSet)
        console.log(
          `Created document and set ${credentialType} count for ${emailPrefix} to ${count}`
        )
      } catch (setDocError: any) {
        console.error(
          `Error creating document for ${emailPrefix} after credential update failed:`,
          setDocError.message || setDocError
        )
      }
    } else {
      console.error('Error updating credentials issued:', error.message || error)
    }
  }
}

// Function to increment a specific credential type count
export const incrementCredentialTypeCount = async (
  userEmail: string,
  credentialType: keyof CredentialsIssued
): Promise<void> => {
  const emailPrefix = getUserEmailPrefix(userEmail)
  if (!emailPrefix) {
    console.error('User email is invalid for incrementing credential type count.')
    return
  }
  const userDocRef = doc(db, 'users', emailPrefix)

  try {
    await updateDoc(userDocRef, {
      email: userEmail,
      [`credentialsIssued.${credentialType}`]: increment(1),
      lastActivity: serverTimestamp()
    })
    console.log(
      `Successfully incremented credentialsIssued.${credentialType} for ${emailPrefix}`
    )
  } catch (error: any) {
    console.error(
      `Error incrementing credentialsIssued.${credentialType} for ${emailPrefix}:`,
      error.message || error
    )
    // Attempt to create the document if it doesn't exist, mirroring other update functions
    if (
      error.code === 'not-found' ||
      error.message?.toLowerCase().includes('no document to update')
    ) {
      console.warn(
        `Document not found for ${emailPrefix}. Creating document with initial count for ${credentialType}.`
      )
      const initialCredentials: CredentialsIssued = {
        skill: 0,
        employment: 0,
        performanceReview: 0,
        volunteer: 0,
        idVerification: 0
      }
      initialCredentials[credentialType] = 1 // Set initial count to 1

      const dataToSet: Omit<UserAnalyticsData, 'lastActivity'> & {
        lastActivity: FieldValue
      } = {
        email: userEmail,
        credentialsIssued: initialCredentials,
        clickRates: { requestRecommendation: 0, shareCredential: 0 },
        evidenceAttachmentRates: {
          skillVCs: 0,
          employmentVCs: 0,
          volunteerVCs: 0,
          performanceReviews: 0
        },
        lastActivity: serverTimestamp()
      }
      try {
        await setDoc(userDocRef, dataToSet)
        console.log(
          `Created document for ${emailPrefix} and set initial ${credentialType} count to 1.`
        )
      } catch (setDocError: any) {
        console.error(
          `Error creating document for ${emailPrefix} after increment failed:`,
          setDocError.message || setDocError
        )
      }
    }
  }
}

// Function to increment a specific evidence attachment rate
export const incrementEvidenceAttachmentRate = async (
  userEmail: string,
  evidenceType: keyof EvidenceAttachmentRates
): Promise<void> => {
  const emailPrefix = getUserEmailPrefix(userEmail)
  if (!emailPrefix) {
    console.error('User email is invalid for incrementing evidence attachment rate.')
    return
  }
  const userDocRef = doc(db, 'users', emailPrefix)

  try {
    await updateDoc(userDocRef, {
      email: userEmail,
      [`evidenceAttachmentRates.${evidenceType}`]: increment(1),
      lastActivity: serverTimestamp()
    })
    console.log(
      `Successfully incremented evidenceAttachmentRates.${evidenceType} for ${emailPrefix}`
    )
  } catch (error: any) {
    console.error(
      `Error incrementing evidenceAttachmentRates.${evidenceType} for ${emailPrefix}:`,
      error.message || error
    )
    if (
      error.code === 'not-found' ||
      error.message?.toLowerCase().includes('no document to update')
    ) {
      console.warn(
        `Document not found for ${emailPrefix}. Creating document with initial rate for ${evidenceType}.`
      )
      const initialRates: EvidenceAttachmentRates = {
        skillVCs: 0,
        employmentVCs: 0,
        volunteerVCs: 0,
        performanceReviews: 0
      }
      initialRates[evidenceType] = 1

      const dataToSet: Omit<UserAnalyticsData, 'lastActivity'> & {
        lastActivity: FieldValue
      } = {
        email: userEmail,
        credentialsIssued: {
          skill: 0,
          employment: 0,
          performanceReview: 0,
          volunteer: 0,
          idVerification: 0
        },
        clickRates: { requestRecommendation: 0, shareCredential: 0 },
        evidenceAttachmentRates: initialRates,
        lastActivity: serverTimestamp()
      }
      try {
        await setDoc(userDocRef, dataToSet)
        console.log(
          `Created document for ${emailPrefix} and set initial ${evidenceType} rate to 1.`
        )
      } catch (setDocError: any) {
        console.error(
          `Error creating document for ${emailPrefix} after increment failed:`,
          setDocError.message || setDocError
        )
      }
    }
  }
}

// Function to update evidence attachment rates
export const updateEvidenceAttachmentRates = async (
  userEmail: string,
  evidenceType: keyof EvidenceAttachmentRates,
  rate: number
): Promise<void> => {
  const emailPrefix = getUserEmailPrefix(userEmail)
  if (!emailPrefix) {
    console.error('User email is invalid for updating evidence rates.')
    return
  }
  const userDocRef = doc(db, 'users', emailPrefix)
  try {
    await updateDoc(userDocRef, {
      email: userEmail,
      [`evidenceAttachmentRates.${evidenceType}`]: rate,
      lastActivity: serverTimestamp()
    })
    console.log(`Updated ${evidenceType} rate for ${emailPrefix} to ${rate}`)
  } catch (error: any) {
    const errorMessage =
      typeof error.message === 'string' ? error.message.toLowerCase() : ''
    if (error.code === 'not-found' || errorMessage.includes('no document to update')) {
      console.warn(
        `Document not found for ${emailPrefix} during evidence rate update. Creating document.`
      )
      const initialEvidenceRates: EvidenceAttachmentRates = {
        skillVCs: 0,
        employmentVCs: 0,
        volunteerVCs: 0,
        performanceReviews: 0
      }
      initialEvidenceRates[evidenceType] = rate

      const dataToSet: Omit<UserAnalyticsData, 'lastActivity'> & {
        lastActivity: FieldValue
      } = {
        email: userEmail,
        evidenceAttachmentRates: initialEvidenceRates,
        credentialsIssued: {
          skill: 0,
          employment: 0,
          performanceReview: 0,
          volunteer: 0,
          idVerification: 0
        },
        clickRates: { requestRecommendation: 0, shareCredential: 0 },
        lastActivity: serverTimestamp()
      }
      try {
        await setDoc(userDocRef, dataToSet)
        console.log(
          `Created document and set ${evidenceType} rate for ${emailPrefix} to ${rate}`
        )
      } catch (setDocError: any) {
        console.error(
          `Error creating document for ${emailPrefix} after evidence rate update failed:`,
          setDocError.message || setDocError
        )
      }
    } else {
      console.error('Error updating evidence attachment rates:', error.message || error)
    }
  }
}

export { db, auth } // Still export db and auth for other potential consumers, but they are now imported

// Function to get global analytics for all users
export const getGlobalAnalytics = async () => {
  try {
    const { collection, getDocs } = await import('firebase/firestore')
    const usersCollection = collection(db, 'users')
    const querySnapshot = await getDocs(usersCollection)

    let totalUsers = 0
    let activeUsers = 0
    const globalData = {
      totalUsers: 0,
      activeUsers: 0,
      credentialsIssued: {
        skill: 0,
        employment: 0,
        performanceReview: 0,
        volunteer: 0,
        idVerification: 0
      },
      clickRates: {
        requestRecommendation: 0,
        shareCredential: 0
      },
      evidenceAttachmentRates: {
        skillVCs: 0,
        employmentVCs: 0,
        volunteerVCs: 0,
        performanceReviews: 0
      }
    }

    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    querySnapshot.forEach(doc => {
      const data = doc.data() as UserAnalyticsData
      totalUsers++

      // Check if user is active (had activity in last 30 days)
      const lastActivity = data.lastActivity ? new Date(data.lastActivity) : null
      if (lastActivity && lastActivity > thirtyDaysAgo) {
        activeUsers++
      }

      // Aggregate credentials issued
      if (data.credentialsIssued) {
        globalData.credentialsIssued.skill += data.credentialsIssued.skill || 0
        globalData.credentialsIssued.employment += data.credentialsIssued.employment || 0
        globalData.credentialsIssued.performanceReview +=
          data.credentialsIssued.performanceReview || 0
        globalData.credentialsIssued.volunteer += data.credentialsIssued.volunteer || 0
        globalData.credentialsIssued.idVerification +=
          data.credentialsIssued.idVerification || 0
      }

      // Aggregate click rates
      if (data.clickRates) {
        globalData.clickRates.requestRecommendation +=
          data.clickRates.requestRecommendation || 0
        globalData.clickRates.shareCredential += data.clickRates.shareCredential || 0
      }

      // Aggregate evidence attachment rates
      if (data.evidenceAttachmentRates) {
        globalData.evidenceAttachmentRates.skillVCs +=
          data.evidenceAttachmentRates.skillVCs || 0
        globalData.evidenceAttachmentRates.employmentVCs +=
          data.evidenceAttachmentRates.employmentVCs || 0
        globalData.evidenceAttachmentRates.volunteerVCs +=
          data.evidenceAttachmentRates.volunteerVCs || 0
        globalData.evidenceAttachmentRates.performanceReviews +=
          data.evidenceAttachmentRates.performanceReviews || 0
      }
    })

    globalData.totalUsers = totalUsers
    globalData.activeUsers = activeUsers

    return globalData
  } catch (error) {
    console.error('Error fetching global analytics:', error)
    return null
  }
}

// Interface for exported user data
export interface ExportUserData {
  email: string
  lastActivity: string | null
  isActive: boolean
  skillCredentials: number
  employmentCredentials: number
  performanceReviewCredentials: number
  volunteerCredentials: number
  idVerificationCredentials: number
  totalCredentials: number
  requestRecommendationClicks: number
  shareCredentialClicks: number
  totalClicks: number
  skillVCsEvidence: number
  employmentVCsEvidence: number
  volunteerVCsEvidence: number
  performanceReviewsEvidence: number
  totalEvidenceAttachments: number
}

// Function to get all users' individual data for export
export const getAllUsersAnalyticsData = async (): Promise<ExportUserData[] | null> => {
  try {
    const { collection, getDocs } = await import('firebase/firestore')
    const usersCollection = collection(db, 'users')
    const querySnapshot = await getDocs(usersCollection)

    const usersData: ExportUserData[] = []
    const now = new Date()
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    querySnapshot.forEach(doc => {
      const data = doc.data() as UserAnalyticsData

      // Process the lastActivity date
      let lastActivityDate = null
      let isActive = false

      if (data.lastActivity) {
        if (typeof data.lastActivity === 'string') {
          lastActivityDate = data.lastActivity
          isActive = new Date(data.lastActivity) > thirtyDaysAgo
        } else if (
          data.lastActivity &&
          typeof (data.lastActivity as any).toDate === 'function'
        ) {
          lastActivityDate = (data.lastActivity as any).toDate().toISOString()
          isActive = (data.lastActivity as any).toDate() > thirtyDaysAgo
        }
      }

      // Create a flattened structure for Excel export
      const userData = {
        email: data.email || '',
        lastActivity: lastActivityDate || '',
        isActive: isActive,

        // Credentials issued
        skillCredentials: data.credentialsIssued?.skill || 0,
        employmentCredentials: data.credentialsIssued?.employment || 0,
        performanceReviewCredentials: data.credentialsIssued?.performanceReview || 0,
        volunteerCredentials: data.credentialsIssued?.volunteer || 0,
        idVerificationCredentials: data.credentialsIssued?.idVerification || 0,
        totalCredentials:
          (data.credentialsIssued?.skill || 0) +
          (data.credentialsIssued?.employment || 0) +
          (data.credentialsIssued?.performanceReview || 0) +
          (data.credentialsIssued?.volunteer || 0) +
          (data.credentialsIssued?.idVerification || 0),

        // Click rates
        requestRecommendationClicks: data.clickRates?.requestRecommendation || 0,
        shareCredentialClicks: data.clickRates?.shareCredential || 0,
        totalClicks:
          (data.clickRates?.requestRecommendation || 0) +
          (data.clickRates?.shareCredential || 0),

        // Evidence attachment rates
        skillVCsEvidence: data.evidenceAttachmentRates?.skillVCs || 0,
        employmentVCsEvidence: data.evidenceAttachmentRates?.employmentVCs || 0,
        volunteerVCsEvidence: data.evidenceAttachmentRates?.volunteerVCs || 0,
        performanceReviewsEvidence: data.evidenceAttachmentRates?.performanceReviews || 0,
        totalEvidenceAttachments:
          (data.evidenceAttachmentRates?.skillVCs || 0) +
          (data.evidenceAttachmentRates?.employmentVCs || 0) +
          (data.evidenceAttachmentRates?.volunteerVCs || 0) +
          (data.evidenceAttachmentRates?.performanceReviews || 0)
      }

      usersData.push(userData as ExportUserData)
    })

    return usersData
  } catch (error) {
    console.error('Error fetching all users analytics data:', error)
    return null
  }
}
