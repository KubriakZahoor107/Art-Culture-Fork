import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import axios from 'axios'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// Import Swiper modules
import { Navigation, Pagination } from 'swiper/modules'

import '@styles/components/Sliders/Base/NewsSlider.scss'
import { useNavigate } from 'react-router-dom'
import { getBaseUrl } from '../../../../utils/helper'
import TranslatedContent from '../../Blocks/TranslatedContent'

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
						maxLength={110}
						html
					/>
				</p>
			</div>
		</div>
	)
}

const ArtistPageNewsArtistsSlider = ({ authorId }) => {
	const { t } = useTranslation()
	const [creatorPosts, setCreatorPosts] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)

	const baseUrl = getBaseUrl()

	useEffect(() => {
		const fetchCreatorPosts = async () => {
			try {
				const response = await axios.get('/api/posts/creators/' + authorId)
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
							{t('Новини.')} &#8243;{t('Митці')}&#8243;
						</h2>
					</div>
					{/* <LikeAndShare className={sliderStyles.LikeAndShareFixed} /> */}
				</div>
				{loading ? (
					<div className="loading">
						{t('Завантаження...')}
					</div>) : error ? (
							<div className="error">{error}</div>
						) : creatorPosts.length === 0 ? (
							<div className="noPosts">
								{t('Немає публікацій від митців.')}
							</div>) : (
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
						{(
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
				)}
			</div>
		</div>
	)
}


ArtistPageNewsArtistsSlider.propTypes = {
	authorId: PropTypes.number.isRequired
}

export default ArtistPageNewsArtistsSlider
