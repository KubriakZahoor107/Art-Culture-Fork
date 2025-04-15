import AllMuseumsMap from '@components/Blocks/AllMuseumsMap.jsx'
import AllArtistsPageSearchSlider from '@components/Sliders/AllArtistsPageLettersSortSlider/AllArtistsPageSearchSlider'
import MuseumsPageNewsMuseum from '@components/Sliders/MuseumsPageSliders/MuseumsPageNewsMuseum.jsx'
import MuseumsPagePopularMuseums from '@components/Sliders/MuseumsPageSliders/MuseumsPagePopularMuseums.jsx'
import MuseumsPageTopSlider from '@components/Sliders/MuseumsPageSliders/MuseumsPageTopSlider.jsx'
import styles from '@styles/layout/MuseumsPage.module.scss'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { getImageUrl } from '../../../utils/helper.js'

import { englishLetters, ukrainianLetters } from '../../../utils/constants'

function MuseumsPage({ baseUrl }) {
	const { t } = useTranslation()
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const [error, setError] = useState(null)
	const [museums, setMuseums] = useState([])
	const [product, setProducts] = useState([])

	const [visibleMuseumsCount, setVisibleMuseumsCount] = useState(
		getMuseumsCount(window.innerWidth),
	)

	const timeLineRef = useRef(null)

	const [sortMode, setSortMode] = useState('ALL')
	const [selectedLetter, setSelectedLetter] = useState('')
	const [lettersMode, setLettersMode] = useState('uk')
	const [hoveringLettersButton, setHoveringLettersButton] = useState(false)

	const [timelineYears, setTimelineYears] = useState([])
	const [selectedYear, setSelectedYear] = useState(null)

	function getMuseumsCount(width) {
		if (width === null || width === undefined) {
			throw new Error('Width must be a number')
		}
		if (width >= 1920) {
			return 16
		}
		if (width >= 1441 && width < 1920) {
			return 12
		}
		if (width > 570 && width < 1440) {
			return 8
		}
		if (width <= 569) {
			return 4
		}
	}

	useEffect(() => {
		const handleResize = () => {
			const newMuseumCount = getMuseumsCount(window.innerWidth)
			console.log(
				`Window width: ${window.innerWidth}, New museum count: ${newMuseumCount}`,
			)
			if (newMuseumCount !== visibleMuseumsCount) {
				setVisibleMuseumsCount(newMuseumCount)
				console.log(`Updated visibleMuseumCount to: ${newMuseumCount}`)
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
		/**
		 * Fetches a list of museums from the API and updates the state with the retrieved data.
		 * Sets loading state to false after the data is fetched or an error occurs.
		 * Logs the fetched data or error to the console.
		 * Displays an error message if the fetch operation fails.
		 */

		const fetchMuseums = async () => {
			try {
				const response = await axios.get(`/api/users/museums`)
				console.log('Fetched museum', response.data)
				setMuseums(response.data.museums)
				setLoading(false)
			} catch (error) {
				console.error('Error fetch museum', error)
				setError(t('Не вдалося завантажити дані.'))
				setLoading(false)
			}
		}
		fetchMuseums()
	}, [])

	useEffect(() => {
		const fetchMUseumsProducts = async () => {
			try {
				setLoading(true)
				const response = await axios.get(
					'/api/products/museum-products',
				)
				console.log('Fetch Products Maps', response.data)
				setProducts(response.data.products)
			} catch (error) {
				console.error('Error fetching Museums:', error)
				setError(t('Не вдалося завантажити.'))
			} finally {
				setLoading(false)
			}
		}
		fetchMUseumsProducts()
	}, [])

	useEffect(() => {
		if (!museums.length) return // no museums => skip

		let minYear = Infinity
		let maxYear = -Infinity

		// Find the min and max years from createdAt
		museums.forEach((museum) => {
			if (museum.createdAt) {
				const year = new Date(museum.createdAt).getFullYear()
				if (year < minYear) minYear = year
				if (year > maxYear) maxYear = year
			}
		})

		// If data had no valid dates, skip
		if (minYear === Infinity || maxYear === -Infinity) return

		// Build a timeline array in steps, e.g. every 10 years
		const yearSet = new Set()
		museums.forEach((museum) => {
			if (museum.createdAt) {
				const y = new Date(museum.createdAt).getFullYear()
				yearSet.add(y)
			}
		})

		const distinctYears = Array.from(yearSet).sort((a, b) => a - b)
		setTimelineYears(distinctYears)
	}, [museums])

	const handleMuseumClick = (id) => {
		navigate(`/museum-page/${id}`)
	}

	const handleAllMuseumsPageClick = () => {
		navigate('/all-museums-page')
	}

	const handleShowAll = () => {
		setSortMode('ALL')
		setSelectedLetter('')
	}
	const handleLettersButtonClick = () => {
		if (sortMode === 'ALL') {
			setSortMode('LETTERS')
			setSelectedLetter('')
			setSelectedYear(null)
			// lettersMode toggles each click
			setLettersMode((prev) => (prev === 'uk' ? 'en' : 'uk'))
		} else if (sortMode === 'LETTERS') {
			// Just switch alphabets
			setLettersMode((prev) => (prev === 'uk' ? 'en' : 'uk'))
			setSelectedLetter('')
		} else if (sortMode === 'TIME') {
			// If currently in TIME mode, let's switch to LETTERS
			setSortMode('LETTERS')
			setSelectedLetter('')
			setSelectedYear(null)
		}
	}

	// Called by the slider to pick a letter
	const handleLetterSelected = (letter) => {
		setSelectedLetter(letter)
	}

	// "Час" => switch to TIME mode
	const handleTimeSortClick = () => {
		setSortMode('TIME')
		// Clear letter stuff
		setSelectedLetter('')
	}

	// -----------------------
	// DERIVED array
	// -----------------------
	let displayedMuseums = [...museums]

	if (sortMode === 'LETTERS') {
		// Sort by the correct locale
		const locale = lettersMode === 'uk' ? 'uk' : 'en'
		displayedMuseums.sort((a, b) =>
			(a.title || '').localeCompare(b.title || '', locale),
		)

		// Filter by selected letter if any
		if (selectedLetter) {
			displayedMuseums = displayedMuseums.filter((museum) => {
				const firstChar = museum.title?.[0]?.toUpperCase() || ''
				return firstChar === selectedLetter
			})
		}
	} else if (sortMode === 'TIME') {
		// Sort by time (descending or ascending).
		// For example, let's assume newest creators first:
		displayedMuseums.sort((a, b) => {
			const dateA = new Date(a.createdAt)
			const dateB = new Date(b.createdAt)
			// descending (newest first):
			return dateB - dateA
		})
		// If the user selected a year => filter out those older
		// or filter however you prefer (>= year, or a range, etc.)
		if (selectedYear !== null) {
			displayedMuseums = displayedMuseums.filter((museum) => {
				const year = new Date(museum.createdAt).getFullYear()
				// e.g., for “1950” means 1950 <= year < 1960
				return year >= selectedYear && year < selectedYear + 10
			})
		}
	}
	// If sortMode === 'ALL', no sorting/filtering

	// Limit to visible
	displayedMuseums = displayedMuseums.slice(0, visibleMuseumsCount)

	// Decide what letters to show
	const letters = lettersMode === 'uk' ? ukrainianLetters : englishLetters

	// Decide the letters button text
	//   - If lettersMode is 'uk', by default we show "А-Я", but on hover we show "A-Z".
	//   - If lettersMode is 'en', by default we show "A-Z", but on hover we show "А-Я".
	let lettersBtnText = ''
	if (lettersMode === 'uk') {
		lettersBtnText = hoveringLettersButton ? 'A-Z' : 'А-Я'
	} else {
		lettersBtnText = hoveringLettersButton ? 'А-Я' : 'A-Z'
	}

	const handleScrollLeft = () => {
		if (timeLineRef.current) {
			timeLineRef.current.scrollBy({
				left: -100, // negative => scroll left
				behavior: 'smooth', // optional for smooth scrolling
			})
		}
	}

	const handleScrollRight = () => {
		if (timeLineRef.current) {
			timeLineRef.current.scrollBy({
				left: 100,
				behavior: 'smooth',
			})
		}
	}

	return (
		<div className={`${styles.MuseumsPageContainer}`}>
			<div className={`${styles.MuseumsPageTitleContainer}`}>
				<h1 className={`${styles.MuseumsPageTitle}`}>{t('Музеї')}</h1>
			</div>

			<MuseumsPageTopSlider />

			<MuseumsPageNewsMuseum />

			<div className={`${styles.ArtistsPageGalleryContainer}`}>
				<div className={`${styles.ArtistsPageGalleryTitleWrapper}`}>
					<h2 className={`${styles.ArtistsPageGalleryTitle}`}>
						{t('Перегляд.')} &#8243;{t('МУЗЕЇ')}&#8243;
					</h2>
				</div>

				<div className={`${styles.ArtistsPageGalleryButtonsWrapper}`}>
					<button
						className={`${styles.ArtistsPageGalleryButton}`}
						onClick={handleShowAll}
					>
						<h3
							className={`${styles.ArtistsPageGalleryButtonTitle}`}
						>
							{t('Усі')}
						</h3>
					</button>

					<p
						className={`${styles.ArtistsPageGalleryButtonSeparator}`}
					>
						|
					</p>
					<div
						onMouseEnter={() => setHoveringLettersButton(true)}
						onMouseLeave={() => setHoveringLettersButton(false)}
						style={{
							position: 'relative',
							display: 'inline-block',
						}}
					>
						<button
							className={`${styles.ArtistsPageGalleryButton}`}
							onClick={handleLettersButtonClick}
						>
							<h3
								className={`${styles.ArtistsPageGalleryButtonTitle}`}
							>
								{lettersBtnText}
							</h3>
						</button>
						{hoveringLettersButton && (
							<div
								style={{
									position: 'absolute',
									bottom: '105%', // place tooltip above the button
									left: '50%',
									transform: 'translateX(-50%)',
									backgroundColor: '#333',
									color: '#fff',
									padding: '4px 8px',
									borderRadius: '4px',
									whiteSpace: 'nowrap',
									fontSize: '0.85rem',
									zIndex: 9999,
								}}
							>
								{t('Натисніть, щоб вибрати мову')}
							</div>
						)}
					</div>
					<p
						className={`${styles.ArtistsPageGalleryButtonSeparator}`}
					>
						|
					</p>

					<button
						className={`${styles.ArtistsPageGalleryButtonWhithClock}`}
						onClick={handleTimeSortClick}
					>
						<h3
							className={`${styles.ArtistsPageGalleryButtonTitle}`}
						>
							{t('Час')}
						</h3>

						<img
							className={`${styles.ArtistsPageGalleryButtonClock}`}
							src={'/Img/clock.svg'}
							alt="Слідкуйте за мистецтвом!"
							onError={(e) => {
								e.target.onerror = null
								e.target.src = '/Img/newsCardERROR.jpg'
							}}
						/>
					</button>
				</div>

				{/* If we're in TIME mode => show the dynamic timeline */}
				{sortMode === 'TIME' && timelineYears.length > 0 && (
					<div className={styles.timelineWrapper}>
						{/* The horizontally scrollable container */}
						<div
							className={styles.timelineScrollArea}
							ref={timeLineRef}
						>
							<div className={styles.timelineContainer}>
								{timelineYears.map((year) => {
									const isSelected = selectedYear === year
									return (
										<div
											key={year}
											className={`${styles.timelineMarker} ${
												isSelected
													? styles.selectedMarker
													: ''
											}`}
											onClick={() =>
												setSelectedYear(year)
											}
										>
											<div
												className={styles.timelineYear}
											>
												{year}
											</div>
											<div
												className={styles.timelineTick}
											/>
										</div>
									)
								})}
							</div>
						</div>

						{/* The left arrow */}
						<button
							className={`${styles.timelineNavButton} ${styles.leftArrow}`}
							onClick={handleScrollLeft}
						></button>

						{/* The right arrow */}
						<button
							className={`${styles.timelineNavButton} ${styles.rightArrow}`}
							onClick={handleScrollRight}
						></button>
					</div>
				)}

				{sortMode === 'LETTERS' && (
					<AllArtistsPageSearchSlider
						letters={letters}
						onLetterSelected={handleLetterSelected}
						selectedLetter={selectedLetter}
					/>
				)}

				<div className={`${styles.ArtistsPageGalleryCardsWrapper}`}>
					{loading ? (
						<div className={styles.loading}>
							{t('Завантаження...')}
						</div>
					) : error ? (
						<div className={styles.error}>{error}</div>
					) : displayedMuseums.length === 0 ? (
						<div className={styles.noCreators}>
							{t('Немає музеїв для відображення.')}
						</div>
					) : (
						<div
							className={`${styles.ArtistsPageGalleryInnerWrapper}`}
						>
							{displayedMuseums.map((museum) => {
								const featuredMediaUrl = getImageUrl(
									museum.images,
									'/Img/halfNewsCard.jpg',
								)

								return (
									<div
										key={museum.id}
										className={`${styles.ArtistsPageGalleryCardWrapper}`}
									>
										<div
											className={`${styles.ArtistsPageGalleryCardPictureWrapper}`}
											style={{ cursor: 'pointer' }}
											onClick={() =>
												handleMuseumClick(museum.id)
											}
										>
											<img
												className={`${styles.ArtistsPageGalleryCardPicture}`}
												src={featuredMediaUrl}
												alt={'Фото музею'}
												loading="lazy"
												onError={(e) => {
													e.target.onerror = null
													e.target.src =
														'/Img/ArtistPhoto.jpg'
												}}
											/>
										</div>
										<div
											className={`${styles.ArtistsPageGalleryCardDescriptionWrapper}`}
										>
											<p
												className={`${styles.ArtistsPageGalleryCardDescription}`}
											>
												{museum.title}
											</p>
										</div>
									</div>
								)
							})}
						</div>
					)}
				</div>

				<div
					className={`${styles.ArtistsPageGalleryAllArtistsButtonWrapper}`}
				>
					<button
						className={`${styles.ArtistsPageGalleryAllArtistsButton}`}
					>
						<p
							className={`${styles.ArtistsPageGalleryAllArtistsButtonText}`}
							onClick={handleAllMuseumsPageClick}
						>
							{t('Всі музеї')}
						</p>
						<img
							className={`${styles.ArtistsPageGalleryAllArtistsButtonArrow}`}
							src={'/Img/buttonArrow.svg'}
							alt="Слідкуйте за мистецтвом!"
							onError={(e) => {
								e.target.onerror = null
								e.target.src = '/Img/newsCardERROR.jpg'
							}}
						/>
					</button>
				</div>
			</div>

			<MuseumsPagePopularMuseums />

			<div className={`${styles.MuseumsPageMapTitleContainer}`}>
				<h2 className={`${styles.MuseumsPageMapTitle}`}>
					{t('Мапа знаходження  Музеїв')}
				</h2>

				<AllMuseumsMap
					className={styles.MuseumsMapWrapper}
					museums={museums}
				/>
			</div>
		</div>
	)
}

export default MuseumsPage
