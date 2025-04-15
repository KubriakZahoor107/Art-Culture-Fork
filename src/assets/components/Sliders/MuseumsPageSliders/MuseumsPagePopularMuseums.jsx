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
import '@styles/components/Sliders/Base/PopularSlider.scss'
import { useNavigate } from 'react-router-dom'
import { Navigation, Pagination } from 'swiper/modules'
import { getBaseUrl, getImageUrl } from '../../../../utils/helper'
// import LikeAndShare from '../../Blocks/LikeAndShare'
import TranslatedContent from '../../Blocks/TranslatedContent'

const Slide = ({ museum, baseUrl, onClick }) => {
	const { t } = useTranslation()
	const featuredMediaUrl = getImageUrl(museum.images, '/Img/halfNewsCard.jpg')
	console.log('Витягнуте медіа:', featuredMediaUrl)

	return (
		<div className="PopularSliderCardWrapper">
			<div className="PopularSliderCardInnerWrapper">
				<img
					className="PopularSliderCardImg"
					src={featuredMediaUrl}
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
						onClick={() => onClick(museum.id)}
					>
						{t('Огляд')}
					</button>
				</div>
				<div className="PopularSliderCardTitleWrapper">
					<h3 className="PopularSliderCardTitle">
						<TranslatedContent
							en={museum.title}
							uk={museum.title}
							maxLength={50}
						/>
					</h3>
				</div>
				<div className="PopularSliderCardDescriptionWrapper">
					<p className="PopularSliderCardDescription">
						<TranslatedContent
							en={museum.bio}
							uk={museum.bio}
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
	museum: PropTypes.object,
	baseUrl: PropTypes.string,
}

const PopularMuseumSlider = () => {
	const { t } = useTranslation()

	const [museums, setMuseums] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const navigate = useNavigate()
	const baseUrl = getBaseUrl()

	useEffect(() => {
		const fetchPopularMuseums = async () => {
			try {
				const response = await axios.get('/api/like/top-liked-museums')
				console.log('Received museums:', response.data)
				setMuseums(response.data || [])
				setLoading(false)
			} catch (err) {
				console.error('Error fetching museums:', err)
				setError(t('Не вдалося завантажити музеї.'))
				setLoading(false)
			}
		}

		fetchPopularMuseums()
	}, [])

	const handleMuseumsPageClick = (id) => {
		navigate(`/museum-page/${id}`)
	}

	return (
		<div className="PopularSliderContainer">
			<div className="PopularSliderWrapper">
				<div className="PopularSliderTopInnerWrapper">
					<div className="PopularSliderTitleWrapper">
						<h2 className="PopularSliderTitle">
							{t('Популярне.')} &#8243;{t('Музеї')}&#8243;
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
						) : !museums || museums.length === 0 ? (
							<SwiperSlide>
								<div className="noProducts">
									{t('Немає продуктів від митців.')}
								</div>
							</SwiperSlide>
						) : (
							museums.map((museum) => (
								<SwiperSlide key={museum.id}>
									<Slide
										museum={museum}
										baseUrl={baseUrl}
										onClick={handleMuseumsPageClick}
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

export default PopularMuseumSlider
