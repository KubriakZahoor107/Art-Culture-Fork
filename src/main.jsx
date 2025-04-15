import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { AuthProvider } from './Context/AuthContext'
import App from './assets/screens/home/Home.jsx'
import '/src/i18n/config'
import '/src/styles/index.scss'
const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<App />
			</AuthProvider>
		</QueryClientProvider>
	</React.StrictMode>,
)
