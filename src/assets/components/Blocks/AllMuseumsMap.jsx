import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import React, { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

// Fix leaflet's icon issues
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
	iconRetinaUrl,
	iconUrl,
	shadowUrl,
})

function FitBounds({ bounds }) {
	const map = useMap()
	useEffect(() => {
		if (bounds.length > 0) {
			map.fitBounds(bounds, { padding: [50, 50] })
		}
	}, [bounds, map])
	return null
}

/**
 * Helper component to auto-fit bounds when museums change
 * @param {Array} museums
 */
function AllMuseumsMap({ museums }) {
	console.log('AllMuseumsMap -> museums:', museums)
	const validMuseums = museums.filter(
		(museum) =>
			museum.lat &&
			museum.lon &&
			museum.street &&
			museum.house_number &&
			museum.city &&
			museum.country &&
			museum.postcode,
	)

	const bounds = validMuseums.map((museum) => [
		parseFloat(museum.lat),
		parseFloat(museum.lon),
	])

	const defaultCenter = [49, 32] // somewhere in Central/Eastern Europe
	const defaultZoom = 6
	return (
		<MapContainer
			center={defaultCenter}
			zoom={defaultZoom}
			scrollWheelZoom={true}
			style={{ height: '500px', width: '70%' }}
		>
			<TileLayer
				attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			{/* Fit map bounds to show all valid museum markers */}
			<FitBounds bounds={bounds} />

			{validMuseums.map((museum) => {
				const position = [
					parseFloat(museum.lat),
					parseFloat(museum.lon),
				]
				return (
					<Marker key={museum.id} position={position}>
						<Popup>
							<h4>{museum.title}</h4>
							<p>
								{museum.street}, {museum.house_number}
								<br />
								{museum.city}, {museum.country}
								<br />
								{museum.postcode}
							</p>
						</Popup>
					</Marker>
				)
			})}
		</MapContainer>
	)
}

export default AllMuseumsMap
