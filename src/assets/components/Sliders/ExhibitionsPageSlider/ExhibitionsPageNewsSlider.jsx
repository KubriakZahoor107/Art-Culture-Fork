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
import { useNavigate } from 'react-router-dom'
import { getBaseUrl } from '../../../../utils/helper'
import TranslatedContent from '../../Blocks/TranslatedContent'
import '/src/styles/components/Sliders/Base/NewsSlider.scss'
const Slide = ({ post, baseUrl }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const featuredMediaUrl = post.images
		? `${baseUrl}${post.images.replace('../../', '/')}`
		: '/Img/halfNewsCard.jpg'

	const handlePostClick = () => {
		navigate(`/posts/${post.id}`)
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
						onClick={() => handlePostClick(post.id)}
						onError={(e) => {
							e.target.onerror = null
							e.target.src = '/Img/newsCardERROR.jpg'
						}}
					/>
				</div>

				<div className="NewsSliderCardTitleWrapper">
					<h3 className="NewsSliderCardTitle">
						<TranslatedContent
							en={post.title_en}
							uk={post.title_uk}
							maxLength={50}
						/>
					</h3>
				</div>

				<div className="NewsSliderCardDescriptionWrapper">
					<p className="NewsSliderCardDescription">
						<TranslatedContent
							en={post.content_en}
							uk={post.content_uk}
							maxLength={200}
							html
						/>
					</p>
				</div>
			</a>
		</div>
	)
}

const ArtistsPageNewsArtistsSlider = () => {
	const { t } = useTranslation()
	const [creatorPosts, setCreatorPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const baseUrl = getBaseUrl()

	useEffect(() => {
		const fetchCreatorPosts = async () => {
			try {
				const response = await axios.get('/api/posts/exhibitions')
				console.log('Received creator posts:', response.data)
				setCreatorPosts(response.data.posts || [])
				setLoading(false)
			} catch (err) {
				console.error('Error fetching creator posts:', err)
				setError(t('Не вдалося завантажити публікації.'))
				setLoading(false)
			}
		}

		fetchCreatorPosts()
	}, [t])

	return (
		<div className="NewsSliderContainer">
			<div className="NewsSliderWrapper">
				<div className="NewsSliderTopInnerWrapper">
					<div className="NewsSliderTitleWrapper">
						<h2 className="NewsSliderTitle">
							{t('Новини.')} &#8243;{t('Виставки')}&#8243;
						</h2>
					</div>
					{/* <LikeAndShare className={sliderStyles.LikeAndShareFixed} /> */}
				</div>
				<div className="NewsSliderBottomInnerWrapper">
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
									<Slide post={post} baseUrl={baseUrl} />
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

export default ArtistsPageNewsArtistsSlider
