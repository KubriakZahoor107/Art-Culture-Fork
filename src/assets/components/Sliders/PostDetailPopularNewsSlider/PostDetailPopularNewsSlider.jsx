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
// import LikeAndShare from '@components/Blocks/LikeAndShare'
import '@styles/components/Sliders/Base/PopularSlider.scss'
import { useNavigate } from 'react-router-dom'
import { Navigation, Pagination } from 'swiper/modules'
import { getBaseUrl, getImageUrl } from '../../../../utils/helper'
import TranslatedContent from '../../Blocks/TranslatedContent'

const Slide = ({ post, baseUrl }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()

	const handlePostClick = () => {
		navigate(`/posts/${post.id}`) // Adjust the route as per your application
	}

	const imageUrl = getImageUrl(post.images, '/Img/halfNewsCard.jpg') // Fallback image

	return (
		<div className="PopularSliderCardWrapper">
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
						onClick={handlePostClick}
					>
						{t('Огляд')}
					</button>
				</div>
				<div className="PopularSliderCardTitleWrapper">
					<h3 className="PopularSliderCardTitle">
						<TranslatedContent
							en={post.title_en}
							uk={post.title_uk}
							maxLength={50}
						/>
					</h3>
				</div>
				<div className="PopularSliderCardDescriptionWrapper">
					<p className="PopularSliderCardDescription">
						<TranslatedContent
							en={post.content_en}
							uk={post.content_uk}
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

	const [posts, setPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const baseUrl = getBaseUrl()

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const response = await axios.get('/api/like/top-liked-posts')
				console.log('Received creator products:', response.data)
				setPosts(response.data || [])
				setLoading(false)
			} catch (err) {
				console.error('Error fetching posts:', err)
				setError(t('Не вдалося завантажити новини.'))
				setLoading(false)
			}
		}

		fetchPosts()
	}, [t])
	return (
		<div className="PopularSliderContainer">
			<div className="PopularSliderWrapper">
				<div className="PopularSliderTopInnerWrapper">
					<div className="PopularSliderTitleWrapper">
						<h2 className="PopularSliderTitle">
							{t('Популярне.')} &#8243;{t('НОВИНИ')}&#8243;
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
						) : posts.length === 0 ? (
							<SwiperSlide>
								<div className="noProducts">
									{t('Немає новин.')}
								</div>
							</SwiperSlide>
						) : (
							posts.map((post) => (
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

export default MainPopularArtistsSlider
