// src/components/LazyImage.jsx
import { useEffect, useRef, useState } from 'react'

function LazyImage({ src, alt, className, onClick }) {
	const [isVisible, setIsVisible] = useState(false)
	const imgRef = useRef()

	useEffect(() => {
		let observer
		if (imgRef.current) {
			observer = new IntersectionObserver(
				entries => {
					entries.forEach(entry => {
						if (entry.isIntersecting) {
							setIsVisible(true)
							observer.unobserve(imgRef.current)
						}
					})
				},
				{
					threshold: 0.1,
				}
			)
			observer.observe(imgRef.current)
		}
		return () => {
			if (observer && observer.unobserve) {
				observer.unobserve(imgRef.current)
			}
		}
	}, [])

	return (
		<img
			ref={imgRef}
			src={isVisible ? src : ''}
			alt={alt}
			className={className}
			loading='lazy'
			onClick={onClick}
			style={{ cursor: onClick ? 'pointer' : 'default' }}
		/>
	)
}

export default React.memo(LazyImage)
