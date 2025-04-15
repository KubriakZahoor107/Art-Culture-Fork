import LoadingError from '@components/Blocks/LoadingError'
import AllArtistsPageSearchSlider from '@components/Sliders/AllArtistsPageLettersSortSlider/AllArtistsPageSearchSlider'
import styles from '@styles/layout/AllArtistsPage.module.scss'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { englishLetters, ukrainianLetters } from '../../../utils/constants'
import TranslatedContent from '../../components/Blocks/TranslatedContent'

function AllExhibitionsPage() {
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()

	// Existing states
	const [exhibitions, setExhibitions] = useState({})
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

	function groupByLetter(exhibitionsArray) {
		const isUk = i18n.language === 'uk'

		const grouped = exhibitionsArray.reduce((acc, item) => {
			const letterSource = isUk ? item.title_uk : item.title_en
			const letter = letterSource?.charAt(0).toUpperCase() || ''

			if (!acc[letter]) {
				acc[letter] = []
			}
			acc[letter].push(item)
			return acc
		}, {})

		let letterInUse = Object.keys(grouped)

		if (sortMode === 'UK') {
			letterInUse = ukrainianLetters.filter((l) =>
				letterInUse.includes(l),
			)
		} else if (sortMode === 'EN') {
			letterInUse = englishLetters.filter((l) => letterInUse.includes(l))
		} else {
			const merged = [...ukrainianLetters, ...englishLetters]
			letterInUse = merged.filter((l) => letterInUse.includes(l))
		}

		const filteredGrouped = {}
		letterInUse.forEach((letter) => {
			filteredGrouped[letter] = grouped[letter] || []
		})
		return filteredGrouped
	}

	useEffect(() => {
		const fetchExhibitions = async () => {
			try {
				setLoading(true)
				setError(null)

				const response = await axios.get(`/api/exhibitions`)
				console.log('Fetch exhibitions', response.data)
				const exhibitionsArray = response.data.exhibitions || []
				console.log('Fetch exhibitions', response.data.exhibitions)
				const grouped = groupByLetter(exhibitionsArray)
				setExhibitions(grouped)
			} catch (err) {
				console.error('Не вдалось завантажити', err)
				setError('Error fetching exhibitions')
			} finally {
				setLoading(false)
			}
		}
		fetchExhibitions()
	}, [sortMode, selectedLetter, t, i18n.language])

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
		navigate(`/exhibitions/${id}`)
	}

	return (
		<div className={styles.ArtistsPageContainer}>
			<div className={styles.ArtistsPageTitleWrapper}>
				<h1>{t('Усі виставки')}</h1>
			</div>
			<div className={styles.ArtistsPageSeparatorWrapper}>
				<div className={styles.ArtistsPageSeparator}></div>
			</div>
			<div className={styles.ArtistsPageArtistsSearchWrapper}>
				<input
					className={styles.ArtistsPageArtistsSearchInput}
					placeholder={t('Пошук виставки')}
				/>
			</div>

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
				{(() => {
					const filteredLetters = Object.keys(exhibitions).filter(
						(letter) =>
							!selectedLetter || letter === selectedLetter,
					)
					if (!loading && filteredLetters.length === 0) {
						return <LoadingError message={t('Відсутні виставки')} />
					}
					return filteredLetters.map((letter) => (
						<div key={letter} className={styles.ArtistsWrapper}>
							<div className={styles.LetterWrapper}>
								<h2 className={styles.Letter}>{letter}</h2>
							</div>
							<div className={styles.ArtistsByLetterWrapper}>
								{exhibitions[letter].map((exhibition) => (
									<div
										key={exhibition.id}
										className={styles.ArtistWrapper}
										onClick={() =>
											handleAuthorPreviewClick(
												exhibition.id,
											)
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
												<p
													className={
														styles.ArtistTitle
													}
												>
													<TranslatedContent
														en={exhibition.title_en}
														uk={exhibition.title_uk}
														html
													/>
												</p>
											</div>
											<div
												className={
													styles.ArtistPhotoWrapper
												}
											>
												<img
													className={
														styles.ArtistPhoto
													}
													src={
														exhibition.images?.[0]
															?.imageUrl
															? exhibition
																	.images[0]
																	.imageUrl
															: '/Img/ArtistPhoto.jpg'
													}
													alt={
														<TranslatedContent
															en={
																exhibition.title_en
															}
															uk={
																exhibition.title_uk
															}
															html
														/>
													}
													onError={(e) => {
														e.target.onerror = null
														e.target.src =
															'/Img/newsCardERROR.jpg'
													}}
												/>
											</div>
										</div>
										<div
											className={styles.SeparatorWrapper}
										>
											<div
												className={styles.Separator}
											></div>
										</div>
									</div>
								))}
							</div>
						</div>
					))
				})()}
			</div>
		</div>
	)
}

export default AllExhibitionsPage
