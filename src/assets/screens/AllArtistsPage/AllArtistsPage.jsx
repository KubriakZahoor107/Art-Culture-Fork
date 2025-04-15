import LoadingError from '@components/Blocks/LoadingError'
import AllArtistsPageSearchSlider from '@components/Sliders/AllArtistsPageLettersSortSlider/AllArtistsPageSearchSlider'
import {
	default as searchStyle,
	default as styles,
} from '@styles/layout/AllArtistsPage.module.scss'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { englishLetters, ukrainianLetters } from '../../../utils/constants'
import Search from '../Search/Search'

function AllArtistsPage() {
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()

	// Existing states
	const [creators, setCreators] = useState({})
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [language, setLanguage] = useState(i18n.language)

	// Tracks which letter user selected in the slider
	const [selectedLetter, setSelectedLetter] = useState('')

	// Which "sort mode" (button) is active? "ALL" | "UK" | "EN"
	const [sortMode, setSortMode] = useState('ALL')

	useEffect(() => {
		const handleLanguageChange = () => setLanguage(i18n.language)
		i18n.on('languageChanged', handleLanguageChange)

		return () => {
			i18n.off('languageChanged', handleLanguageChange)
		}
	}, [i18n])

	/**
	 * Helper: group an array of creators by the first letter of `creator.title`.
	 * Then filter + sort letters depending on sortMode: UK or EN or ALL.
	 */
	const groupByLetter = (creatorsArray) => {
		const grouped = creatorsArray.reduce((acc, creator) => {
			const letter = creator.title?.charAt(0).toUpperCase() || ''
			if (!acc[letter]) {
				acc[letter] = []
			}
			acc[letter].push(creator)
			return acc
		}, {})

		let lettersInUse = Object.keys(grouped)

		if (sortMode === 'UK') {
			// Show only Ukrainian letters that have creators
			lettersInUse = ukrainianLetters.filter((l) =>
				lettersInUse.includes(l),
			)
		} else if (sortMode === 'EN') {
			// Show only English letters that have creators
			lettersInUse = englishLetters.filter((l) =>
				lettersInUse.includes(l),
			)
		} else {
			// "ALL" => optionally merge both sets
			const merged = [...ukrainianLetters, ...englishLetters]
			lettersInUse = merged.filter((l) => lettersInUse.includes(l))
		}

		// Rebuild a sorted object
		const sortedObj = {}
		lettersInUse.forEach((letter) => {
			sortedObj[letter] = grouped[letter]
		})
		return sortedObj
	}

	/**
	 * Fetch creators whenever sortMode or selectedLetter changes
	 */
	useEffect(() => {
		const fetchCreators = async () => {
			try {
				setLoading(true)
				setError(null)

				// Decide the endpoint based on active button
				let url = '/api/users/creators' // Default => all
				if (sortMode === 'UK') {
					url = selectedLetter
						? `/api/users/creators/language/uk?letter=${selectedLetter}`
						: `/api/users/creators/language/uk`
				} else if (sortMode === 'EN') {
					url = selectedLetter
						? `/api/users/creators/language/en?letter=${selectedLetter}`
						: `/api/users/creators/language/en`
				}

				console.log('Requesting URL:', url)
				const response = await axios.get(url)
				const fetchedCreators = response.data.creators || []

				// Group them by letter => so "Усі" also remains letter-based
				const grouped = groupByLetter(fetchedCreators)
				setCreators(grouped)

				setLoading(false)
			} catch (err) {
				setLoading(false)
				console.error('Error fetching creators:', err)
				setError(err.response?.data?.error || 'An error occurred')
			}
		}

		fetchCreators()
	}, [sortMode, selectedLetter])

	// Buttons
	const handleShowAll = () => {
		setSortMode('ALL')
		setSelectedLetter('')
	}
	const handleShowUkrainian = () => {
		setSortMode('UK')
		setSelectedLetter('')
	}
	const handleShowEnglish = () => {
		setSortMode('EN')
		setSelectedLetter('')
	}

	// Slider callback => sets selected letter => triggers fetch
	const handleLetterSelected = (letter) => {
		setSelectedLetter(letter)
	}

	const handleAuthorPreviewClick = (id) => {
		navigate(`/artist/${id}`)
	}

	return (
		<div className={styles.ArtistsPageContainer}>
			<div className={styles.ArtistsPageTitleWrapper}>
				<h1>{t('Усі митці')}</h1>
			</div>
			<div className={styles.ArtistsPageSeparatorWrapper}>
				<div className={styles.ArtistsPageSeparator}></div>
			</div>
			{/* <div className={styles.ArtistsPageArtistsSearchWrapper}>
				<input
					className={styles.ArtistsPageArtistsSearchInput}
					placeholder={t('Пошук митця')}
				/>
			</div> */}
			<Search
				className={searchStyle.ArtistsPageArtistsSearchWrapper}
				searchInput={searchStyle.ArtistsPageArtistsSearchInput}
				placeholderName={t('Пошук митця')}
			/>

			{/** 3-Button Block */}
			<div className={styles.ArtistsPageGalleryButtonsWrapper}>
				<button
					className={styles.ArtistsPageGalleryButton}
					onClick={handleShowAll}
				>
					<h3 className={styles.ArtistsPageGalleryButtonTitle}>
						{t('Усі')}
					</h3>
				</button>

				<p className={styles.ArtistsPageGalleryButtonSeparator}>|</p>

				<button
					className={styles.ArtistsPageGalleryButton}
					onClick={handleShowUkrainian}
				>
					<h3 className={styles.ArtistsPageGalleryButtonTitle}>
						{t('А-Я')}
					</h3>
				</button>

				<p className={styles.ArtistsPageGalleryButtonSeparator}>|</p>

				<button
					className={styles.ArtistsPageGalleryButtonWhithClock}
					onClick={handleShowEnglish}
				>
					<h3 className={styles.ArtistsPageGalleryButtonTitle}>
						{t('A-Z')}
					</h3>
				</button>
			</div>

			{/** Conditionally show the slider for UK or EN */}
			{sortMode === 'UK' && (
				<AllArtistsPageSearchSlider
					letters={ukrainianLetters}
					onLetterSelected={handleLetterSelected}
					selectedLetter={selectedLetter}
				/>
			)}
			{sortMode === 'EN' && (
				<AllArtistsPageSearchSlider
					letters={englishLetters}
					onLetterSelected={handleLetterSelected}
					selectedLetter={selectedLetter}
				/>
			)}

			<div className={styles.ArtistsContainer}>
				{/** 1) Display a global "No authors" if empty and not loading */}
				{!loading && Object.keys(creators).length === 0 && (
					<LoadingError
						message={t('Відсутні автори за ціею літерою')}
					/>
				)}
				{Object.keys(creators).map((letter) => (
					<div key={letter} className={styles.ArtistsWrapper}>
						<div className={styles.LetterWrapper}>
							<h2 className={styles.Letter}>{letter}</h2>
						</div>
						<div className={styles.ArtistsByLetterWrapper}>
							{creators[letter].map((creator) => (
								<div
									key={creator.id}
									className={styles.ArtistWrapper}
									onClick={() =>
										handleAuthorPreviewClick(creator.id)
									}
								>
									<div
										className={
											styles.ArtistInformationWrapper
										}
									>
										<div
											className={
												styles.ArtistTitleWrapper
											}
										>
											<p className={styles.ArtistTitle}>
												{creator.title}
											</p>
										</div>
										<div
											className={
												styles.ArtistPhotoWrapper
											}
										>
											<img
												className={styles.ArtistPhoto}
												src={
													creator.images ||
													'/Img/ArtistPhoto.jpg'
												}
												alt={creator.title}
												onError={(e) => {
													e.target.onerror = null
													e.target.src =
														'/Img/newsCardERROR.jpg'
												}}
											/>
										</div>
									</div>
									<div className={styles.SeparatorWrapper}>
										<div className={styles.Separator}></div>
									</div>
								</div>
							))}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export default AllArtistsPage
