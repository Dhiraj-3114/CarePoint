import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER, 
        pass: process.env.MAIL_PASSWORD, 
      },
    })

    const mailOptions = {
      from: `"CarePoint" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    }

    await transporter.sendMail(mailOptions)
    return true

  } catch (error) {
    console.log('Email sending error:', error.message)
    return false
  }
}

export default sendEmail
