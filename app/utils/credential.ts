import { CredentialEngine, GoogleDriveStorage } from '@cooperation/vc-storage'
import { FormData } from '../[formType]/form/types/Types'

interface RecommendationI {
  recommendationText: string
  qualifications: string
  expirationDate: string
  fullName: string
  howKnow: string
  explainAnswer: string
  portfolio: { googleId?: string; name: string; url: string }[]
}

function getCredentialEngine(accessToken: string): CredentialEngine {
  if (!accessToken) {
    throw new Error('Access token is required to instantiate CredentialEngine.')
  }
  const storage = new GoogleDriveStorage(accessToken)
  return new CredentialEngine(storage)
}

/**
 * Create a DID using MetaMask address
 * @param metaMaskAddress - The user's MetaMask address
 * @param accessToken - The access token for authentication
 * @returns DID Document, Key Pair, and Issuer ID
 */
export async function createDIDWithMetaMask(
  metaMaskAddress: string,
  accessToken: string
) {
  const credentialEngine = getCredentialEngine(accessToken)
  const { didDocument, keyPair } = await credentialEngine.createWalletDID(metaMaskAddress)
  return { didDocument, keyPair, issuerId: didDocument.id }
}

/**
 * Create a DID
 * @param accessToken - The access token for authentication
 * @returns DID Document, Key Pair, and Issuer ID
 */
export const createDID = async (accessToken: string) => {
  const credentialEngine = getCredentialEngine(accessToken)
  const { didDocument, keyPair } = await credentialEngine.createDID()
  console.log('DID:', didDocument)
  return { didDocument, keyPair, issuerId: didDocument.id }
}

/**
 * Sign a Verifiable Credential
 * @param accessToken - The access token for authentication
 * @param data - The data to include in the credential
 * @param issuerDid - The issuer's DID
 * @param keyPair - The key pair used for signing
 * @param type - The type of credential ('RECOMMENDATION' or 'VC')
 * @param formType - The form type to determine specific credential type
 * @param vcFileId - Optional VC file ID for recommendations
 * @returns The signed Verifiable Credential
 */
const signCred = async (
  accessToken: string,
  data: any,
  issuerDid: string,
  keyPair: string,
  type: 'RECOMMENDATION' | 'VC',
  formType?: string,
  vcFileId?: any
) => {
  if (!accessToken) {
    throw new Error('Access token is not provided')
  }

  console.log('[VC SIGNING] formType:', formType, 'type:', type)

  let signedVC
  try {
    const credentialEngine = getCredentialEngine(accessToken)

    if (type === 'RECOMMENDATION') {
      const formData = generateRecommendationData(data)
      console.log('[VC SIGNING] RECOMMENDATION data:', formData)
      signedVC = await credentialEngine.signVC({
        data: formData,
        type: 'RECOMMENDATION',
        keyPair,
        issuerId: issuerDid,
        vcFileId
      })
    } else {
      // Use specific credential signing methods based on form type
      const processedData = processCredentialData(data, formType)
      console.log('[VC SIGNING] VC data for formType:', formType, 'data:', processedData)

      switch (formType) {
        case 'role':
          signedVC = await credentialEngine.signEmploymentCredential(
            processedData,
            keyPair,
            issuerDid
          )
          break
        case 'volunteer':
          signedVC = await credentialEngine.signVolunteeringCredential(
            processedData,
            keyPair,
            issuerDid
          )
          break
        case 'performance-review':
          signedVC = await credentialEngine.signPerformanceReviewCredential(
            processedData,
            keyPair,
            issuerDid
          )
          break
        case 'skill':
        case 'identity-verification':
        default:
          // Use generic signVC for skills and other types
          signedVC = await credentialEngine.signVC({
            data: processedData,
            type: 'VC',
            keyPair,
            issuerId: issuerDid
          })
          break
      }
    }

    return signedVC
  } catch (error) {
    console.error('Error during VC signing:', error)
    throw error
  }
}

/**
 * Process credential data to match expected format for the package
 * @param data - The form data
 * @param formType - The form type to determine specific processing
 * @returns Processed data object
 */
const processCredentialData = (data: FormData, formType?: string) => {
  // For skills and identity verification, we need to transform the data into the old format
  if (formType === 'skill' || formType === 'identity-verification') {
    return {
      expirationDate: new Date(
        new Date().setFullYear(new Date().getFullYear() + 1)
      ).toISOString(),
      fullName: data.fullName || '',
      duration: data.credentialDuration || '',
      criteriaNarrative: data.credentialDescription || '',
      achievementDescription:
        typeof data.description === 'string'
          ? data.description
          : String(data.description || ''),
      achievementName: data.credentialName || '',
      portfolio:
        data.portfolio && data.portfolio.length > 0
          ? data.portfolio.map(({ googleId, ...rest }) => rest)
          : [{ name: '', url: '' }],
      evidenceLink: data?.evidenceLink || '',
      evidenceDescription: data.evidenceDescription || '',
      credentialType: formType || data.persons || ''
    }
  }

  // For employment, volunteer, and performance review, pass the form data directly
  const processedData = { ...data }

  // Remove UI-specific fields that shouldn't be in the credential
  delete processedData.showDuration
  delete processedData.currentVolunteer

  // Clean up portfolio data (remove googleId for the credential)
  if (processedData.portfolio && processedData.portfolio.length > 0) {
    processedData.portfolio = processedData.portfolio.map(({ googleId, ...rest }) => rest)
  }

  // Add required fields that might be missing
  if (!processedData.evidenceDescription) {
    processedData.evidenceDescription = ''
  }

  // Add expirationDate (required by the package)
  if (!processedData.expirationDate) {
    processedData.expirationDate = new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toISOString()
  }

  return processedData
}

/**
 * Generate credential data for 'RECOMMENDATION' type
 * @param data - The form data
 * @returns RecommendationI object
 */
const generateRecommendationData = (data: any): RecommendationI => {
  return {
    recommendationText: data.recommendationText,
    qualifications: data.qualifications,
    expirationDate: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1)
    ).toISOString(),
    fullName: data.fullName,
    howKnow: data.howKnow,
    explainAnswer: data.explainAnswer,
    portfolio: data.portfolio || []
  }
}

export { signCred }
