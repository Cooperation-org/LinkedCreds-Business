import { NextRequest, NextResponse } from 'next/server'
import { rateLimit } from '../../../utils/email-verification/rate-limit'
import { Resend } from 'resend'
import { storeVerificationCode } from '../../../firebase/verification'

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY)

const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 1000
})

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown'

    try {
      await limiter.check(10, ip) // Increased to 10 requests per minute
    } catch (error) {
      return NextResponse.json(
        { error: 'Too many verification attempts. Please try again later.' },
        { status: 429 }
      )
    }

    const { email, purpose, metadata } = await request.json()

    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Valid email address is required' },
        { status: 400 }
      )
    }

    // Generate verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString()

    try {
      // Store code in Firebase
      await storeVerificationCode(email, code)
    } catch (error: any) {
      console.error('Error storing verification code:', error.message)
      if (error.message?.includes('Firebase is not properly initialized')) {
        return NextResponse.json(
          { error: 'Service configuration error. Please try again later.' },
          { status: 500 }
        )
      }
      throw error
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'AllSkillsCount <noreply@allskillscount.org>',
      to: email,
      subject: 'Your Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #202E5B; margin-bottom: 20px;">Email Verification</h1>
          <p style="font-size: 16px; line-height: 1.5; color: #333;">Your verification code is:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <strong style="font-size: 24px; color: #202E5B;">${code}</strong>
          </div>
          <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply.</p>
        </div>
      `
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in verification send:', error.message)
    return NextResponse.json(
      { error: 'Internal server error. Please try again later.' },
      { status: 500 }
    )
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function GET() {
  return NextResponse.json({
    status: 'API is running',
    endpoint: 'Email verification endpoint',
    method: 'POST requires: { email, purpose (optional), metadata (optional) }'
  })
}
