// NotFound.js

import React from 'react'
import { Link } from 'react-router-dom' // If you're using React Router

function NotFound() {
	return (
		<div style={styles.container}>
			<h1 style={styles.errorCode}>404</h1>
			<p style={styles.message}>
				Oops! The page you are looking for does not exist.
			</p>
			<Link to="/" style={styles.link}>
				Go Home
			</Link>
		</div>
	)
}

const styles = {
	container: {
		display: 'flex',
		flexDirection: 'column',
		height: '100vh',
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
	},
	errorCode: {
		fontSize: '5rem',
		margin: 0,
	},
	message: {
		fontSize: '1.5rem',
	},
	link: {
		marginTop: '1rem',
		fontSize: '1rem',
		textDecoration: 'none',
		color: 'blue',
		border: '1px solid blue',
		padding: '0.5rem 1rem',
		borderRadius: '4px',
	},
}

export default NotFound
