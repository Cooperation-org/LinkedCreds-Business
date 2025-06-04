import { doc, setDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './config/firebase'

interface VerificationCode {
  code: string
  email: string
  expiresAt: number
  createdAt: number
}

/**
 * Stores a verification code in Firestore with a 10-minute expiration time
 */
export const storeVerificationCode = async (
  email: string,
  code: string,
  expiresInMinutes = 10
): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized')
    }

    const now = Date.now()
    const expiresAt = now + expiresInMinutes * 60 * 1000 // Convert minutes to milliseconds

    const verificationData: VerificationCode = {
      code,
      email: email.toLowerCase(),
      expiresAt,
      createdAt: now
    }

    const docRef = doc(db, 'verificationCodes', email.toLowerCase())
    await setDoc(docRef, verificationData)
  } catch (error: any) {
    console.error('Error storing verification code:', error.message)
    if (error.message?.includes('Firebase is not initialized')) {
      throw new Error('Firebase is not properly initialized. Please check your environment variables.')
    }
    throw error
  }
}

/**
 * Retrieves a verification code from Firestore
 */
export const getVerificationCode = async (email: string): Promise<string | null> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized')
    }

    const docRef = doc(db, 'verificationCodes', email.toLowerCase())
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return null
    }

    const data = docSnap.data() as VerificationCode

    // Check if the code has expired
    if (Date.now() > data.expiresAt) {
      // Delete expired code
      await deleteVerificationCode(email)
      return null
    }

    return data.code
  } catch (error: any) {
    console.error('Error retrieving verification code:', error.message)
    if (error.message?.includes('Firebase is not initialized')) {
      throw new Error('Firebase is not properly initialized. Please check your environment variables.')
    }
    throw error
  }
}

/**
 * Deletes a verification code from Firestore
 */
export const deleteVerificationCode = async (email: string): Promise<void> => {
  try {
    if (!db) {
      throw new Error('Firebase Firestore is not initialized')
    }

    const docRef = doc(db, 'verificationCodes', email.toLowerCase())
    await deleteDoc(docRef)
  } catch (error: any) {
    console.error('Error deleting verification code:', error.message)
    if (error.message?.includes('Firebase is not initialized')) {
      throw new Error('Firebase is not properly initialized. Please check your environment variables.')
    }
    throw error
  }
} 