// src/components/ProtectedRoute.jsx

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../Context/AuthContext'

const ProtectedRoute = ({ children, roles = [] }) => {
	const { isLoggedIn, user } = useAuth()

	if (!isLoggedIn || !user) {
		return <Navigate to='/login' replace />
	}

	if (roles.length && !roles.includes(user.role)) {
		// User does not have the required role
		return <Navigate to='/unauthorized' replace />
	}

	return children
}

export default ProtectedRoute
