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
	const [museums, setMuseums] = useState({})
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
	const groupByLetter = (museumsArray) => {
		const grouped = museumsArray.reduce((acc, museum) => {
			const letter = museum.title?.charAt(0).toUpperCase() || ''
			if (!acc[letter]) {
				acc[letter] = []
			}
			acc[letter].push(museum)
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
		const fetchMuseums = async () => {
			try {
				setLoading(true)
				setError(null)

				// Decide the endpoint based on active button
				let url = '/api/users/museums' // Default => all
				if (sortMode === 'UK') {
					url = selectedLetter
						? `/api/users/museums/language/uk?letter=${selectedLetter}`
						: `/api/users/museums/language/uk`
				} else if (sortMode === 'EN') {
					url = selectedLetter
						? `/api/users/museums/language/en?letter=${selectedLetter}`
						: `/api/users/museums/language/en`
				}

				console.log('Requesting URL:', url)
				const response = await axios.get(url)
				const fetchedMuseums = response.data.museums || []

				// Group them by letter => so "Усі" also remains letter-based
				const grouped = groupByLetter(fetchedMuseums)
				setMuseums(grouped)

				setLoading(false)
			} catch (err) {
				setLoading(false)
				console.error('Error fetching museum:', err)
				setError(err.response?.data?.error || 'An error occurred')
			}
		}

		fetchMuseums()
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

	const handleMuseumPreviewClick = (id) => {
		navigate(`/museum-page/${id}`)
	}

	return (
		<div className={styles.ArtistsPageContainer}>
			<div className={styles.ArtistsPageTitleWrapper}>
				<h1>{t('Усі музеї')}</h1>
			</div>
			<div className={styles.ArtistsPageSeparatorWrapper}>
				<div className={styles.ArtistsPageSeparator}></div>
			</div>

			<Search
				className={searchStyle.ArtistsPageArtistsSearchWrapper}
				searchInput={searchStyle.ArtistsPageArtistsSearchInput}
				placeholderName={t('Пошук музея')}
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
				{!loading && Object.keys(museums).length === 0 && (
					<LoadingError
						message={t('Відсутні автори за ціею літерою')}
					/>
				)}
				{Object.keys(museums).map((letter) => (
					<div key={letter} className={styles.ArtistsWrapper}>
						<div className={styles.LetterWrapper}>
							<h2 className={styles.Letter}>{letter}</h2>
						</div>
						<div className={styles.ArtistsByLetterWrapper}>
							{museums[letter].map((museum) => (
								<div
									key={museum.id}
									className={styles.ArtistWrapper}
									onClick={() =>
										handleMuseumPreviewClick(museum.id)
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
												{museum.title}
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
													museum.images ||
													'/Img/ArtistPhoto.jpg'
												}
												alt={museum.title}
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
