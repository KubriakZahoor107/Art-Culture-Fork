import LikeAndShare from '@components/Blocks/LikeAndShare'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import styles from '../../../styles/screen/Authors/AllArtistPostPage.module.scss'
import {
	getFormattedDate,
	getFormattedTime,
	getImageUrl,
} from '../../../utils/helper'
import TranslatedContent from '../../components/Blocks/TranslatedContent'
import { max } from 'lodash'

function AuthorPostsLists() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { id } = useParams()
	const [posts, setPosts] = useState([])
	const [author, setAuthor] = useState({})
	const [creator, setCreator] = useState({})
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchAuthorPosts = async () => {
			try {
				setLoading(true)

				// 1) Attempt to fetch CREATOR data first
				const creatorResponse = await axios.get(
					`/api/users/creators/${id}`,
				)
				setAuthor(creatorResponse.data.creator) // Store Creator data

				// Then fetch posts for the Creator
				const postsResponse = await axios.get(`/api/posts/author/${id}`)
				setPosts(postsResponse.data.posts)
			} catch (creatorError) {
				// If fetching Creator fails (404), try fetching AUTHOR data
				if (
					creatorError.response &&
					creatorError.response.status === 404
				) {
					try {
						const authorResponse = await axios.get(
							`/api/users/authors/${id}`,
						)
						setAuthor(authorResponse.data.author) // Store Author data

						// Fetch posts for the Author
						const postsResponse = await axios.get(
							`/api/posts/author/${id}`,
						)
						setPosts(postsResponse.data.posts)
					} catch (authorError) {
						// If Author fetch also fails with 404, try MUSEUM
						if (
							authorError.response &&
							authorError.response.status === 404
						) {
							try {
								const museumResponse = await axios.get(
									`/api/users/museums/${id}`,
								)
								setAuthor(museumResponse.data.museum) // Store Museum data

								// Fetch posts for the Museum
								const museumPostsResponse = await axios.get(
									`/api/posts/author/${id}`,
								)
								setPosts(museumPostsResponse.data.posts)
							} catch (museumError) {
								// If Museum fetch also fails with 404, try EXHIBITION
								if (
									museumError.response &&
									museumError.response.status === 404
								) {
									try {
										const exhibitionResponse =
											await axios.get(
												`/api/users/exhibitions/${id}`,
											)
										setAuthor(
											exhibitionResponse.data.exhibition,
										) // Store Exhibition data
										console.log(
											'exhibitionsResponse.data:',
											exhibitionResponse.data,
										)
										// Fetch posts for the Exhibition
										const exhibitionPostsResponse =
											await axios.get(
												`/api/posts/author/${id}`,
											)
										setPosts(
											exhibitionPostsResponse.data.posts,
										)
									} catch (exhibitionError) {
										console.error(
											'Error fetching Exhibition data:',
											exhibitionError,
										)
										setError(
											t(
												'Не вдалося завантажити дані виставки або новини.',
											),
										)
										setPosts([])
									}
								} else {
									console.error(
										'Error fetching Museum data:',
										museumError,
									)
									setError(
										t(
											'Не вдалося завантажити дані музею або новини.',
										),
									)
									setPosts([])
								}
							}
						} else {
							console.error(
								'Error fetching Author data:',
								authorError,
							)
							setError(
								t(
									'Не вдалося завантажити дані автора або новини.',
								),
							)
							setPosts([])
						}
					}
				} else {
					console.error('Error fetching Creator data:', creatorError)
					setError(
						t('Не вдалося завантажити дані творця або новини.'),
					)
					setPosts([])
				}
			} finally {
				setLoading(false)
			}
		}

		fetchAuthorPosts()
	}, [id, t])

	if (loading) {
		return <div className={styles.loading}>{t('Завантаження...')}</div>
	}

	if (error) {
		return <div className={styles.error}>{error}</div>
	}

	if (!author) {
		return (
			<div className={styles.noAuthor}>{t('Митець не знайдений.')}</div>
		)
	}

	const images = getImageUrl(author.images, '/Img/newsCardERROR.jpg')

	const handleAllArtistsPageClick = () => {
		navigate('/all-authors-page')
	}

	const handlePostClick = (id) => {
		navigate(`/posts/${id}`)
	}

	const handleAllAuthorsClick = () => {
		navigate('/all-authors-page')
	}

	return (
		<div className={styles.AuthorsPageContainer}>
			<div className={styles.AuthorPhotoNameContainer}>
				<div className={styles.AuthorPhotoWrapper}>
					<img
						className={styles.AuthorPhoto}
						src={author.images || '/Img/ArtistPhoto.jpg'}
						alt={author.title}
						onError={(e) => {
							e.target.onerror = null
							e.target.src = '/Img/newsCardERROR.jpg'
						}}
					/>
				</div>
				<div className={styles.AuthorTitleWrapper}>
					<h2 className={styles.AuthorTitle}>{author.title}</h2>
					<a className={styles.AuthorLink}>{t('Про автора')}</a>
				</div>
			</div>

			<div className={styles.AuthorNavBarTwoSection}>
				<div className={styles.AuthorNavBarWrapper}>
					<h3 className={styles.PostsNavBarLeft}>{t('Статті')}</h3>
					<div className={styles.NavBarSeparator}></div>
					<h3
						className={styles.AuthorsNavBarRight}
						onClick={handleAllArtistsPageClick}
					>
						{t('Усі Автори')}
					</h3>
				</div>
				<div className={styles.LikeAndShareWrapper}>
					<LikeAndShare />
				</div>
			</div>

			<div className={styles.AuthorPostsListsWrapper}>
				{posts.length > 0 ? (
					posts.map((post) => {
						const formattedDate = getFormattedDate(post.createdAt)
						const formattedTime = getFormattedTime(post.createdAt)

						return (
							<div
								key={post.id}
								className={styles.AuthorPostsLists}
								onClick={() => handlePostClick(post.id)}
							>
								<div
									className={
										styles.AuthorPostsListsInfoWrapper
									}
								>
									<div
										className={
											styles.AuthorPostsListsTitleWrapper
										}
									>
										<h2
											className={
												styles.AuthorPostsListsTitle
											}
										>
											<TranslatedContent
												en={post.title_en}
												uk={post.title_uk}
												html
											/>
										</h2>
									</div>
									<div
										className={
											styles.AuthorPostsListsContentWrapper
										}
									>
										<p
											className={
												styles.AuthorPostsListsContent
											}
										>
											<TranslatedContent
												en={post.content_en}
												uk={post.content_uk}
												html
											/>
										</p>
									</div>
									<div
										className={`${styles.cardClockAndDateWrapper}`}
									>
										<div
											className={`${styles.cardClockAndDateInner}`}
										>
											<div
												className={`${styles.cardClockImgWrapper}`}
											>
												<img
													className={`${styles.cardClockImg}`}
													src={'/Img/clock.svg'}
													alt={t(
														'Світлина годинника',
													)}
													onError={(e) => {
														e.target.onerror = null
														e.target.src =
															'/Img/clock.svg'
													}}
												/>
											</div>
											<div
												className={`${styles.cardDateWrapper}`}
											>
												<p
													className={`${styles.cardDate}`}
												>
													{formattedDate}
												</p>
											</div>
											<div
												className={`${styles.cardTimeWrapper}`}
											>
												<p
													className={`${styles.cardTime}`}
												>
													{formattedTime}
												</p>
											</div>
										</div>
									</div>
								</div>

								<div
									className={
										styles.AuthorPostsListsImageWrapper
									}
								>
									{post.images && (
										<img
											className={`${styles.AuthorPostsListsImage}`}
											src={post.images}
											alt={post.title_uk || post.title_en}
											onError={(e) => {
												e.target.onerror = null
												e.target.src =
													'/Img/newsCardERROR.jpg'
											}}
										/>
									)}
								</div>
							</div>
						)
					})
				) : (
					<div className={styles.noPosts}>
						{t('Новини не знайдено')}
					</div>
				)}
			</div>
		</div>
	)
}

export default AuthorPostsLists
