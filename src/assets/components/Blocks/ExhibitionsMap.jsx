import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useEffect, useMemo } from 'react'
import 'react-leaflet'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import PropTypes from 'prop-types'

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
 *
 * @param {Array} exhibitions
 */

function AllExhibitionsMap({ exhibitions }) {
	console.log('AllExhibitionsMap -> exhibitions:', exhibitions)
	const validExhibitions = useMemo(() => {
		return Array.isArray(exhibitions)
			? exhibitions.filter(
					(exhibition) =>
						exhibition.address &&
						exhibition.latitude &&
						exhibition.longitude,
				)
			: []
	}, [exhibitions])

	const bounds = useMemo(() => {
		return validExhibitions.map((exhibition) => [
			parseFloat(exhibition.latitude),
			parseFloat(exhibition.longitude),
		])
	}, [validExhibitions])

	const defaultCenter = [49, 32]

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
			<FitBounds bounds={bounds} />
			{validExhibitions.map((exhibition) => {
				const position = [
					parseFloat(exhibition.latitude),
					parseFloat(exhibition.longitude),
				]
				return (
					<Marker key={exhibition.id} position={position}>
						<Popup>
							<div>
								<h3>
									{exhibition.title_en ||
										exhibition.title_uk ||
										'Виставки'}
								</h3>
								<p>{exhibition.address}</p>
							</div>
						</Popup>
					</Marker>
				)
			})}
		</MapContainer>
	)
}
AllExhibitionsMap.propTypes = {
	exhibitions: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			address: PropTypes.string,
			location_en: PropTypes.string,
			location_uk: PropTypes.string,
			latitude: PropTypes.string,
			longitude: PropTypes.string,
			title_en: PropTypes.string,
			title_uk: PropTypes.string,
			// ... other fields as necessary
		}),
	).isRequired,
}
export default AllExhibitionsMap
