const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${token}`

  const mailOptions = {
    from: `"SocialFeed" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your SocialFeed account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #4f46e5;">Welcome to SocialFeed!</h2>
        <p>Thanks for signing up. Click the button below to verify your email address:</p>
        <a href="${verifyUrl}"
           style="display: inline-block; padding: 12px 24px; background: #4f46e5; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">
          Or copy this link: <br>${verifyUrl}
        </p>
        <p style="color: #999; font-size: 12px;">
          This link expires in 1 hour. If you didn't sign up, ignore this email.
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

module.exports = { sendVerificationEmail }