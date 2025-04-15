import nodemailer from 'nodemailer'

const sendEmail = async (to, subject, text, html) => {
	// Configure transporter
	const transporter = nodemailer.createTransport({
		service: 'Gmail', // Use your email service
		host: 'smtp.gmail.com',
		port: 587,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	})
	//transporter.verify().then(console.log).catch(console.error);

	// Email options
	const mailOptions = {
		from: process.env.EMAIL_FROM,
		to,
		subject,
		text,
		html,
	}

	// Send email
	await transporter.sendMail(mailOptions)
}

export default sendEmail
