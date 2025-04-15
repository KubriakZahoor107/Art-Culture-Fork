import 'leaflet/dist/leaflet.css'
import React from 'react'
import './styles/index.scss'
import App from '/src/assets/screens/home/Home.jsx'
import '/src/i18n/config'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<App />)
