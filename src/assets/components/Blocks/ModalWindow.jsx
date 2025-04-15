import style from '@styles/components/Blocks/ModalWindow.module.scss'
import sliderStyles from '@styles/components/Blocks/Slider.module.scss'
import PropTypes from 'prop-types'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { getUserRole } from '../../../utils/constants'
import { getImageUrl } from '../../../utils/helper'
import TranslatedContent from '../Blocks/TranslatedContent'
import LikeAndShare from './LikeAndShare'

const GalleryModal = ({
	isOpen,
	onClose,
	selectedProduct,
	selectedCreator,
	selectedProductImages,
	zoomStates,
	setZoomStates,
	currentSlide,
	setCurrentSlide,
	baseUrl,
	preloading,
}) => {
	const { t } = useTranslation()
	const modalRef = useRef(null)
	const { isMuseum } = getUserRole()

	useEffect(() => {
		if (isOpen && modalRef.current) {
			modalRef.current.focus()
		}
	}, [isOpen])

	// Handle Zoom In
	const handleZoomIn = (index) => {
		setZoomStates((prevZoomStates) => {
			const newZoomStates = [...prevZoomStates]
			const currentZoom = newZoomStates[index].zoomLevel
			if (currentZoom < 5) {
				newZoomStates[index].zoomLevel = parseFloat(
					(currentZoom + 0.5).toFixed(1),
				)
				newZoomStates[index].isZoomed = true
			}
			return newZoomStates
		})
	}

	// Handle Zoom Out
	const handleZoomOut = (index) => {
		setZoomStates((prevZoomStates) => {
			const newZoomStates = [...prevZoomStates]
			const currentZoom = newZoomStates[index].zoomLevel
			if (currentZoom > 1) {
				newZoomStates[index].zoomLevel = parseFloat(
					(currentZoom - 0.5).toFixed(1),
				)
				if (newZoomStates[index].zoomLevel === 1) {
					newZoomStates[index].isZoomed = false
				}
			}
			return newZoomStates
		})
	}

	// Handle Mouse Move for Zoom Lens
	const handleMouseMoveImage = useCallback(
		(e, index) => {
			const rect = e.currentTarget.getBoundingClientRect()
			const x = e.clientX - rect.left
			const y = e.clientY - rect.top

			setZoomStates((prevZoomStates) => {
				const newZoomStates = [...prevZoomStates]
				newZoomStates[index] = {
					...newZoomStates[index],
					cursorPos: { x, y },
				}
				return newZoomStates
			})
		},
		[setZoomStates],
	)

	// Handle Mouse Enter Image
	const handleMouseEnterImage = useCallback(
		(index) => {
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

	// Handle Mouse Leave Image
	const handleMouseLeaveImage = useCallback(
		(index) => {
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

	// Handle Click to Toggle Zoom
	const handleImageClickToggleZoom = useCallback(
		(index) => {
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
				return newZoomStates
			})
		},
		[setZoomStates],
	)

	// Handle Previous Slide
	const handlePrevSlide = useCallback(() => {
		if (selectedProductImages.length === 0) return
		setCurrentSlide(
			(prev) =>
				(prev - 1 + selectedProductImages.length) %
				selectedProductImages.length,
		)
	}, [selectedProductImages.length, setCurrentSlide])

	// Handle Next Slide
	const handleNextSlide = useCallback(() => {
		if (selectedProductImages.length === 0) return
		setCurrentSlide((prev) => (prev + 1) % selectedProductImages.length)
	}, [selectedProductImages.length, setCurrentSlide])

	if (!isOpen || !selectedProduct || !selectedCreator) return null

	return (
		<div
			className={style.modalOverlay}
			onClick={onClose}
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
					onClick={onClose}
					aria-label={t('Закрити модальне вікно')}
				>
					&times;
				</button>

				{/* Product Information */}
				<div
					id="productInfoContainer"
					className={style.productInfoContainer}
					tabIndex="-1"
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
						<h3 className={style.productModalAuthorName}>
							{t('Імя автора:')}
							<p>
								{selectedCreator.title_en ||
									selectedCreator.title_uk ||
									selectedCreator.title ||
									'—'}
							</p>
						</h3>
					</div>

					<div className={style.productModalMainInfoAbout}>
						<h3 className={style.productModelAboutTitle}>
							{t('Докладніше')}
						</h3>
						<div className={style.productModelDescrWrapper}>
							<h4 className={style.productModelDescrTitle}>
								{t('Про Картину:')}
								<p className={style.productModelDescr}>
									<TranslatedContent
										en={selectedProduct.description_en}
										uk={selectedProduct.description_uk}
										html
									/>
								</p>
							</h4>
						</div>
						<div className={style.productModelSpecsWrapper}>
							<h4 className={style.productModelSpecsTitle}>
								{t('Використані матеріали:')}
								<p className={style.productModelSpecs}>
									<TranslatedContent
										en={selectedProduct.specs_en}
										uk={selectedProduct.specs_uk}
										html
									/>
								</p>
							</h4>
						</div>
					</div>
					<LikeAndShare
						className={sliderStyles.LikeAndShareFixed}
						countClassName={sliderStyles.likeCountWrapper}
						entityId={selectedProduct.id}
						entityType={'product'}
					/>
				</div>

				{/* Carousel Navigation Buttons */}
				{selectedProductImages.length > 1 && (
					<div className={style.carouselNav}>
						<button
							className={style.carouselButton}
							onClick={handlePrevSlide}
							aria-label={t('Попереднє зображення')}
						>
							&#10094;
						</button>
						<button
							className={style.carouselButton}
							onClick={handleNextSlide}
							aria-label={t('Наступне зображення')}
						>
							&#10095;
						</button>
					</div>
				)}

				{/* Carousel Images */}
				<div className={style.modalImages}>
					{selectedProductImages.length > 0 ? (
						selectedProductImages.map((image, index) => {
							if (index !== currentSlide) return null

							const zoomState = zoomStates[index] || {
								zoomLevel: 1,
								isZoomed: false,
								cursorPos: { x: 0, y: 0 },
								showLens: false,
							}

							return (
								<div
									key={index}
									className={style.modalImageWrapper}
									onMouseEnter={() =>
										handleMouseEnterImage(index)
									}
									onMouseLeave={() =>
										handleMouseLeaveImage(index)
									}
									onMouseMove={(e) =>
										handleMouseMoveImage(e, index)
									}
									onClick={() =>
										handleImageClickToggleZoom(index)
									}
									style={{
										position: 'relative',
										overflow: 'hidden',
										cursor: zoomState.isZoomed
											? 'zoom-out'
											: 'zoom-in',
										width: '70%',
									}}
								>
									<div
										className={style.zoomContainer}
										style={{
											transform: `scale(${zoomState.zoomLevel})`,
											transformOrigin: `${zoomState.cursorPos.x}px ${zoomState.cursorPos.y}px`,
											transition:
												'transform 0.3s ease-in-out',
											display: 'inline-block',
										}}
									>
										<img
											src={getImageUrl(
												image.imageUrl,
												'/Img/newsCardERROR.jpg',
											)}
											alt={`Product Image ${index + 1}`}
											loading="lazy"
											className={style.modalImage}
											style={{
												width: '100%',
												height: 'auto',
											}}
											onError={(e) => {
												e.target.onerror = null
												e.target.src =
													'/Img/newsCardERROR.jpg'
												console.error(
													'Error loading modal image:',
													e.target.src,
												)
											}}
										/>
									</div>
									{zoomState.showLens &&
										!zoomState.isZoomed && (
											<div
												className={style.zoomLens}
												style={{
													position: 'absolute',
													top:
														zoomState.cursorPos.y -
														50,
													left:
														zoomState.cursorPos.x -
														50,
													width: '100px',
													height: '100px',
													border: '2px solid #fff',
													borderRadius: '50%',
													pointerEvents: 'none',
													backgroundColor:
														'rgba(255, 255, 255, 0.2)',
												}}
											></div>
										)}
									{/* Zoom Controls */}
									{zoomState.isZoomed && (
										<div className={style.zoomControls}>
											<button
												className={style.zoomButton}
												onClick={(e) => {
													e.stopPropagation()
													handleZoomOut(index)
												}}
												aria-label={t('Zoom Out')}
											>
												-
											</button>
											<div
												className={style.zoomIndicator}
											>
												<span>{`Zoom: ${zoomState.zoomLevel}x`}</span>
												<div className={style.zoomBar}>
													<div
														className={
															style.zoomProgress
														}
														style={{
															width: `${((zoomState.zoomLevel - 1) / 4) * 100}%`,
														}}
													></div>
												</div>
											</div>
											<button
												className={style.zoomButton}
												onClick={(e) => {
													e.stopPropagation()
													handleZoomIn(index)
												}}
												aria-label={t('Zoom In')}
											>
												+
											</button>
										</div>
									)}
								</div>
							)
						})
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
	)
}

GalleryModal.propTypes = {
	isOpen: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	selectedProduct: PropTypes.shape({
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
	}).isRequired,
	selectedCreator: PropTypes.shape({
		title: PropTypes.string,
		title_en: PropTypes.string,
		title_uk: PropTypes.string,
		// ... other fields
	}).isRequired,
	selectedProductImages: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			imageUrl: PropTypes.string.isRequired,
		}),
	).isRequired,
	zoomStates: PropTypes.arrayOf(
		PropTypes.shape({
			zoomLevel: PropTypes.number.isRequired,
			isZoomed: PropTypes.bool.isRequired,
			cursorPos: PropTypes.shape({
				x: PropTypes.number.isRequired,
				y: PropTypes.number.isRequired,
			}).isRequired,
			showLens: PropTypes.bool.isRequired,
		}),
	).isRequired,
	setZoomStates: PropTypes.func.isRequired,
	currentSlide: PropTypes.number.isRequired,
	setCurrentSlide: PropTypes.func.isRequired,
	baseUrl: PropTypes.string.isRequired,
}

export default GalleryModal
