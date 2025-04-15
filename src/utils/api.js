// src/utils/api.js

import axios from 'axios'
const host = window.location.hostname
const isLocalhost = host === 'localhost' || host === '127.0.0.1'
// Create an instance of axios with default configurations
const API = axios.create({
	baseURL: isLocalhost
		? 'http://localhost:5000/api/'
		: 'https://art.playukraine.com/api/',
	timeout: 10000, // Optional: set a timeout for requests
	headers: {
		'Content-Type': 'application/json',
	},
})

// Add a request interceptor to include the token in headers
API.interceptors.request.use(
	config => {
		const token = localStorage.getItem('token') // Or use cookies
		if (token) {
			config.headers.Authorization = `Bearer ${token}`
			console.log('Authorization header set:', config.headers.Authorization)
		}
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

// Add a response interceptor to handle responses globally
API.interceptors.response.use(
	response => response,
	error => {
		// You can handle specific status codes here
		if (error.response && error.response.status === 401) {
			// Handle unauthorized access (e.g., redirect to login)
			window.location.href = '/login'
		}
		return Promise.reject(error)
	}
)

export default API
