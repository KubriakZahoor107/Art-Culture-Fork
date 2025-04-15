import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// Import Swiper React components
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
// Import Swiper modules
import { Navigation, Pagination } from 'swiper/modules'

import { getBaseUrl } from '../../../../utils/helper'
import '/src/styles/components/Sliders/NewsPageAuthorsSlider/NewsPageAuthorsSlider.scss'

const Slide = ({ author, onClick }) => {
	const { t } = useTranslation()
	const baseUrl = getBaseUrl()
	return (
		<div className="newsPageAuthorsSliderCardContainer">
			<div className="newsPageAuthorsSliderCardWrapper">
				<div className="newsPageAuthorsSliderCardUserPhotoWrapper">
					<img
						className="newsPageAuthorsSliderCardUserPhoto"
						src={
							author.images
								? `${baseUrl}${author.images.replace('../../', '/')}`
								: '/Img/halfNewsCard.jpg'
						}
						alt={t('Фотографія автора')}
						loading="lazy"
						onClick={() => onClick(author.id)}
						onError={(e) => {
							e.target.onerror = null
							e.target.src =
								'/Img/mainInstagramSliderUserPhoto.png'
						}}
					/>
				</div>
				<div className="newsPageAuthorsSliderCardUserNameWrapper">
					<p className="newsPageAuthorsSliderCardUserName">
						{author.title}
					</p>
				</div>
			</div>
		</div>
	)
}

const NewsPageAuthorsSlider = () => {
	const { t } = useTranslation()
	const [posts, setPosts] = useState([])
	const [error, setError] = useState(null)
	const [authors, setAuthors] = useState([])
	const [creators, setCreators] = useState([])
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()

	useEffect(() => {
		const fetchAuthorsAndCreators = async () => {
			try {
				setLoading(true)

				// Fetch Authors
				const authorsResponse = await axios.get('/api/users/authors')
				const authorsWithPosts = await Promise.all(
					authorsResponse.data.authors.map(async (author) => {
						try {
							const postsResponse = await axios.get(
								`/api/posts/author/${author.id}`,
							)
							if (postsResponse.data.posts.length > 0) {
								author.posts = postsResponse.data.posts
								return author
							}
							return null // Skip if no posts
						} catch (error) {
							console.error(
								`Error fetching posts for author ${author.id}`,
								error,
							)
							return null
						}
					}),
				)
				setAuthors(authorsWithPosts.filter((author) => author !== null)) // Filter out authors with no posts

				// Fetch Creators
				const creatorsResponse = await axios.get('/api/users/creators')
				const creatorsWithPosts = await Promise.all(
					creatorsResponse.data.creators.map(async (creator) => {
						try {
							const postsResponse = await axios.get(
								`/api/posts/author/${creator.id}`,
							)
							if (postsResponse.data.posts.length > 0) {
								creator.posts = postsResponse.data.posts
								return creator
							}
							return null // Skip if no posts
						} catch (error) {
							console.error(
								`Error fetching posts for creator ${creator.id}`,
								error,
							)
							return null
						}
					}),
				)
				setCreators(
					creatorsWithPosts.filter((creator) => creator !== null),
				) // Filter out creators with no posts
			} catch (error) {
				console.error('Error fetching Authors or Creators', error)
				setError(t('Не вдалося завантажити дані авторів та творців.'))
			} finally {
				setLoading(false)
			}
		}

		fetchAuthorsAndCreators()
	}, [t])

	const handleAuthorPreviewClick = (authorId) => {
		navigate(`/all-author-posts/${authorId}`)
	}

	return (
		<div className="newsPageAuthorsSliderContainer">
			<div className="newsPageAuthorsSliderWrapper">
				<div className="newsPageAuthorsSliderTitleWrapper">
					<p className="newsPageAuthorsSliderTitle">{t('Автори')}</p>
				</div>

				<div className="newsPageAuthorsSliderInnerWrapper">
					{loading ? (
						<p>{t('Завантаження авторів...')}</p>
					) : error ? (
						<p>{error}</p>
					) : authors.length === 0 && creators.length === 0 ? (
						<p>{t('Немає авторів для відображення.')}</p>
					) : (
						<Swiper
							modules={[Navigation, Pagination]}
							spaceBetween={0}
							slidesPerView={'auto'}
							navigation
							pagination={{ clickable: false, type: 'fraction' }}
						>
							{/* Render Authors */}
							{authors.map((author) => (
								<SwiperSlide key={author.id}>
									<Slide
										author={author}
										onClick={handleAuthorPreviewClick}
									/>
								</SwiperSlide>
							))}

							{/* Render Creators */}
							{creators.map((creator) => (
								<SwiperSlide key={creator.id}>
									<Slide
										author={creator}
										onClick={handleAuthorPreviewClick}
									/>
								</SwiperSlide>
							))}
						</Swiper>
					)}
				</div>
			</div>
		</div>
	)
}

export default NewsPageAuthorsSlider
