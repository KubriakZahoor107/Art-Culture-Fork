import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Import Swiper modules
import { Navigation, Pagination } from 'swiper/modules'

// import LikeAndShare from '@components/Blocks/LikeAndShare'
// import sliderStyles from '@styles/components/Blocks/Slider.module.scss'
import { useNavigate } from 'react-router-dom'
import { getBaseUrl } from '../../../utils/helper'
import TranslatedContent from '@components/Blocks/TranslatedContent'
import '@styles/components/Sliders/Base/ArtTermsSlider.scss'

const Slide = ({ artTerm, baseUrl }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const featuredMediaUrl = artTerm.highlightedProduct?.images
		? `${baseUrl}${artTerm.highlightedProduct.images[0].imageUrl.replace('../../', '/')}`
		: '/Img/halfNewsCard.jpg'

	const handlePostClick = () => {
		navigate(`/art-terms/${artTerm.id}`)
	}

	return (
		<div className="NewsSliderCardContainer">
			<a
				className="NewsSliderCardLink"
				// TODO:Rewrite component to use navigate for post	onClick={handleArtistPageClick}
			>
				<div className="NewsSliderCardImgWrapper">
					<img
						className="NewsSliderCardImg"
						src={featuredMediaUrl}
						alt={t('Світлина мистецтва')}
						onClick={() => handlePostClick(artTerm.id)}
						onError={(e) => {
							e.target.onerror = null
							e.target.src = '/Img/newsCardERROR.jpg'
						}}
					/>
				</div>

				<div className="NewsSliderCardTitleWrapper">
					<h3 className="NewsSliderCardTitle"
						onClick={() => handlePostClick(artTerm.id)}>
						<TranslatedContent
							en={artTerm.title_en}
							uk={artTerm.title_uk}
							maxLength={50}
						/>
					</h3>
				</div>

				<div className="ArtTermsSliderCardDescriptionWrapper">
					<p className="NewsSliderCardDescription"
						onClick={() => handlePostClick(artTerm.id)}>
						<TranslatedContent
							en={artTerm.content_en}
							uk={artTerm.content_uk}
							maxLength={140}
							html
						/>
					</p>
				</div>
			</a>
		</div>
	)
}

const ArtTermSlider = () => {
	const { t, i18n } = useTranslation()
	const [language] = useState(i18n.language)
	const [creatorPosts, setCreatorPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const baseUrl = getBaseUrl()

	useEffect(() => {
		const fetchCreatorPosts = async () => {
			try {
				const response = await axios.get('/api/art-terms/last-terms/' + language)
				console.log('Received last art-terms posts:', response.data)
				setCreatorPosts(response.data.artTerms || [])
				setLoading(false)
			} catch (err) {
				console.error('Error fetching art-terms posts:', err)
				setError(t('Не вдалося завантажити арт терміни.'))
				setLoading(false)
			}
		}

		fetchCreatorPosts()
	}, [t, language])

	return (
		<div className="NewsSliderContainer">
			<div className="NewsSliderWrapper">
				<div className="NewsSliderTopInnerWrapper">
					<div className="NewsSliderTitleWrapper">
						<h2 className="NewsSliderTitle">
							{t('Новини.')} &#8243;{t('Арт терміни')}&#8243;
						</h2>
					</div>
					{/* <LikeAndShare className={sliderStyles.LikeAndShareFixed} /> */}
				</div>
				<div className="ArtTermsSliderBottomInnerWrapper">
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
						) : creatorPosts.length === 0 ? (
							<SwiperSlide>
								<div className="noPosts">
									{t('Немає публікацій від митців.')}
								</div>
							</SwiperSlide>
						) : (
							creatorPosts.map((post) => (
								<SwiperSlide key={post.id}>
									<Slide artTerm={post} baseUrl={baseUrl} />
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

export default ArtTermSlider
