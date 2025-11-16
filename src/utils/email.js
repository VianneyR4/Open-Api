import nodemailer from 'nodemailer'

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
})

/**
 * Send verification email with code
 * @param {string} email - Recipient email
 * @param {string} code - Verification code
 * @returns {Promise<void>}
 */
export async function sendVerificationEmail(email, code) {
  try {
    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASSWORD in .env file')
      throw new Error('Email service not configured. Please set SMTP_USER and SMTP_PASSWORD in .env file')
    }

    const mailOptions = {
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: email,
      subject: 'K-caf - Code de vérification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">Vérification de connexion</h2>
          <p>Bonjour,</p>
          <p>Votre code de vérification pour accéder à votre compte est :</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <h1 style="color: #007bff; font-size: 32px; letter-spacing: 5px; margin: 0;">${code}</h1>
          </div>
          <p>Ce code est valide pendant 10 minutes.</p>
          <p>Si vous n'avez pas demandé ce code, veuillez ignorer cet email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 12px;">K-caf - Système de gestion</p>
        </div>
      `,
      text: `Votre code de vérification est : ${code}\n\nCe code est valide pendant 10 minutes.`,
    }

    await transporter.sendMail(mailOptions)
    console.log(`✅ Verification email sent to ${email}`)
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message)
    console.error('Full error details:', error)
    
    // Provide more helpful error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your SMTP_USER and SMTP_PASSWORD')
    } else if (error.code === 'ECONNECTION') {
      throw new Error('Could not connect to email server. Please check SMTP_HOST and SMTP_PORT')
    } else if (error.message.includes('Email service not configured')) {
      throw error
    }
    
    throw new Error(`Failed to send verification email: ${error.message}`)
  }
}

