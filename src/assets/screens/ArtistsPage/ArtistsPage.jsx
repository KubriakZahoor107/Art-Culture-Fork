import styles from '@/styles/layout/ArtistsPage.module.scss'
import AllArtistsPageSearchSlider from '@components/Sliders/AllArtistsPageLettersSortSlider/AllArtistsPageSearchSlider'
import ArtistsPageNewsArtistsSlider from '@components/Sliders/ArtistsPageSliders/ArtistsPageNewsArtistsSlider.jsx'
import MainPopularArtistsSlider from '@components/Sliders/MainPopularArtsSlider/MainPopularArtsSlider.jsx'
import searchStyle from '@styles/layout/ArtistsPage.module.scss'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { englishLetters, ukrainianLetters } from '../../../utils/constants'
import { getImageUrl } from '../../../utils/helper.js'
import Search from '../Search/Search'

function ArtistsPage() {
	const { t } = useTranslation()

	const [creators, setCreators] = useState([])
	const [loading, setLoading] = useState(true)
	const navigate = useNavigate()
	const [error, setError] = useState(null)
	const [visibleCreatorsCount, setVisibleCreatorsCount] = useState(
		getCreatorsCount(window.innerWidth),
	)

	const timeLineRef = useRef(null)

	// ADD sortMode state: "ALL" or "ALPHABETICAL"
	const [sortMode, setSortMode] = useState('ALL')
	const [selectedLetter, setSelectedLetter] = useState()
	const [lettersMode, setLettersMode] = useState('uk')
	const [hoveringLettersButton, setHoveringLettersButton] = useState(false)

	const [timelineYears, setTimelineYears] = useState([])
	const [selectedYear, setSelectedYear] = useState(null)

	function getCreatorsCount(width) {
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
			const newCreatorCount = getCreatorsCount(window.innerWidth)
			console.log(
				`Window width: ${window.innerWidth}, New creator count: ${newCreatorCount}`,
			)
			if (newCreatorCount !== visibleCreatorsCount) {
				setVisibleCreatorsCount(newCreatorCount)
				console.log(
					`Updated visibleCreatorsCount to: ${newCreatorCount}`,
				)
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
		const fetchCreator = async () => {
			try {
				const response = await axios.get('/api/users/creators')
				console.log('received author data', response.data)
				setCreators(response.data.creators)
				setLoading(false)
			} catch (error) {
				console.error('Error fetching author data', error)
				setLoading(false)
			}
		}

		fetchCreator()
	}, [])

	useEffect(() => {
		if (!creators.length) return // no creators => skip

		let minYear = Infinity
		let maxYear = -Infinity

		// Find the min and max years from createdAt
		creators.forEach((creator) => {
			if (creator.createdAt) {
				const year = new Date(creator.createdAt).getFullYear()
				if (year < minYear) minYear = year
				if (year > maxYear) maxYear = year
			}
		})

		// If data had no valid dates, skip
		if (minYear === Infinity || maxYear === -Infinity) return

		// Build a timeline array in steps, e.g. every 10 years
		const yearSet = new Set()
		creators.forEach((creator) => {
			if (creator.createdAt) {
				const y = new Date(creator.createdAt).getFullYear()
				yearSet.add(y)
			}
		})

		const distinctYears = Array.from(yearSet).sort((a, b) => a - b)
		setTimelineYears(distinctYears)
	}, [creators])

	const handleAuthorPreviewClick = (id) => {
		navigate(`/artist/${id}`)
	}

	const handleAllAuthorsClick = () => {
		navigate('/all-artists-page')
	}

	const handleShowAll = () => {
		setSortMode('ALL')
		setSelectedLetter('')
		setSelectedYear(null)
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
	let displayedCreators = [...creators]

	if (sortMode === 'LETTERS') {
		// Sort by the correct locale
		const locale = lettersMode === 'uk' ? 'uk' : 'en'
		displayedCreators.sort((a, b) =>
			(a.title || '').localeCompare(b.title || '', locale),
		)

		// Filter by selected letter if any
		if (selectedLetter) {
			displayedCreators = displayedCreators.filter((creator) => {
				const firstChar = creator.title?.[0]?.toUpperCase() || ''
				return firstChar === selectedLetter
			})
		}
	} else if (sortMode === 'TIME') {
		// Sort by time (descending or ascending).
		// For example, let's assume newest creators first:
		displayedCreators.sort((a, b) => {
			const dateA = new Date(a.createdAt)
			const dateB = new Date(b.createdAt)
			// descending (newest first):
			return dateB - dateA
		})
		// If the user selected a year => filter out those older
		// or filter however you prefer (>= year, or a range, etc.)
		if (selectedYear !== null) {
			displayedCreators = displayedCreators.filter((creator) => {
				const year = new Date(creator.createdAt).getFullYear()
				// e.g., for “1950” means 1950 <= year < 1960
				return year >= selectedYear && year < selectedYear + 10
			})
		}
	}

	// If sortMode === 'ALL', no sorting/filtering

	// Limit to visible
	displayedCreators = displayedCreators.slice(0, visibleCreatorsCount)

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
		<div className={`${styles.ArtistsPageContainer}`}>
			<div className={`${styles.ArtistsPageTitleWrapper}`}>
				<h1 className={`${styles.ArtistsPageTitle}`}>{t('Митці')}</h1>
			</div>

			<div className={`${styles.ArtistsPageSeparatorWrapper}`}>
				<div className={`${styles.ArtistsPageSeparator}`}></div>
			</div>

			<div className={`${styles.ArtistsPageSubTitleWrapper}`}>
				<h3 className={`${styles.ArtistsPageSubTitle}`}>
					{t('Слідкуйте за мистецтвом!')}
				</h3>
			</div>

			<div className={`${styles.ArtistsPageArtistsDescriptionWrapper}`}>
				<p className={`${styles.ArtistsPageArtistsFirstDescription}`}>
					{t(
						'Отримуйте запрошення на перегляди виставок та будьте серед перших, хто дізнається про нагороди, призи, книги та виставки в публічних і комерційних галереях.',
					)}
				</p>

				<p className={`${styles.ArtistsPageArtistsSecondDescription}`}>
					{t('Просто шукайте поля для підписки')}&#8194;&#34;
					{t('СЛІДКУВАТИ ЗА ЦИМ МИТЦЕМ')}&#34;&#8194;
					{t(
						'у нижній частині новинних статей Art & Culture Online, профілів митців та попередніх переглядів виставок, або переглядайте сторінки митців нижче.',
					)}
				</p>
			</div>

			<Search
				className={searchStyle.ArtistsPageArtistsSearchWrapper}
				searchInput={searchStyle.ArtistsPageArtistsSearchInput}
				placeholderName={t('Пошук митців')}
			/>

			<ArtistsPageNewsArtistsSlider />

			<div className={`${styles.ArtistsPageGalleryContainer}`}>
				<div className={`${styles.ArtistsPageGalleryTitleWrapper}`}>
					<h2 className={`${styles.ArtistsPageGalleryTitle}`}>
						{t('Перегляд.')} &#8243;{t('Митці')}&#8243;
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
					) : displayedCreators.length === 0 ? (
						<div className={styles.noCreators}>
							{t('Немає митців для відображення.')}
						</div>
					) : (
						<div
							className={`${styles.ArtistsPageGalleryInnerWrapper}`}
						>
							{displayedCreators.map((creator) => {
								const featuredMediaUrl = getImageUrl(
									creator.images,
									'/Img/ArtistPhoto.jpg',
								)

								return (
									<div
										key={creator.id}
										className={`${styles.ArtistsPageGalleryCardWrapper}`}
									>
										<div
											className={`${styles.ArtistsPageGalleryCardPictureWrapper}`}
											onClick={() =>
												handleAuthorPreviewClick(
													creator.id,
												)
											}
											style={{ cursor: 'pointer' }}
										>
											<img
												className={`${styles.ArtistsPageGalleryCardPicture}`}
												src={featuredMediaUrl}
												alt={`Фото митця ${creator.title}`}
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
												{creator.title}
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
							onClick={handleAllAuthorsClick}
						>
							{t('Всі митці')}
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
			<MainPopularArtistsSlider />
		</div>
	)
}

export default ArtistsPage
