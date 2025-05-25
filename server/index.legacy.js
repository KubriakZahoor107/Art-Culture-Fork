import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import app from './app.js' // Import the app from app.js

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Define PORT
const PORT = process.env.PORT || 5000 // Use a port that doesn't conflict with your frontend

// Initialize Prisma Client
const prisma = new PrismaClient()

// Serve static files from the React app's build directory (if applicable)
app.use(express.static(path.join(__dirname, '../dist')))

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../dist', 'index.html'))
})

app.use('/uploads', express.static(path.join(__dirname, './uploads')))

// Start the server and connect to the database
async function startServer() {
	try {
		// Connect to the database
		await prisma.$connect()
		console.log('Connected to the database successfully.')

		// Start listening for incoming requests
		app.listen(PORT, () => {
			console.log(
				`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`
			)
		})
	} catch (error) {
		console.error('Error starting the server:', error)
		await prisma.$disconnect()
		process.exit(1)
	}
}

startServer()

// Handle unhandled promise rejections and exceptions
process.on('unhandledRejection', async (reason, promise) => {
	console.error('Unhandled Rejection:', reason)
	await prisma.$disconnect()
	process.exit(1)
})

process.on('uncaughtException', async error => {
	console.error('Uncaught Exception:', error)
	await prisma.$disconnect()
	process.exit(1)
})

// Handle graceful shutdown
process.on('SIGINT', async () => {
	console.log('SIGINT received. Shutting down gracefully...')
	await prisma.$disconnect()
	process.exit(0)
})

process.on('SIGTERM', async () => {
	console.log('SIGTERM received. Shutting down gracefully...')
	await prisma.$disconnect()
	process.exit(0)
})
