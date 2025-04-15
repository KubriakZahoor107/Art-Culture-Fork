import LoadingError from '@components/Blocks/LoadingError'
import AllArtistsPageSearchSlider from '@components/Sliders/AllArtistsPageLettersSortSlider/AllArtistsPageSearchSlider'
import styles from '@styles/layout/AllArtistsPage.module.scss'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { englishLetters, ukrainianLetters } from '../../../utils/constants'
import ModalWindow from '../../components/Blocks/ModalWindow'
import TranslatedContent from '../../components/Blocks/TranslatedContent'

function ExhibitsProductPage({ baseUrl }) {
	const { t, i18n } = useTranslation()
	const { id: museumId } = useParams()
	// Existing states
	const [products, setProducts] = useState({})

	const [loading, setLoading] = useState(true)
	const [error, setError] = useState(null)
	const [language, setLanguage] = useState(i18n.language)
	const [preloading, setPreloading] = useState(false)

	// Tracks which letter user selected in the slider
	const [selectedLetter, setSelectedLetter] = useState('')
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [selectedProduct, setSelectedProduct] = useState(null)
	const [selectedMuseum, setSelectedMuseum] = useState(null)
	const [selectedProductImages, setSelectedProductImages] = useState([])
	const [zoomStates, setZoomStates] = useState([])
	const [currentSlide, setCurrentSlide] = useState(0)

	// Which "sort mode" (button) is active? "ALL" | "UK" | "EN"
	const [sortMode, setSortMode] = useState('ALL')

	useEffect(() => {
		const handleLanguageChange = () => setLanguage(i18n.language)
		i18n.on('languageChanged', handleLanguageChange)

		return () => {
			i18n.off('languageChanged', handleLanguageChange)
		}
	}, [i18n, museumId])

	function groupByLetter(productsArray) {
		const isUk = i18n.language === 'uk'

		const grouped = productsArray.reduce((acc, item) => {
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
		const fetchExhibitsProduct = async () => {
			try {
				setLoading(true)
				setError(null)

				const response = await axios.get(
					`/api/products/museum/${museumId}`,
				)
				console.log('Fetch exhibits', response.data)
				const productsArray = response.data.products || []
				console.log('Fetch exhibits', response.data.products)
				const grouped = groupByLetter(productsArray)
				setProducts(grouped)
			} catch (err) {
				console.error('Не вдалось завантажити', err)
				setError('Error fetching exhibits')
			} finally {
				setLoading(false)
			}
		}
		fetchExhibitsProduct()
	}, [sortMode, i18n.language])

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

	const preloadImages = useCallback(
		async (images) => {
			const promises = images.map(
				(img) =>
					new Promise((resolve) => {
						const image = new Image()
						image.src = `${baseUrl}${img.imageUrl}`
						image.onload = resolve
						image.onerror = resolve
					}),
			)
			await Promise.all(promises)
		},
		[baseUrl],
	)

	// Handler to open the GalleryModal with preloaded images
	const handleOverviewClick = async (product) => {
		if (product.images && product.images.length > 0) {
			setPreloading(true)
			await preloadImages(product.images)
			setPreloading(false)
			setSelectedProductImages(product.images)
			setSelectedProduct(product)
			setSelectedMuseum(product.author || {}) // Adjust based on actual data structure
			setZoomStates(
				product.images.map(() => ({
					zoomLevel: 1,
					isZoomed: false,
					cursorPos: { x: 0, y: 0 },
					showLens: false,
				})),
			)
			setCurrentSlide(0)
			setIsModalOpen(true)
		} else {
			// If no images, optionally handle this case
			setSelectedProductImages([])
			setSelectedProduct(null)
			setSelectedMuseum(null)
			setZoomStates([])
			setIsModalOpen(false)
		}
	}
	// Handler to close the GalleryModal
	const handleCloseModal = () => {
		setIsModalOpen(false)
		setSelectedProductImages([])
		setSelectedProduct(null)
		setSelectedMuseum(null)
		setZoomStates([])
		setCurrentSlide(0)
	}
	return (
		<div className={styles.ArtistsPageContainer}>
			<div className={styles.ArtistsPageTitleWrapper}>
				<h1>{t('Усі експонати цього музею')}</h1>
			</div>
			<div className={styles.ArtistsPageSeparatorWrapper}>
				<div className={styles.ArtistsPageSeparator}></div>
			</div>
			<div className={styles.ArtistsPageArtistsSearchWrapper}>
				<input
					className={styles.ArtistsPageArtistsSearchInput}
					placeholder={t('Пошук експонатів')}
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
					const filteredLetters = Object.keys(products).filter(
						(letter) =>
							!selectedLetter || letter === selectedLetter,
					)
					if (!loading && filteredLetters.length === 0) {
						return (
							<LoadingError message={t('Відсутні експонати')} />
						)
					}
					return filteredLetters.map((letter) => (
						<div key={letter} className={styles.ArtistsWrapper}>
							<div className={styles.LetterWrapper}>
								<h2 className={styles.Letter}>{letter}</h2>
							</div>
							<div className={styles.ArtistsByLetterWrapper}>
								{products[letter].map((product) => (
									<div
										key={product.id}
										className={styles.ArtistWrapper}
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
														en={product.title_en}
														uk={product.title_uk}
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
													onClick={() =>
														handleOverviewClick(
															product,
														)
													}
													src={
														product.images?.[0]
															?.imageUrl
															? product.images[0]
																	.imageUrl
															: '/Img/ArtistPhoto.jpg'
													}
													alt={
														<TranslatedContent
															en={
																product.title_en
															}
															uk={
																product.title_uk
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
			<ModalWindow
				isOpen={isModalOpen}
				onClose={handleCloseModal}
				selectedProduct={selectedProduct}
				selectedCreator={selectedMuseum}
				selectedProductImages={selectedProductImages}
				zoomStates={zoomStates}
				setZoomStates={setZoomStates}
				currentSlide={currentSlide}
				setCurrentSlide={setCurrentSlide}
				baseUrl={baseUrl}
				preloading={preloading}
			/>
		</div>
	)
}

export default ExhibitsProductPage
