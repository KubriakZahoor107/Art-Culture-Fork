import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Import Swiper modules
// import LikeAndShare from '@components/Blocks/LikeAndShare'
import '@styles/components/Sliders/Base/PopularSlider.scss'
import { useNavigate } from 'react-router-dom'
import { Navigation, Pagination } from 'swiper/modules'
import { getBaseUrl, getImageUrl } from '../../../../utils/helper'
import ModalWindow from '../../Blocks/ModalWindow'
import TranslatedContent from '../../Blocks/TranslatedContent'

const Slide = ({ product, baseUrl, onOverviewClick }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const handleProductClick = (id) => {
		if (!id) return
		navigate(`/item-detail/${id}`) // Adjust the route as per your application

		if (!product || product.length === 0) {
			return (
				<div className="popularSliderContainer">
					<p>
						{t('У цього митця немає продуктів для відображення.')}
					</p>
				</div>
			)
		}
	}

	const imageUrl = getImageUrl(
		product.images?.[0]?.imageUrl,
		'/Img/newsCardERROR.jpg',
	) // Fallback image

	console.log('Slider image URL for product', product.id, '=>', imageUrl)

	return (
		<div
			className="PopularSliderCardWrapper"
			// onClick={() => onOverviewClick(product)}
			onClick={() => handleProductClick(product.id)}
		>
			<div className="PopularSliderCardInnerWrapper">
				<img
					className="PopularSliderCardImg"
					src={imageUrl}
					alt={t('Світлина мистецтва')}
					onError={(e) => {
						e.target.onerror = null
						e.target.src = '/Img/newsCardERROR.jpg'
					}}
				/>
			</div>
			<div className="PopularSliderCardAbsoluteWrapper">
				<div className="PopularSliderCardButtonWrapper">
					<button
						className="PopularSliderCardButton"
						onClick={() => handleProductClick(product.id)}
					>
						{t('Огляд')}
					</button>
				</div>
				<div className="PopularSliderCardTitleWrapper">
					<h3 className="PopularSliderCardTitle">
						<TranslatedContent
							en={product.title_en}
							uk={product.title_uk}
							maxLength={50}
						/>
					</h3>
				</div>
				<div className="PopularSliderCardDescriptionWrapper">
					<p className="PopularSliderCardDescription">
						<TranslatedContent
							en={product.description_en}
							uk={product.description_uk}
							maxLength={50}
							html
						/>
					</p>
				</div>
			</div>
		</div>
	)
}

const MainPopularArtistsSlider = () => {
	const { t } = useTranslation()

	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const baseUrl = getBaseUrl()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [selectedCreator, setSelectedCreator] = useState(null)
	const [selectedProductImages, setSelectedProductImages] = useState([])
	const [zoomStates, setZoomStates] = useState([])
	const [currentSlide, setCurrentSlide] = useState(0)
	const [preloading, setPreloading] = useState(false)

	useEffect(() => {
		const fetchCreatorProducts = async () => {
			try {
				const response = await axios.get(
					'/api/like/top-liked-paintings',
				)
				console.log('Received creator products:', response.data)
				setProducts(response.data || [])
				setLoading(false)
			} catch (err) {
				console.error('Error fetching creator products:', err)
				setError(t('Не вдалося завантажити продукти.'))
				setLoading(false)
			}
		}

		fetchCreatorProducts()
	}, [t])

	const preloadImages = useCallback(
		async (images) => {
			const promises = images.map(
				(img) =>
					new Promise((resolve) => {
						const image = new Image()
						image.src = getImageUrl(
							img.imageUrl,
							'/Img/newsCardERROR.jpg',
						)
						image.onload = resolve
						image.onerror = resolve
					}),
			)
			await Promise.all(promises)
		},
		[baseUrl],
	)

	console.log('baseUrl', baseUrl)

	// Handler to open the GalleryModal with preloaded images
	const handleOverviewClick = async (product) => {
		if (product.images && product.images.length > 0) {
			setPreloading(true)
			await preloadImages(product.images)
			setPreloading(false)
			setSelectedProductImages(product.images)
			setSelectedProduct(product)
			setSelectedCreator(product.author || {}) // Adjust based on actual data structure
			setZoomStates(
				product.images.map(() => ({
					zoomLevel: 1,
					isZoomed: false,
					cursorPos: { x: 0, y: 0 },
					showLens: false,
				})),
			)
			setCurrentSlide(0)
			setIsModalOpen(true)
		} else {
			// If no images, optionally handle this case
			setSelectedProductImages([])
			setSelectedProduct(null)
			setSelectedCreator(null)
			setZoomStates([])
			setIsModalOpen(false)
		}
	}
	// Handler to close the GalleryModal
	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedProductImages([])
		setSelectedProduct(null)
		setSelectedCreator(null)
		setZoomStates([])
		setCurrentSlide(0)
	}
	return (
		<div className="PopularSliderContainer">
			<div className="PopularSliderWrapper">
				<div className="PopularSliderTopInnerWrapper">
					<div className="PopularSliderTitleWrapper">
						<h2 className="PopularSliderTitle">
							{t('Популярне.')} &#8243;{t('Мистецтво')}&#8243;
						</h2>
					</div>
					{/* <LikeAndShare className={sliderStyles.LikeAndShareFixed} /> */}
				</div>
				<div className="PopularSliderBottomInnerWrapper">
					<Swiper
						modules={[Navigation, Pagination]}
						spaceBetween={0}
						slidesPerView={'auto'}
						navigation
						pagination={{ clickable: false, type: 'fraction' }}
						onSlideChange={() => console.log('slide change')}
						onSwiper={(swiper) => console.log(swiper)}
					>
						{loading ? (
							<SwiperSlide>
								<div className="loading">
									{t('Завантаження...')}
								</div>
							</SwiperSlide>
						) : error ? (
							<SwiperSlide>
								<div className="error">{error}</div>
							</SwiperSlide>
						) : products.length === 0 ? (
							<SwiperSlide>
								<div className="noProducts">
									{t('Немає продуктів від митців.')}
								</div>
							</SwiperSlide>
						) : (
							products.map((product) => (
								<SwiperSlide key={product.id}>
									<Slide
										product={product}
										baseUrl={baseUrl}
										onOverviewClick={handleOverviewClick}
									/>
								</SwiperSlide>
							))
						)}
					</Swiper>
					<div className={'${swiper-button-prev}'}></div>
					<div className={'${swiper-pagination}'}></div>
					<div className={'${swiper-button-next}'}></div>
				</div>
			</div>
			<ModalWindow
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				selectedProduct={selectedProduct}
				selectedCreator={selectedCreator}
				selectedProductImages={selectedProductImages}
				zoomStates={zoomStates}
				setZoomStates={setZoomStates}
				currentSlide={currentSlide}
				setCurrentSlide={setCurrentSlide}
				baseUrl={baseUrl}
				preloading={preloading}
			/>
		</div>
	)
}

export default MainPopularArtistsSlider
