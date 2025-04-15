// export default MuseumsPagePopularMuseumSlider
import axios from 'axios'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Import Swiper modules
import { useNavigate } from 'react-router-dom'
import { Navigation, Pagination } from 'swiper/modules'

import '@styles/components/Sliders/Base/PopularSlider.scss'
import { getBaseUrl, getImageUrl } from '../../../../utils/helper'
// import LikeAndShare from '../../Blocks/LikeAndShare'
import TranslatedContent from '../../Blocks/TranslatedContent'

const Slide = ({ exhibition, baseUrl, onClick }) => {
	const { t } = useTranslation()

	const navigate = useNavigate()

	const handleExhibitionClick = (id) => {
		navigate(`/exhibitions/${id}`) // Adjust the route as per your application
	}

	const imageUrl =
		exhibition.images && exhibition.images.length > 0
			? getImageUrl(
					exhibition.images[0].imageUrl,
					'/Img/newsCardERROR.jpg',
				)
			: '/Img/newsCardERROR.jpg' // Fallback image

	return (
		<div className="PopularSliderCardWrapper">
			<div className="PopularSliderCardInnerWrapper">
				<img
					className="PopularSliderCardImg"
					src={imageUrl}
					alt={t('Світлина мистецтва')}
					onError={(e) => {
						e.target.onerror = null
						e.target.src = '/Img/mainPopularArtistsSlide.jpg'
					}}
				/>
			</div>
			<div className="PopularSliderCardAbsoluteWrapper">
				<div className="PopularSliderCardButtonWrapper">
					<button
						className="PopularSliderCardButton"
						onClick={() => handleExhibitionClick(exhibition.id)}
					>
						{t('Огляд')}
					</button>
				</div>
				<div className="PopularSliderCardTitleWrapper">
					<h3 className="PopularSliderCardTitle">
						<TranslatedContent
							en={exhibition.title_en}
							uk={exhibition.title_uk}
							maxLength={50}
						/>
					</h3>
				</div>
				<div className="PopularSliderCardDescriptionWrapper">
					<p className="PopularSliderCardDescription">
						<TranslatedContent
							en={exhibition.description_en}
							uk={exhibition.description_uk}
							maxLength={60}
							html
						/>
					</p>
				</div>
			</div>
		</div>
	)
}

Slide.propTypes = {
	exhibition: PropTypes.object,
	baseUrl: PropTypes.string,
}

const PopularExhibitionsSlider = () => {
	const { t } = useTranslation()

	const [exhibitions, setExhibitions] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const baseUrl = getBaseUrl()

	useEffect(() => {
		const fetchExhibitions = async () => {
			try {
				const response = await axios.get(
					'/api/like/top-liked-exhibitions',
				)
				console.log('Received creator products:', response.data)
				setExhibitions(response.data || [])
				setLoading(false)
			} catch (err) {
				console.error('Error fetching creator products:', err)
				setError(t('Не вдалося завантажити виставки.'))
				setLoading(false)
			}
		}

		fetchExhibitions()
	}, [])
	return (
		<div className="PopularSliderContainer">
			<div className="PopularSliderWrapper">
				<div className="PopularSliderTopInnerWrapper">
					<div className="PopularSliderTitleWrapper">
						<h2 className="PopularSliderTitle">
							{t('Популярне.')} &#8243;{t('Виставки')}&#8243;
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
						) : !exhibitions || exhibitions.length === 0 ? (
							<SwiperSlide>
								<div className="noProducts">
									{t('Немає виставок.')}
								</div>
							</SwiperSlide>
						) : (
							exhibitions.map((exhibition) => (
								<SwiperSlide key={exhibition.id}>
									<Slide
										exhibition={exhibition}
										baseUrl={baseUrl}
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
		</div>
	)
}

export default PopularExhibitionsSlider
