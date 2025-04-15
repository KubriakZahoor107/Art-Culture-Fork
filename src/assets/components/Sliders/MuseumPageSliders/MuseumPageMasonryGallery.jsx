// ArtistPageMasonryGallery.jsx

import style from '@styles/components/Sliders/MasonrySlider/PageMasonryGallery.module.scss'
import { debounce } from 'lodash' // Using lodash's debounce
import PropTypes from 'prop-types'
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import TranslatedContent from '../../Blocks/TranslatedContent'

const MuseumPageMasonryGallery = ({ products, baseUrl, museum }) => {
	if (!products || products.length === 0) {
		console.warn('No products available for MuseumPageMasonryGallery.')
		return null // Or display a message if you prefer
	}

	// Refs for mutable values
	const positionRef = useRef(0)
	const enableTransitionRef = useRef(true)
	const { t, i18n } = useTranslation()
	const { id } = useParams()
	const currentLanguage = i18n.language
	const containerRef = useRef(null)
	const sliderRef = useRef(null)
	const [isPaused, setIsPaused] = useState(false)
	const [sliderWidth, setSliderWidth] = useState(0) // Width of one set of columns
	const [position, setPosition] = useState(0) // Current translateX position
	const speed = 0.5 // Pixels per frame
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedProductImages, setSelectedProductImages] = useState([])
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [selectedMuseum, setSelectedMuseum] = useState(null) // Initialize with null

	const animationDuration = sliderWidth / speed // in seconds or ms
	const navigate = useNavigate()
	// Zoom-related state variables
	const [zoomStates, setZoomStates] = useState([])

	// Carousel state
	const [currentSlide, setCurrentSlide] = useState(0)

	// Define the number of columns and custom scaling factor
	const customScaleFactor = 1.2 // Change this to scale images up or down

	const [enableTransition, setEnableTransition] = useState(true)

	const getBaseImageHeight = () => {
		const width = window.innerWidth
		if (width >= 1921) return 620
		if (width >= 1800) return 599
		if (width >= 1600) return 575
		if (width >= 1500) return 555
		if (width >= 1400) return 545
		if (width >= 1000) return 535
		if (width >= 900) return 525
		if (width >= 400) return 515
		return 599
	}

	const [baseImageHeight, setBaseImageHeight] = useState(getBaseImageHeight())

	// Determine the number of columns based on viewport width
	const getNumberOfColumns = () => {
		const width = window.innerWidth
		if (width < 600) return 2
		if (width < 900) return 4
		if (width < 1500) return 5
		if (width < 1800) return 6
		if (width > 1921) return 7
		return 7
	}

	const [numberOfColumns, setNumberOfColumns] = useState(getNumberOfColumns())

	// Define dynamic height patterns per column
	const columnHeightPatterns = [
		[33, 67], // Column 0: Top 33%, Middle 67%
		[20, 20, 60], // Column 1: Top 20%, Middle 20%, Bottom 60%
		[25, 50, 25], // Column 2: Top 25%, Middle 50%, Bottom 25%
		// Add more patterns as needed
	]

	// Memoize the images array to prevent unnecessary re-creations
	const images = useMemo(() => {
		return products.map((product) => {
			const mainImageSrc =
				product.images && product.images.length > 0
					? `${baseUrl}${product.images[0].imageUrl.replace('../../', '/')}`
					: '/Img/newsCardERROR.jpg' // Fallback image

			return {
				src: mainImageSrc,
				alt:
					product.title_en ||
					product.title_uk ||
					product.title ||
					'Artwork',
				productId: product.id,
				productImages: product.images,
			}
		})
	}, [products, baseUrl])

	// Prepare images with dimensions
	const [loadedImages, setLoadedImages] = useState([])

	useEffect(() => {
		if (images.length === 0) {
			console.warn('Images array is empty after mapping.')
			return
		}

		const imagePromises = images.map((imageObj) => {
			return new Promise((resolve) => {
				const img = new Image()
				img.src = imageObj.src
				img.onload = () => {
					console.log(`Image loaded: ${imageObj.src}`)
					resolve({
						...imageObj,
						width: img.width,
						height: img.height,
					})
				}
				img.onerror = () => {
					console.error('Error loading image:', imageObj.src)
					resolve({
						...imageObj,
						width: 0,
						height: 0,
					})
				}
			})
		})

		Promise.all(imagePromises).then((imgs) => {
			console.log('All images processed:', imgs)
			setLoadedImages(imgs)
		})
	}, [images])

	// Split images into columns
	const [columns, setColumns] = useState([])

	useEffect(() => {
		if (loadedImages.length === 0) {
			console.warn('No loaded images to distribute into columns.')
			return
		}

		const newColumns = Array.from({ length: numberOfColumns }, () => [])

		loadedImages.forEach((img, idx) => {
			newColumns[idx % numberOfColumns].push(img)
		})

		// Check if columns have actually changed
		const isColumnsEqual =
			newColumns.length === columns.length &&
			newColumns.every((col, idx) => {
				if (col.length !== columns[idx].length) return false
				return col.every(
					(img, imgIdx) => img.src === columns[idx][imgIdx]?.src,
				)
			})

		if (!isColumnsEqual) {
			console.log('Updating columns:', newColumns)
			setColumns(newColumns)
		} else {
			console.log('Columns unchanged.')
		}
	}, [loadedImages, numberOfColumns, columns])

	// Define scaledColumns state
	const [scaledColumns, setScaledColumns] = useState([])

	// Calculate scaled columns
	useLayoutEffect(() => {
		if (columns.length === 0) {
			console.warn('No columns available for scaling.')
			return
		}

		const columnWidth = 200 // Desired image width
		const newScaledColumns = columns.map((column) => {
			return column.map((img) => {
				const aspectRatio = img.height / img.width || 1
				const scaledWidth = columnWidth * customScaleFactor

				return {
					...img,
					scaledWidth,
					aspectRatio, // Added aspect ratio
				}
			})
		})

		console.log('Scaled columns calculated:', newScaledColumns)
		setScaledColumns(newScaledColumns)
	}, [columns, customScaleFactor])

	// Measure the total width of the slider accurately
	useLayoutEffect(() => {
		if (sliderRef.current) {
			const firstColumn = sliderRef.current.querySelector(
				`.${style.column}`,
			)
			if (firstColumn) {
				const columnStyles = getComputedStyle(firstColumn)
				const marginRight = parseInt(columnStyles.marginRight, 10)
				const width = firstColumn.offsetWidth + marginRight

				console.log(
					`First column offsetWidth: ${firstColumn.offsetWidth}px`,
				)
				console.log(`First column marginRight: ${marginRight}px`)
				console.log(`Calculated column total width: ${width}px`)
				console.log(`Number of columns: ${numberOfColumns}`)
				console.log(
					`Calculated sliderWidth: ${width * numberOfColumns}px`,
				)
				setSliderWidth(width * numberOfColumns) // Total width for all columns
			} else {
				console.warn('First column not found in sliderRef.')
			}
		}
	}, [scaledColumns, numberOfColumns, style.column])

	// Handle responsive columns with debounce
	useEffect(() => {
		const handleResize = debounce(() => {
			const newNumberOfColumns = getNumberOfColumns()
			const newBaseImageHeight = getBaseImageHeight()
			console.log(
				`Window resized. New number of columns: ${newNumberOfColumns}, New base image height: ${newBaseImageHeight}`,
			)
			setBaseImageHeight(newBaseImageHeight)
			setNumberOfColumns(newNumberOfColumns)
		}, 150) // Adjust the delay as needed

		window.addEventListener('resize', handleResize)
		return () => {
			window.removeEventListener('resize', handleResize)
			handleResize.cancel()
		}
	}, [])

	// Automatically move images to the left (horizontal sliding)
	// Automatically move images to the left (horizontal sliding)
	useEffect(() => {
		const slider = sliderRef.current
		if (!slider) return

		let animationFrameId
		let lastTime = performance.now()

		const animate = (currentTime) => {
			const deltaTime = currentTime - lastTime
			lastTime = currentTime

			if (!isPaused) {
				const distance = speed * (deltaTime / 16.666) // Pixels per frame
				positionRef.current -= distance

				if (-positionRef.current >= sliderWidth) {
					// Shift back by sliderWidth to loop
					positionRef.current += sliderWidth
					// Temporarily disable transition for instant jump
					slider.style.transition = 'none'
					slider.style.transform = `translateX(${positionRef.current}px)`

					// Force reflow to apply the transform without transition
					// eslint-disable-next-line no-unused-expressions
					slider.offsetHeight // Trigger reflow

					// Re-enable transition
					slider.style.transition = `scroll ${animationDuration}s linear infinite`
				} else {
					// Apply the transform with transition
					slider.style.transform = `translateX(${positionRef.current}px)`
				}
			}

			animationFrameId = requestAnimationFrame(animate)
		}

		animationFrameId = requestAnimationFrame(animate)

		return () => {
			cancelAnimationFrame(animationFrameId)
		}
	}, [isPaused, sliderWidth, speed])

	// Compute if any image is zoomed
	const isAnyImageZoomed = zoomStates.some((state) => state.isZoomed)

	// Prevent body scrolling when any image is zoomed
	useEffect(() => {
		if (isAnyImageZoomed) {
			console.log('An image is zoomed. Disabling body scroll.')
			document.body.style.overflow = 'hidden'
		} else {
			console.log('No images are zoomed. Enabling body scroll.')
			document.body.style.overflow = 'auto'
		}
	}, [isAnyImageZoomed])

	// Handle mouse events to pause and resume animation
	const handleMouseEnter = () => {
		console.log('Mouse entered gallery. Pausing animation.')
		setIsPaused(true)
	}

	const handleMouseLeave = () => {
		console.log('Mouse left gallery. Resuming animation.')
		setIsPaused(false)
	}

	// Handle image click to open modal
	const handleImageClick = (productImages, product) => {
		if (productImages && productImages.length > 0) {
			console.log(`Opening modal for product ID: ${product.id}`)
			setSelectedProductImages(productImages)
			setSelectedProduct(product) // Set the selected product
			setSelectedMuseum(museum) // Set the selected creator
			setZoomStates(
				productImages.map(() => ({
					zoomLevel: 1,
					isZoomed: false,
					cursorPos: { x: 0, y: 0 },
					showLens: false,
				})),
			)
			setCurrentSlide(0) // Reset carousel to first slide
		} else {
			// If no sub-images, display fallback
			console.warn(
				`No sub-images available for product ID: ${product.id}.`,
			)
			setSelectedProductImages([])
			setSelectedProduct(null)
			setSelectedMuseum(null)
			setZoomStates([])
		}
		setIsModalOpen(true)
	}

	// Handle closing the modal
	const handleCloseModal = () => {
		console.log('Closing modal.')
		setIsModalOpen(false)
		setSelectedProductImages([])
		setSelectedProduct(null) // Reset to null
		setSelectedMuseum(null) // Reset to null
		setZoomStates([])
		setCurrentSlide(0) // Reset carousel
	}

	// Handle zoom in
	const handleZoomIn = (index) => {
		console.log(`Zooming in on image index: ${index}`)
		setZoomStates((prevZoomStates) => {
			const newZoomStates = [...prevZoomStates]
			const currentZoom = newZoomStates[index].zoomLevel
			if (currentZoom < 5) {
				newZoomStates[index].zoomLevel = parseFloat(
					(currentZoom + 0.5).toFixed(1),
				)
				newZoomStates[index].isZoomed = true
				console.log(
					`Image index ${index} zoom level increased to ${newZoomStates[index].zoomLevel}`,
				)
			}
			return newZoomStates
		})
	}

	// Handle zoom out
	const handleZoomOut = (index) => {
		console.log(`Zooming out on image index: ${index}`)
		setZoomStates((prevZoomStates) => {
			const newZoomStates = [...prevZoomStates]
			const currentZoom = newZoomStates[index].zoomLevel
			if (currentZoom > 1) {
				newZoomStates[index].zoomLevel = parseFloat(
					(currentZoom - 0.5).toFixed(1),
				)
				if (newZoomStates[index].zoomLevel === 1) {
					newZoomStates[index].isZoomed = false
					console.log(`Image index ${index} is no longer zoomed.`)
				} else {
					console.log(
						`Image index ${index} zoom level decreased to ${newZoomStates[index].zoomLevel}`,
					)
				}
			}
			return newZoomStates
		})
	}

	// Handle mouse move events to update cursor position for zoom
	const handleMouseMoveImage = useCallback(
		(e, index) => {
			const rect = e.currentTarget.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top

			// Update cursor position
			setZoomStates((prevZoomStates) => {
				const newZoomStates = [...prevZoomStates]
				newZoomStates[index] = {
					...newZoomStates[index],
					cursorPos: { x, y },
				}
				return newZoomStates
			})

			console.log(
				`Mouse moved on image index ${index}: cursorPos=(${x}, ${y})`,
			)
		},
		[setZoomStates],
	)

	// Handle mouse enter to show zoom lens
	const handleMouseEnterImage = useCallback(
		(index) => {
			console.log(`Mouse entered image index: ${index}`)
			setZoomStates((prevZoomStates) => {
				const newZoomStates = [...prevZoomStates]
				newZoomStates[index] = {
					...newZoomStates[index],
					showLens: true,
				}
				return newZoomStates
			})
		},
		[setZoomStates],
	)

	// Handle mouse leave to hide zoom lens
	const handleMouseLeaveImage = useCallback(
		(index) => {
			console.log(`Mouse left image index: ${index}`)
			setZoomStates((prevZoomStates) => {
				const newZoomStates = [...prevZoomStates]
				newZoomStates[index] = {
					...newZoomStates[index],
					showLens: false,
					cursorPos: { x: 0, y: 0 },
				}
				return newZoomStates
			})
		},
		[setZoomStates],
	)

	// Handle click to toggle zoom
	const handleImageClickToggleZoom = useCallback(
		(index) => {
			console.log(`Toggling zoom on image index: ${index}`)
			setZoomStates((prevZoomStates) => {
				const newZoomStates = [...prevZoomStates]
				const zoomState = newZoomStates[index]
				const isZoomed = !zoomState.isZoomed
				const zoomLevel = isZoomed ? 2 : 1

				newZoomStates[index] = {
					...zoomState,
					isZoomed,
					zoomLevel,
				}
				console.log(`Image index ${index} zoom toggled to ${isZoomed}`)
				return newZoomStates
			})
		},
		[setZoomStates],
	)

	// Handle manual navigation in carousel
	const handlePrevSlide = () => {
		console.log('Navigating to previous slide.')
		setCurrentSlide(
			(prev) =>
				(prev - 1 + selectedProductImages.length) %
				selectedProductImages.length,
		)
	}

	const handleNextSlide = () => {
		console.log('Navigating to next slide.')
		setCurrentSlide((prev) => (prev + 1) % selectedProductImages.length)
	}

	const getImageHeight = (columnIdx, imageIdx) => {
		const pattern =
			columnHeightPatterns[columnIdx % columnHeightPatterns.length]
		if (imageIdx < pattern.length) {
			return `${(pattern[imageIdx] / 100) * baseImageHeight}px`
		} else {
			// Check if scaledColumns[columnIdx] exists
			if (scaledColumns[columnIdx] && scaledColumns[columnIdx].length) {
				const totalPattern = pattern.reduce((sum, val) => sum + val, 0)
				const remainingPercentage = 100 - totalPattern
				const remainingImages =
					scaledColumns[columnIdx].length - pattern.length
				if (remainingImages > 0) {
					return `${(remainingPercentage / remainingImages / 100) * baseImageHeight}px`
				}
			}
			// Fallback if scaledColumns[columnIdx] is undefined or has no remaining images
			return `${baseImageHeight}px`
		}
	}

	const handleExhibitsProductPage = () => {
		navigate(`/museum-page/${id}/products`)
	}

	return (
		<div className={style.ArtistPageMasonryGalleryWrapper}>
			<div
				className={style.galleryContainer}
				style={{ overflow: 'hidden' }}
			>
				{/* Gallery Title */}
				<div className={style.galleryTitleWrapper}>
					<h3 className={style.galleryTitle}>
						{t('Експонати цього музею')}
					</h3>
				</div>

				{/* Horizontal Slider */}
				<div
					className={style.justifiedGallery}
					ref={containerRef}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<div
						ref={sliderRef}
						className={style.slider}
						style={{
							display: 'flex',
							flexDirection: 'row', // Розташування колонок горизонтально
							transform: `translateX(${position}px)`, // Прокрутка
							width: `${sliderWidth * 2}px`, // Подвійна ширина для двох копій колонок
							animation: `scroll ${animationDuration}s linear infinite`,
						}}
					>
						{scaledColumns.map((column, columnIndex) => (
							<div
								key={`original-${columnIndex}`}
								className={style.column}
								style={{
									display: 'flex',
									flexDirection: 'column',
									marginRight: '20px', // Gap between columns
								}}
							>
								{column.map((img, index) => (
									<div
										key={`${img.src}-${index}-${columnIndex}`}
										className={style.item}
										style={{
											marginBottom: '20px', // Gap between items in a column
											width: `${img.scaledWidth}px`,
											flex: '0 0 auto', // Prevent flex items from growing or shrinking
											cursor: 'pointer',
											height: getImageHeight(
												columnIndex,
												index,
											),
											position: 'relative',
										}}
										onClick={() =>
											handleImageClick(
												img.productImages,
												products.find(
													(p) =>
														p.id === img.productId,
												),
											)
										}
									>
										<img
											src={img.src}
											alt=""
											loading="lazy"
											className={style.galleryImage}
											style={{
												width: '100%',
												height: '100%', // Let height adjust based on image aspect ratio
												objectFit: 'cover', // Ensures the image covers the container without distortion
											}}
											onError={(e) => {
												e.target.onerror = null
												e.target.src =
													'/Img/newsCardERROR.jpg'
												console.error(
													'Error loading gallery image:',
													e.target.src,
												)
											}}
										/>
									</div>
								))}
							</div>
						))}

						{/* Second Set of Columns (Duplicate) */}
						{scaledColumns.map((column, columnIndex) => (
							<div
								key={`duplicate-${columnIndex}`}
								className={style.column}
								style={{
									display: 'flex',
									flexDirection: 'column',
									marginRight: '20px', // Gap between columns
								}}
							>
								{column.map((img, index) => (
									<div
										key={`${img.src}-${index}-${columnIndex}`}
										className={style.item}
										style={{
											marginBottom: '20px', // Gap between items in a column
											width: `${img.scaledWidth}px`,
											flex: '0 0 auto', // Prevent flex items from growing or shrinking
											cursor: 'pointer',
											height: getImageHeight(
												columnIndex,
												index,
											),
											position: 'relative',
										}}
										onClick={() =>
											handleImageClick(
												img.productImages,
												products.find(
													(p) =>
														p.id === img.productId,
												),
											)
										}
									>
										<img
											src={img.src}
											alt=""
											loading="lazy"
											className={style.galleryImage}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
											}}
											onError={(e) => {
												e.target.onerror = null
												e.target.src =
													'/Img/newsCardERROR.jpg'
												console.error(
													'Error loading gallery image:',
													e.target.src,
												)
											}}
										/>
									</div>
								))}
							</div>
						))}

						{/* Third Set of Columns (Duplicate) */}
						{scaledColumns.map((column, columnIndex) => (
							<div
								key={`duplicate-${columnIndex}`}
								className={style.column}
								style={{
									display: 'flex',
									flexDirection: 'column',
									marginRight: '20px', // Gap between columns
								}}
							>
								{column.map((img, index) => (
									<div
										key={`${img.src}-${index}-${columnIndex}`}
										className={style.item}
										style={{
											marginBottom: '20px', // Gap between items in a column
											width: `${img.scaledWidth}px`,
											flex: '0 0 auto', // Prevent flex items from growing or shrinking
											cursor: 'pointer',
											height: getImageHeight(
												columnIndex,
												index,
											),
											position: 'relative',
										}}
										onClick={() =>
											handleImageClick(
												img.productImages,
												products.find(
													(p) =>
														p.id === img.productId,
												),
											)
										}
									>
										<img
											src={img.src}
											alt=""
											loading="lazy"
											className={style.galleryImage}
											style={{
												width: '100%',
												height: '100%',
												objectFit: 'cover',
											}}
											onError={(e) => {
												e.target.onerror = null
												e.target.src =
													'/Img/newsCardERROR.jpg'
												console.error(
													'Error loading gallery image:',
													e.target.src,
												)
											}}
										/>
									</div>
								))}
							</div>
						))}
					</div>
				</div>

				{/* Modal */}
				{isModalOpen && selectedProduct && selectedMuseum && (
					<div
						className={style.modalOverlay}
						onClick={handleCloseModal}
						role="dialog"
						aria-modal="true"
						aria-labelledby="productInfoContainer"
					>
						<div
							className={style.modalContent}
							onClick={(e) => e.stopPropagation()}
							aria-labelledby="productInfoContainer"
						>
							{/* Close Button */}
							<button
								className={style.closeButton}
								onClick={handleCloseModal}
								aria-label={t('Закрити модальне вікно')}
							>
								&times;
							</button>

							{/* Product Information */}
							<div
								id="productInfoContainer"
								className={style.productInfoContainer}
								tabIndex="-1" // Make it focusable
							>
								<div className={style.productHeaderWrapper}>
									<h2 className={style.productModalTitle}>
										{t('Назва Картини:')}
										<p>
											<TranslatedContent
												en={selectedProduct.title_en}
												uk={selectedProduct.title_uk}
												html
											/>
										</p>
									</h2>
									<h3
										className={style.productModalAuthorName}
									>
										{t('Імя автора:')}
										<p>
											{selectedMuseum.title_en ||
												selectedMuseum.title_uk ||
												selectedMuseum.title ||
												'—'}
										</p>
									</h3>
								</div>

								<div
									className={style.productModalMainInfoAbout}
								>
									<h3
										className={style.productModelAboutTitle}
									>
										{t('Докладніше')}
									</h3>
									<div
										className={
											style.productModelDescrWrapper
										}
									>
										<h4
											className={
												style.productModelDescrTitle
											}
										>
											{t('Про Картину:')}
											<p
												className={
													style.productModelDescr
												}
											>
												<TranslatedContent
													en={
														selectedProduct.description_en
													}
													uk={
														selectedProduct.description_uk
													}
													html
												/>
											</p>
										</h4>
									</div>
									<div
										className={
											style.productModelSpecsWrapper
										}
									>
										<h4
											className={
												style.productModelSpecsTitle
											}
										>
											{t('Використані матеріали:')}
											<p
												className={
													style.productModelSpecs
												}
											>
												<TranslatedContent
													en={
														selectedProduct.specs_en
													}
													uk={
														selectedProduct.specs_uk
													}
													html
												/>
											</p>
										</h4>
									</div>
								</div>
							</div>

							{/* Carousel Navigation Buttons */}
							{selectedProductImages.length > 1 && (
								<div className={style.carouselNav}>
									<button
										className={style.carouselButton}
										onClick={handlePrevSlide}
										aria-label={t('Попереднє зображення')}
									>
										&#10094; {/* Left Arrow */}
									</button>
									<button
										className={style.carouselButton}
										onClick={handleNextSlide}
										aria-label={t('Наступне зображення')}
									>
										&#10095; {/* Right Arrow */}
									</button>
								</div>
							)}

							{/* Carousel Images */}
							<div className={style.modalImages}>
								{selectedProductImages &&
								selectedProductImages.length > 0 ? (
									selectedProductImages.map(
										(image, index) => {
											// Only render the current slide
											if (index !== currentSlide)
												return null

											const zoomState = zoomStates[
												index
											] || {
												zoomLevel: 1,
												isZoomed: false,
												cursorPos: { x: 0, y: 0 },
												showLens: false,
											}

											return (
												<div
													key={index}
													className={
														style.modalImageWrapper
													}
													onMouseEnter={() =>
														handleMouseEnterImage(
															index,
														)
													}
													onMouseLeave={() =>
														handleMouseLeaveImage(
															index,
														)
													}
													onMouseMove={(e) =>
														handleMouseMoveImage(
															e,
															index,
														)
													}
													onClick={() =>
														handleImageClickToggleZoom(
															index,
														)
													}
													style={{
														position: 'relative',
														overflow: 'hidden',
														cursor: zoomState.isZoomed
															? 'zoom-out'
															: 'zoom-in',
														width: '70%', // Make image responsive
													}}
												>
													<div
														className={
															style.zoomContainer
														}
														style={{
															transform: `scale(${zoomState.zoomLevel})`,
															transformOrigin: `${zoomState.cursorPos.x}px ${zoomState.cursorPos.y}px`,
															transition:
																'transform 0.3s ease-in-out',
															display:
																'inline-block',
														}}
													>
														<img
															src={`${baseUrl}${image.imageUrl.replace('../../', '/')}`}
															alt={`Product Image ${index + 1}`}
															loading="lazy"
															className={
																style.modalImage
															}
															style={{
																width: '100%',
																height: 'auto',
															}}
															onError={(e) => {
																e.target.onerror =
																	null
																e.target.src =
																	'/Img/newsCardERROR.jpg'
																console.error(
																	'Error loading modal image:',
																	e.target
																		.src,
																)
															}}
														/>
													</div>
													{zoomState.showLens &&
														!zoomState.isZoomed && (
															<div
																className={
																	style.zoomLens
																}
																style={{
																	position:
																		'absolute',
																	top:
																		zoomState
																			.cursorPos
																			.y -
																		50,
																	left:
																		zoomState
																			.cursorPos
																			.x -
																		50,
																	width: '100px',
																	height: '100px',
																	border: '2px solid #fff',
																	borderRadius:
																		'50%',
																	pointerEvents:
																		'none',
																	backgroundColor:
																		'rgba(255, 255, 255, 0.2)',
																}}
															></div>
														)}
													{/* Zoom Controls */}
													{zoomState.isZoomed && (
														<div
															className={
																style.zoomControls
															}
														>
															<button
																className={
																	style.zoomButton
																}
																onClick={(
																	e,
																) => {
																	e.stopPropagation()
																	handleZoomOut(
																		index,
																	)
																}}
																aria-label={t(
																	'Zoom Out',
																)}
															>
																-
															</button>
															<div
																className={
																	style.zoomIndicator
																}
															>
																<span>{`Zoom: ${zoomState.zoomLevel}x`}</span>
																<div
																	className={
																		style.zoomBar
																	}
																>
																	<div
																		className={
																			style.zoomProgress
																		}
																		style={{
																			width: `${
																				((zoomState.zoomLevel -
																					1) /
																					4) *
																				100
																			}%`,
																		}}
																	></div>
																</div>
															</div>
															<button
																className={
																	style.zoomButton
																}
																onClick={(
																	e,
																) => {
																	e.stopPropagation()
																	handleZoomIn(
																		index,
																	)
																}}
																aria-label={t(
																	'Zoom In',
																)}
															>
																+
															</button>
														</div>
													)}
												</div>
											)
										},
									)
								) : (
									<p>
										{t(
											'Немає додаткових зображень для цього продукту.',
										)}
									</p>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
			<div className={style.moreArtsButtonWrapper}>
				<button className={style.moreArtsButton}>
					<p
						className={style.moreArtsButtonText}
						onClick={handleExhibitsProductPage}
					>
						{t('Всі експонати цього музею ')}
					</p>
					``
					<img
						className={`${style.buttonArrow}`}
						src={'/Img/buttonArrow.svg'}
						alt={t('Фото митця')}
						loading="lazy"
						onError={(e) => {
							e.target.onerror = null
							e.target.src = '/Img/newsCardERROR.jpg'
						}}
					/>
				</button>
			</div>
		</div>
	)
}

MuseumPageMasonryGallery.propTypes = {
	products: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			images: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.number.isRequired,
					imageUrl: PropTypes.string.isRequired,
				}),
			),
			title: PropTypes.string.isRequired,
			title_en: PropTypes.string,
			title_uk: PropTypes.string,
			description: PropTypes.string.isRequired,
			description_en: PropTypes.string,
			description_uk: PropTypes.string,
			specs: PropTypes.string.isRequired,
			specs_en: PropTypes.string,
			specs_uk: PropTypes.string,
			author: PropTypes.shape({
				title: PropTypes.string,
				title_en: PropTypes.string,
				title_uk: PropTypes.string,
				// ... other fields
			}),
		}),
	).isRequired,
	baseUrl: PropTypes.string.isRequired,
	museum: PropTypes.shape({
		title: PropTypes.string,
		title_en: PropTypes.string,
		title_uk: PropTypes.string,
		// ... other fields
	}).isRequired, // Ensure creator has the necessary fields
}

export default MuseumPageMasonryGallery
