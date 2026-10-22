const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_KEY
  }
})

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${token}`

  const mailOptions = {
    from: `"SocialFeed" <${process.env.BREVO_SENDER_EMAIL}>`,
    to: email,
    subject: 'Verify your SocialFeed account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0d9488;">Welcome to SocialFeed!</h2>
        <p>Click the button below to verify your email address:</p>
        <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #0d9488; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Verify Email</a>
        <p style="color: #666; font-size: 14px;">Or copy this link: <br>${verifyUrl}</p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

module.exports = { sendVerificationEmail }