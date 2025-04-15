import L from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
delete L.Icon.Default.prototype._getIconUrl

L.Icon.Default.mergeOptions({
	iconRetinaUrl,
	iconUrl,
	shadowUrl,
})

/**
 * MuseumMaps Component
 * @param {Object} props
 * @param {Object} props.museum - The museum object containing address and coordinates
 */
function MuseumMaps({ museum }) {
	// If there is at least one exhibition with coordinates, use it for center
	if (!museum || !museum.lat || !museum.lon) {
		return <div>Музей не має координат для відображення на карті.</div>
	}

	const position = [parseFloat(museum.lat), parseFloat(museum.lon)]

	const closeZoom = 19 // A closer zoom level

	return (
		<MapContainer
			center={position}
			zoom={closeZoom}
			style={{ height: '500px', width: '100%' }}
		>
			<TileLayer
				attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>

			<Marker position={position}>
				<Popup>
					<p>{museum.title}</p>
					<p>
						{museum.street}, {museum.house_number},<br />
						{museum.city}, {museum.country}, {museum.postcode}
					</p>
				</Popup>
			</Marker>
		</MapContainer>
	)
}
export default MuseumMaps
