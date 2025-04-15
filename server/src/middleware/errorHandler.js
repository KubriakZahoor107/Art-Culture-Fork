const errorHandler = (err, req, res, next) => {
	console.error(err.stack)
	console.error('Error', err)
	if (res.headersSent) {
		return next(err)
	}

	if (err.name === 'ValidationError') {
		return res.status(400).json({ error: err.message })
	}
	res.status(500).json({
		error: 'An unexpected error occurred. Please try again later.',
	})
	res.status(500).json({
		error: err.message || 'Internal Server Error',
	})
}

export default errorHandler
