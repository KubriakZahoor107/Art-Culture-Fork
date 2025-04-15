import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext'
import { getFormattedDate, getImageUrl } from '../../../utils/helper'
import TranslatedContent from './TranslatedContent'
import styles from '/src/styles/components/Blocks/MainNews.module.scss' // Assuming you have a CSS module for styling

function MainArtists() {
	const { t } = useTranslation()
	const [creators, setCreators] = useState([])
	const navigate = useNavigate()
	const [regDate, setRegDate] = useState('')
	const [regTime, setRegTime] = useState('')
	const { user } = useAuth()
	const [visibleCreatorsCount, setVisibleCreatorsCount] = useState(
		getPostsCount(window.innerWidth),
	)

	function getPostsCount(width) {
		if (width === null || width === undefined) {
			throw new Error('Width must be a number')
		}
		if (width >= 1920) {
			return 4
		}
		if (width >= 1600 && width < 1920) {
			return 3
		}
		if (width > 1440 && width < 1600) {
			return 2
		}
		if (width <= 1440) {
			return 2
		}
	}

	useEffect(() => {
		const handleResize = () => {
			const newPostCount = getPostsCount(window.innerWidth)
			console.log(
				`Window width: ${window.innerWidth}, New post count: ${newPostCount}`,
			)
			if (newPostCount !== visibleCreatorsCount) {
				setVisibleCreatorsCount(newPostCount)
				console.log(`Updated visiblePostsCount to: ${newPostCount}`)
			}
		}

		window.addEventListener('resize', handleResize)

		// Initial check
		handleResize()

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [visibleCreatorsCount])

	useEffect(() => {
		axios
			.get('/api/users/creators')
			.then((response) => {
				console.log('Received creator data:', response.data)
				setCreators(response.data.creators)
			})
			.catch((error) => {
				console.error('Error loading creator', error)
			})
	}, [])

	const handleArtistPageClick = (id) => {
		navigate(`/artist/${id}`)
	}

	const handleAllArtistPageClick = () => {
		navigate('/all-artists-page')
	}

	return (
		<div className={styles.mainPageNewsContainer}>
			<div className={styles.mainPageNewsTitleWithButton}>
				<h2 className={styles.mainPageNewsTitle}>{t('Митці')}</h2>
				<div
					className={`${styles.mainPageNewsButtonWrapper} ${styles.desktopButtonWrapper}`}
				>
					{/* <button className={styles.mainPageNewsButton}>
						<p
							className={styles.mainPageNewsButtonTitle}
							onClick={handleAllArtistPageClick}
						>
							{t('Усі митці')}
						</p>
						<img
							className={styles.mainPageNewsButtonImg}
							src={'/Img/buttonArrow.svg'}
							alt={t('Стрілка')}
							onError={(e) => {
								e.target.onerror = null
								e.target.src = '/mainNewImg/buttonArrow.svg'
							}}
						/>
					</button> */}
				</div>
			</div>
			<div className={styles.mainPageNewsCardsWrapper}>
				{creators
					.slice(0, visibleCreatorsCount)
					.map((creator, index) => {
						const featuredMediaUrl = getImageUrl(
							creator.images,
							'/Img/halfNewsCard.jpg',
						)

						const formattedDate = getFormattedDate(
							creator.createdAt,
						)

						const formattedTime = new Date(
							creator.createdAt,
						).toLocaleTimeString('uk-UA', {
							hour: '2-digit',
							minute: '2-digit',
						})

						return (
							<div
								key={creator.id}
								className={`${styles.mainPageNewsCard} ${index === 0 ? styles.firstCard : index === 1 ? styles.secondCard : styles.thirdCard}`}
							>
								<div className={styles.cardInner}>
									<div
										className={styles.cardImgWrapper}
										onClick={() =>
											handleArtistPageClick(creator.id)
										}
									>
										<img
											className={`${styles.cardImg} ${index === 0 ? styles.firstCardImg : index === 1 ? styles.secondCardImg : index === 2 ? styles.thirdCardImg : styles.fourthCardImg}`}
											src={featuredMediaUrl}
											alt={t('Світлина')}
											onError={(e) => {
												e.target.onerror = null
												e.target.src =
													'/Img/halfNewsCard.jpg'
											}}
										/>
									</div>
									<div className={styles.cardTextWrapper}>
										<div
											className={styles.cardTitleWrapper}
										>
											<h3
												className={`${styles.cardTitle} ${index === 0 ? styles.firstCardTitle : index === 1 ? styles.secondCardTitle : index === 2 ? styles.thirdCardTitle : styles.fourthCardTitle}`}
											>
												<TranslatedContent
													en={
														creator.title ||
														creator.email
													}
													uk={
														creator.title ||
														creator.email
													}
													html
												/>
											</h3>
										</div>
										<div
											className={
												styles.cardDescriptioneWrapper
											}
										>
											<p
												className={`${styles.cardDescription} ${index === 0 ? styles.firstCardDescription : index === 1 ? styles.secondCardDescription : styles.thirdCardDescription}`}
											>
												<TranslatedContent
													en={
														creator.bio ||
														t('Немає біографії')
													}
													uk={
														creator.bio ||
														t('Немає біографії')
													}
													html
												/>
											</p>
										</div>
									</div>
								</div>
								<div className={styles.cardClockAndDateWrapper}>
									<div
										className={styles.cardClockAndDateInner}
									>
										<div
											className={
												styles.cardClockImgWrapper
											}
										>
											<img
												className={styles.cardClockImg}
												src={'/Img/clock.svg'}
												alt={t('Світлина годинника')}
												onError={(e) => {
													e.target.onerror = null
													e.target.src =
														'/Img/clock.svg'
												}}
											/>
										</div>
										<div className={styles.cardDateWrapper}>
											<p className={styles.cardTime}>
												{formattedTime}
											</p>
										</div>
										<div className={styles.cardTimeWrapper}>
											<p className={styles.cardDate}>
												{formattedDate}
											</p>
										</div>
									</div>
									<div className={styles.cardReadMoreWrapper}>
										<a
											onClick={() =>
												handleArtistPageClick(
													creator.id,
												)
											}
											className={styles.cardReadMoreLink}
										>
											{t('Читати далі')}
										</a>
									</div>
								</div>
							</div>
						)
					})}
			</div>
			<div
				className={`${styles.mainPageNewsButtonWrapper} ${styles.mobileButtonWrapper}`}
			>
				<button className={styles.mainPageNewsButton}>
					<p
						className={styles.mainPageNewsButtonTitle}
						onClick={handleAllArtistPageClick}
					>
						{t('Усі митці')}
					</p>
					<img
						className={styles.mainPageNewsButtonImg}
						src={'/Img/buttonArrow.svg'}
						alt={t('Стрілка')}
						onError={(e) => {
							e.target.onerror = null
							e.target.src = '/mainNewImg/buttonArrow.svg'
						}}
					/>
				</button>
			</div>
		</div>
	)
}

export default MainArtists
