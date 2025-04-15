const role = (...roles) => {
	return (req, res, next) => {
		if (!req.user) {
			console.error('No user found on request')
			return res.status(401).json({ error: 'Unauthorized' })
		}

		const userRole = req.user.role.trim().toLowerCase()
		const allowedRoles = roles.map(r => r.toLowerCase())

		console.log('role middleware - req.user.role:', userRole)
		console.log('Allowed roles:', allowedRoles)

		if (allowedRoles.length && !allowedRoles.includes(userRole)) {
			console.error(`User role "${userRole}" is not allowed`)
			return res.status(403).json({ error: 'Forbidden' })
		}

		next()
	}
}

export default role
