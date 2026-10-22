const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify/${token}`

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'api-key': process.env.BREVO_API_KEY,
      'content-type': 'application/json'
    },
    body: JSON.stringify({
      sender: {
        name: 'SocialFeed',
        email: process.env.BREVO_SENDER_EMAIL
      },
      to: [{ email: email }],
      subject: 'Verify your SocialFeed account',
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
          <h2 style="color: #0d9488;">Welcome to SocialFeed!</h2>
          <p>Click the button below to verify your email address:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background: #0d9488; color: white; text-decoration: none; border-radius: 8px; margin: 16px 0;">Verify Email</a>
          <p style="color: #666; font-size: 14px;">Or copy this link: <br>${verifyUrl}</p>
        </div>
      `
    })
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('Brevo API Error:', errorText)
    throw new Error('Failed to send email via Brevo')
  }
  console.log('Verification email sent successfully via Brevo')
}

module.exports = { sendVerificationEmail }