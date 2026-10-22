const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 15000
})

const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${token}`

  const mailOptions = {
    from: `"SocialFeed" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify your SocialFeed account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #0d9488;">Welcome to SocialFeed!</h2>
        <p>Thanks for signing up. Click the button below to verify your email address:</p>
        <a href="${verifyUrl}"
           style="display: inline-block; padding: 12px 24px; background: #0d9488; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">
          Verify Email
        </a>
        <p style="color: #666; font-size: 14px;">
          Or copy this link: <br>${verifyUrl}
        </p>
      </div>
    `
  }

  await transporter.sendMail(mailOptions)
}

module.exports = { sendVerificationEmail }