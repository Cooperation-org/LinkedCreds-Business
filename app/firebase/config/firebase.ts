import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'

const cleanEnv = (v: string | undefined) => {
  if (!v) return undefined
  const trimmed = v.trim()
  // Secrets/env values sometimes get pasted with surrounding quotes.
  if (
    (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
  ) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

const firebaseConfig = {
  apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY),
  authDomain: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN),
  projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID),
  storageBucket: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET),
  messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
  appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID)
}

let app: FirebaseApp
let db: Firestore
let auth: Auth

// If Firebase env vars are missing/invalid (common in CI), initializing Auth can crash
// the entire app render. Allow explicitly disabling, and also skip init when config is absent.
const firebaseDisabled = process.env.NEXT_PUBLIC_DISABLE_FIREBASE === '1'
const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
)

export const firebaseEnabled = !firebaseDisabled && hasFirebaseConfig

if (firebaseEnabled) {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }

  db = getFirestore(app)
  auth = getAuth(app)
} else {
  // Keep exports stable for existing imports; consumers should ensure `firebaseEnabled`
  // (or required env vars) are present before calling Firestore/Auth operations.
  app = undefined as unknown as FirebaseApp
  db = undefined as unknown as Firestore
  auth = undefined as unknown as Auth
}

export { app, db, auth, firebaseConfig }
