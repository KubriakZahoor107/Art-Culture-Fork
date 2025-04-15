import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

function AddressSearch({ onSelect }) {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState([])
	const [loading, setLoading] = useState(false)
	const [selected, setSelected] = useState(false)
	const debounceRef = useRef(null)

	useEffect(() => {
		if (selected) return

		if (debounceRef.current) {
			clearTimeout(debounceRef.current)
		}

		debounceRef.current = setTimeout(() => {
			if (query.length >= 3) {
				fetchData()
			} else {
				setResults([])
			}
			setQuery(query)
		}, 500)

		return () => {
			if (debounceRef.current) clearTimeout(debounceRef.current)
		}
	}, [query, selected])
	const fetchData = async () => {
		setLoading(true)
		try {
			const response = await axios.get('/api/geo', {
				params: { q: query },
			})
			setResults(response.data || [])
		} catch (error) {
			console.error('Error fetching data:', error)
		} finally {
			setLoading(false)
		}
	}

	const handleSelect = (item) => {
		const lat = item.lat
		const lon = item.lon
		const displayName = item.display_name

		if (onSelect) {
			onSelect({ lat, lon, address: displayName })
		}
		setQuery(displayName)
		setResults([])
		setSelected(true)
	}

	const handleChange = (e) => {
		const newValue = e.target.value
		setQuery(newValue)
		setSelected(false)
	}

	return (
		<div style={{ position: 'relative' }}>
			<input
				type="text"
				value={query}
				onChange={handleChange}
				placeholder="Пошук Адреси"
				style={{ width: '100%', padding: '8px' }}
			/>
			{loading && <div>Пошук...</div>}
			{results.length > 0 && (
				<ul
					style={{
						position: 'absolute',
						background: '#fff',
						listStyleType: 'none',
						margin: 0,
						padding: '8px',
						width: '100%',
						border: '1px solid #ccc',
						zIndex: 1000,
					}}
				>
					{results.map((item, index) => (
						<li
							key={index}
							onClick={() => handleSelect(item)}
							style={{ cursor: 'pointer', padding: '4px' }}
						>
							{item.display_name}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default AddressSearch
