import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import TranslatedContent from '../../Blocks/TranslatedContent'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import axios from 'axios'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Autoplay } from 'swiper/modules'
import { getBaseUrl, getImageUrl } from '../../../../utils/helper'

// Import Swiper modules
import { Navigation, Pagination } from 'swiper/modules'

import '/src/styles/components/Sliders/MainPageBannerSlider/MainPageBannerSlider.scss'

const Slide = ({ museum, exhibition, baseUrl, onClick }) => {
	const { t } = useTranslation()

	const featuredMediaUrl =
		exhibition.images?.length > 0
			? getImageUrl(
					exhibition.images[0].imageUrl,
					'/Img/halfNewsCard.jpg',
				)
			: '/Img/halfNewsCard.jpg'
	console.log('Витягнуте медіа:', featuredMediaUrl)

	// const museumLogoUrl = museum.museum_logo_image?.imageUrl
	// 	? getImageUrl(
	// 		museum.museum_logo_image.imageUrl,
	// 		'/Img/logoMuseum_3.png',
	// 	)
	// 	: '/Img/logoMuseum_3.png' // Fallback logo

	return (
		<div className="BannerSliderCardContainer">
			<div className="BannerSliderCardWrapper">
				<div className="BannerSliderCardInnerWrapper">
					<div className="BannerSliderCardSecondInnerWrapper">
						{/* <div className="BannerSliderCardLogoWrapper">
						<img
							className="BannerSliderCardLogo"
							src={museumLogoUrl}
							alt={t('Фото музея')}
							onError={(e) => {
								e.target.onerror = null
								e.target.src = '/Img/newsCardERROR.jpg'
							}}
						/>
					</div>

					<div className="BannerSliderCardSeparator"></div> */}

						<div className="BannerSliderCardStaticTitleWrapper">
							<h1 className="BannerSliderCardStaticTitle">
								the GREAT JOURNEY WHITH the
							</h1>
						</div>

						<div className="BannerSliderCardTitleWrapper">
							<h3 className="BannerSliderCardTitle">
								<TranslatedContent
									en={exhibition.title_en}
									uk={exhibition.title_uk}
								/>
							</h3>
						</div>

						{/* <div className="BannerSliderCardDescriptionWrapper">
						<p className="BannerSliderCardDescription">
							<TranslatedContent
								en={exhibition.description_en}
								uk={exhibition.description_uk}
								html
							/>
						</p>
					</div> */}

						<div className="BannerSliderCardReadMoreButtonWrapper">
							<button
								className="BannerSliderCardReadMoreButton"
								onClick={() => onClick(exhibition.id)}
							>
								{t('Читати далі')}
							</button>
						</div>
					</div>
				</div>

				<div className="BannerSliderCardImgWrapper">
					<img
						className="BannerSliderCardImg"
						src={featuredMediaUrl}
						alt={t('Фото музея')}
						onError={(e) => {
							e.target.onerror = null
							e.target.src = '/Img/newsCardERROR.jpg'
						}}
					/>
				</div>
			</div>
		</div>
	)
}

const MuseumsPageTopSlider = () => {
	const { t } = useTranslation()
	const [museums, setMuseums] = useState([])
	const [exhibitions, setExhibitions] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	const baseUrl = getBaseUrl()
	useEffect(() => {
		const fetchMuseums = async () => {
			try {
				const response = await axios.get('/api/users/museums')
				console.log('Fetch museums', response.data)
				setMuseums(response.data.museums || [])
				setLoading(false)
			} catch (err) {
				console.error('Error fetching museum:', err)
				setError(t('Не вдалося завантажити.'))
				setLoading(false)
			}
		}
		fetchMuseums()
	}, [t])

	useEffect(() => {
		const fetchExhibition = async () => {
			try {
				const response = await axios.get('/api/exhibitions')
				console.log('Fetch exhibitions', response.data)
				setExhibitions(response.data.exhibitions || [])
				setLoading(false)
			} catch (err) {
				console.error('Error fetching exhibition:', err)
				setError('Failed to load exhibition details.')
				setLoading(false)
			}
		}

		fetchExhibition()
	}, [])

	const handleExhibitionPageClick = (id) => {
		console.log('Navigating to exhibition with id:', id)
		navigate(`/exhibitions/${id}`)
	}
	return (
		<div className="BannerSliderContainer">
			<Swiper
				modules={[Navigation, Pagination, Autoplay]}
				spaceBetween={0}
				slidesPerView={'1'}
				navigation
				pagination={{ clickable: false, type: 'fraction' }}
				onSlideChange={() => console.log('slide change')}
				onSwiper={(swiper) => console.log(swiper)}
				autoplay={{
					delay: 2000, // Задержка в миллисекундах
					disableOnInteraction: false, // Продолжать автопрокрутку после взаимодействия
					pauseOnMouseEnter: true, // Останавливать при наведении
				}}
				loop={true} // Бесконечная прокрутках слайдов
			>
				{loading ? (
					<SwiperSlide>
						<div className="loading">{t('Завантаження...')}</div>
					</SwiperSlide>
				) : error ? (
					<SwiperSlide>
						<div className="error">{error}</div>
					</SwiperSlide>
				) : exhibitions.length === 0 ? (
					<SwiperSlide>
						<div className="noProducts">{t('Немає музеїв.')}</div>
					</SwiperSlide>
				) : (
					exhibitions.map((exhibition) => {
						const matchingMuseum = museums.find(
							(m) => m.id === exhibition.createdBy?.id,
						)
						return (
							<SwiperSlide key={exhibition.id}>
								<Slide
									museum={matchingMuseum}
									exhibition={exhibition}
									baseUrl={baseUrl}
									onClick={handleExhibitionPageClick}
								/>
							</SwiperSlide>
						)
					})
				)}
			</Swiper>

			<div className={'${swiper-button-prev}'}></div>
			<div className={'${swiper-pagination}'}></div>
			<div className={'${swiper-button-next}'}></div>
		</div>
	)
}

export default MuseumsPageTopSlider
