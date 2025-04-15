import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
	getFormattedDate,
	getFormattedTime,
	getImageUrl,
} from '../../../utils/helper'
import TranslatedContent from './TranslatedContent'
import styles from '/src/styles/components/Blocks/MainNews.module.scss'

function MainMuseums() {
	const { t } = useTranslation()
	const [museums, setMuseums] = useState([])
	const navigate = useNavigate()
	const [visibleMuseumsCount, setVisibleMuseumsCount] = useState(
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
			if (newPostCount !== visibleMuseumsCount) {
				setVisibleMuseumsCount(newPostCount)
				console.log(
					`Window width: ${window.innerWidth}, Visible posts count: ${newPostCount}`,
				)
			}
		}

		window.addEventListener('resize', handleResize)

		// Initial check
		handleResize()

		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [visibleMuseumsCount])

	useEffect(() => {
		// Запит на отримання постів з медіа-даними
		axios
			.get('/api/users/museums')
			.then((response) => {
				console.log('Отримані дані постів:', response.data)
				setMuseums(response.data.museums)
			})
			.catch((error) => {
				console.error('Помилка при завантаженні постів', error)
			})
	}, [])

	const handleMuseumPageClick = (id) => {
		navigate(`/museum-page/${id}`)
	}

	const handleMuseumsPageClick = () => {
		navigate('/museums-page')
	}

	return (
		<div className={`${styles.mainPageNewsContainer}`}>
			<div className={`${styles.mainPageNewsTitleWithButton}`}>
				<h2 className={`${styles.mainPageNewsTitle}`}>{t('Музеї')}</h2>
				<div
					className={`${styles.mainPageNewsButtonWrapper} ${styles.desktopButtonWrapper}`}
				>
					{/* <button className={`${styles.mainPageNewsButton}`}>
						<p
							className={`${styles.mainPageNewsButtonTitle}`}
							onClick={handleMuseumsPageClick}
						>
							{t('Усі музеї')}
						</p>
						<img
							className={`${styles.mainPageNewsButtonImg}`}
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
			<div className={`${styles.mainPageNewsCardsWrapper}`}>
				{museums.slice(0, visibleMuseumsCount).map((museum, index) => {
					// Логування даних для перевірки
					console.log('Витягнені музеі:', museums)

					const featuredMediaUrl = getImageUrl(
						museum.images,
						'/Img/halfNewsCard.jpg',
					)
					console.log('Витягнуте медіа:', featuredMediaUrl)

					const formattedDate = getFormattedDate(museum.createdAt)
					const formattedTime = getFormattedTime(museum.createdAt)

					return (
						<div
							key={museum.id}
							className={`${styles.mainPageNewsCard} ${index === 0 ? styles.firstCard : index === 1 ? styles.secondCard : styles.thirdCard}`}
						>
							<div className={`${styles.cardInner}`}>
								<div
									className={`${styles.cardImgWrapper}`}
									onClick={() =>
										handleMuseumPageClick(museum.id)
									}
								>
									<img
										className={`${styles.cardImg} ${index === 0 ? styles.firstCardImg : index === 1 ? styles.secondCardImg : index === 2 ? styles.thirdCardImg : styles.fourthCardImg}`}
										src={featuredMediaUrl}
										alt={t('Світлина музею')}
										onError={(e) => {
											e.target.onerror = null
											e.target.src =
												'/Img/newsCardERROR.jpg'
										}}
									/>
								</div>
								<div className={`${styles.cardTextWrapper}`}>
									<div
										className={`${styles.cardTitleWrapper}`}
									>
										<h3
											className={`${styles.cardTitle} ${index === 0 ? styles.firstCardTitle : index === 1 ? styles.secondCardTitle : index === 2 ? styles.thirdCardTitle : styles.fourthCardTitle}`}
										>
											<TranslatedContent
												en={
													museum.title || museum.email
												}
												uk={
													museum.title || museum.email
												}
												html
											/>
										</h3>
									</div>
									<div
										className={`${styles.cardDescriptioneWrapper}`}
									>
										<p
											className={`${styles.cardDescription} ${index === 0 ? styles.firstCardDescription : index === 1 ? styles.secondCardDescription : styles.thirdCardDescription}`}
										>
											<TranslatedContent
												en={
													museum.bio ||
													t('Немає біографії')
												}
												uk={
													museum.bio ||
													t('Немає біографії')
												}
												html
											/>
										</p>
									</div>
								</div>
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
											alt={t('Світлина годинника')}
											onError={(e) => {
												e.target.onerror = null
												e.target.src = '/Img/clock.svg'
											}}
										/>
									</div>
									<div
										className={`${styles.cardDateWrapper}`}
									>
										<p className={`${styles.cardTime}`}>
											{formattedTime}
										</p>
									</div>
									<div
										className={`${styles.cardTimeWrapper}`}
									>
										<p className={`${styles.cardDate}`}>
											{formattedDate}
										</p>
									</div>
								</div>
								<div
									className={`${styles.cardReadMoreWrapper}`}
								>
									<a
										className={`${styles.cardReadMoreLink}`}
										onClick={() =>
											handleMuseumPageClick(museum.id)
										}
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
				<button className={`${styles.mainPageNewsButton}`}>
					<p
						className={`${styles.mainPageNewsButtonTitle}`}
						onClick={handleMuseumsPageClick}
					>
						{t('Усі музеї')}
					</p>
					<img
						className={`${styles.mainPageNewsButtonImg}`}
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

export default MainMuseums
