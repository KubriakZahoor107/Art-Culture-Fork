import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from '@styles/components/ExhibitionCard/ExhibitionCardCreate.module.scss';
import API from '../../../utils/api';

function SearchPainting({ paintings, onChange }) {
	const { t } = useTranslation()
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const [selectedAuthors, setSelectedAuthors] = useState([])
	const [selectedAuthorPaintings, setSelectedAuthorPaintings] = useState({})

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalData, setModalData] = useState({
		authorId: null,
		paintings: [],
		selectedPaintings: paintings ?? [],
	})

	const defaultAuthorImageUrl = '/Img/ArtistPhoto.jpg'
	const defaultPaintingImageUrl = '/Img/ArtistPhoto.jpg'

	const getImageUrl = (path) => {
		const normalizedPath = path.startsWith('/') ? path : `/${path}`
		return normalizedPath
	}

	useEffect(() => {
		if (onChange) {
			const paintings = Object.values(selectedAuthorPaintings).flat();
			onChange(paintings)
		}
	}, [onChange, selectedAuthorPaintings])

	const handleSearchChange = async (e) => {
		const query = e.target.value
		setSearchQuery(query)

		if (query.length > 2) {
			const [authorsResponse, paintingsResponse] = await Promise.all([
				API.get(`/search/authors?q=${query}`),
				API.get(`/search/paintings?q=${query}`),
			])

			const authors = authorsResponse.data.authors

			const authorsToProcess = authors.slice(0, 5)

			const authorsWithPaintingsInfo = await Promise.all(
				authorsToProcess.map(async (author) => {
					try {
						const paintingsRes = await API.get(
							`/products/author/${author.id}`,
						)
						const hasPaintings =
							paintingsRes.data.products.length > 0
						return {
							...author,
							type: 'author',
							hasPaintings,
						}
					} catch (error) {
						console.error(
							`Error fetching paintings for author ${author.id}:`,
							error,
						)
						return {
							...author,
							type: 'author',
							hasPaintings: false,
						}
					}
				}),
			)
			// Combine with paintings results
			const updatedPaintingsResults =
				paintingsResponse.data.paintings.map((painting) => ({
					...painting,
					type: 'painting',
				}))

			setSearchResults([
				...authorsWithPaintingsInfo,
				...updatedPaintingsResults,
			])
		} else {
			setSearchResults([])
		}
	}

	const handleSelectedResult = (result) => {
		if (result.type === 'author') {
			const authorId = Number(result.id)
			if (
				!selectedAuthors.find(
					(author) => Number(author.id) === authorId,
				)
			) {
				setSelectedAuthors([...selectedAuthors, result])
			}
		} else if (result.type === 'painting') {
			const paintingId = Number(result.id)
			const authorId = Number(result.author.id)
			if (
				!selectedAuthors.find(
					(author) => Number(author.id) === authorId,
				)
			) {
				setSelectedAuthors((prevAuthors) => [
					...prevAuthors,
					result.author,
				])
			}
			setSelectedAuthorPaintings((prevState) => {
				const prevPaintings = prevState[authorId] || []
				if (!prevPaintings.find((p) => Number(p.id) === paintingId)) {
					return {
						...prevState,
						[authorId]: [...prevPaintings, result],
					}
				}
				return prevState
			})
		}
		setSearchQuery('')
		setSearchResults([])
	}

	const handleSelectAuthorPaintings = async (authorId) => {
		try {
			// Fetch paintings by the author
			const response = await API.get(`/products/author/${authorId}`)
			const paintings = response.data.products

			setModalData({
				authorId,
				paintings,
				selectedPaintings: selectedAuthorPaintings[authorId] || [],
			})
			setIsModalOpen(true)
		} catch (error) {
			console.error('Error fetching author paintings:', error)
		}
	}

	const handleTogglePaintingSelection = (painting) => {
		setModalData((prevData) => {
			const isSelected = prevData.selectedPaintings.find(
				(p) => p.id === painting.id,
			)
			if (isSelected) {
				return {
					...prevData,
					selectedPaintings: prevData.selectedPaintings.filter(
						(p) => p.id !== painting.id,
					),
				}
			} else {
				return {
					...prevData,
					selectedPaintings: [
						...prevData.selectedPaintings,
						painting,
					],
				}
			}
		})
	}

	const handleSaveSelectedPaintings = () => {
		setSelectedAuthorPaintings((prevState) => {
			const prevPaintings = prevState[modalData.authorId] || []
			const modalPaintings = modalData.selectedPaintings
			const allPaintings = [...prevPaintings, ...modalPaintings]
			const uniquePaintings = allPaintings.filter(
				(painting, index, self) =>
					index === self.findIndex((p) => p.id === painting.id),
			)
			return {
				...prevState,
				[modalData.authorId]: uniquePaintings,
			}
		})
		setIsModalOpen(false)
	}

	const handleRemoveAuthor = (authorId) => {
		setSelectedAuthors((prevAuthors) =>
			prevAuthors.filter((author) => author.id !== authorId),
		)
		setSelectedAuthorPaintings((prevState) => {
			const newState = { ...prevState }
			delete newState[authorId]
			return newState
		})
	}

	const handleRemovePainting = (authorId, paintingId) => {
		setSelectedAuthorPaintings((prevState) => {
			const updatePaintings = prevState[authorId].filter(
				(p) => p.id !== paintingId,
			)
			if (updatePaintings.length > 0) {
				return {
					...prevState,
					[authorId]: updatePaintings,
				}
			} else {
				const newState = { ...prevState }
				delete newState[authorId]
				setSelectedAuthors((prevAuthors) =>
					prevAuthors.filter((author) => author.id !== authorId),
				)
				return newState
			}
		})
	}

	return (
		<>
			{/* Search input */}
			<div className="field-group">
				<label className="field-label">{t('Пошук')}</label>
				<input
					type="text"
					name="search"
					value={searchQuery}
					onChange={handleSearchChange}
					placeholder={t("Введіть ім'я митця або картини")}
					className={styles.formInput}
				/>
				{searchResults.length > 0 && (
					<div className={styles.searchResults}>
						{searchResults.map((result) => {
							//const isDisabled = result.type === 'author' && !result.paintings;
							const isDisabled = false
							return (
								<div
									key={`${result.type}-${result.id}`}
									className={`${styles.searchResultItem} ${isDisabled ? styles.disabled : ''}`}
									onClick={() => {
										if (result.type === 'author') {
											if (!result.paintings) {
												handleSelectedResult(result)
											}
										} else {
											handleSelectedResult(result)
										}
									}}
								>
									{result.type === 'author' ? (
										<>
											<div
												className={
													styles.resultAuthorWrapper
												}
											>
												{result.images ? (
													<img
														src={getImageUrl(
															result.images,
														)}
														alt={
															result.title ||
															result.email
														}
														className={
															styles.resultAuthorImage
														}
													/>
												) : (
													<img
														src={
															defaultAuthorImageUrl
														}
														alt="Default author"
														className={
															styles.resultImage
														}
													/>
												)}
												<p>
													{result.title ||
														result.email}
												</p>
												{!result.hasPaintings && (
													<p
														className={
															styles.noPaintingsMessage
														}
													>
														{t(
															'Цей автор не має картин',
														)}
													</p>
												)}
											</div>
										</>
									) : (
										<>
											<div
												className={
													styles.resultPaintingsWrapper
												}
											>
												{result.images &&
												result.images.length > 0 ? (
													<img
														src={getImageUrl(
															result.images[0]
																.imageUrl,
														)}
														alt={
															result.title_en ||
															result.title_uk
														}
														className={
															styles.resultPaintingsImage
														}
													/>
												) : (
													<img
														src={
															defaultPaintingImageUrl
														}
														alt="Default painting"
														className={
															styles.resultImage
														}
													/>
												)}
												<p>
													{result.title_en ||
														result.title_uk}
												</p>
											</div>
										</>
									)}
								</div>
							)
						})}
					</div>
				)}
			</div>
			{/* Selected items search */}
			<div className={styles.selectedObjectWrapper}>
				{selectedAuthors.map((author) => (
					<div
						key={`author-${author.id}`}
						className={styles.chipContainer}
					>
						{author.images ? (
							<img
								src={getImageUrl(author.images)}
								alt={author.title || author.email}
								className={styles.chipImage}
							/>
						) : (
							<img
								src={defaultAuthorImageUrl}
								alt="Default author"
								className={styles.chipImage}
							/>
						)}
						<p>{author.title || author.email}</p>
						<button type="button"
							onClick={() =>
								handleSelectAuthorPaintings(author.id)
							}
						>
							{t('Обрати картини')}
						</button>
						<button type="button"
							onClick={() => handleRemoveAuthor(author.id)}
						>
							×
						</button>
						{/* Render selected paintings for this author */}
						{selectedAuthorPaintings[author.id] && (
							<div className={styles.authorPaintings}>
								{selectedAuthorPaintings[author.id].map(
									(painting) => (
										<div
											key={`painting-${painting.id}`}
											className={styles.chip}
										>
											{painting.images &&
											painting.images.length > 0 ? (
												<img
													src={getImageUrl(
														painting.images[0]
															.imageUrl,
													)}
													alt={
														painting.title_en ||
														painting.title_uk
													}
													className={
														styles.chipImage
													}
												/>
											) : (
												<img
													src={
														defaultPaintingImageUrl
													}
													alt="Default painting"
													className={
														styles.chipImage
													}
												/>
											)}
											<span>
												{painting.title_en ||
													painting.title_uk}
											</span>
											<button type="button"
												onClick={() =>
													handleRemovePainting(
														author.id,
														painting.id,
													)
												}
											>
												×
											</button>
										</div>
									),
								)}
							</div>
						)}
					</div>
				))}
			</div>

			{isModalOpen && (
				<div
					className="modal-overlay"
					onClick={() => setIsModalOpen(false)}
				>
					<div
						className="modal-content"
						onClick={(e) => e.stopPropagation()}
					>
						<button
							className="modal-close-button"
							onClick={() => setIsModalOpen(false)}
						>
							&times;
						</button>
						<h2>{t('Обрати картини митця')}</h2>
						<div className={styles.paintingsList}>
							{modalData.paintings.map((painting) => (
								<div
									key={painting.id}
									className={styles.paintingItem}
								>
									{painting.images &&
									painting.images.length > 0 ? (
										<img
											src={getImageUrl(
												painting.images[0].imageUrl,
											)}
											alt={
												painting.title_en ||
												painting.title_uk
											}
											className={styles.paintingImage}
										/>
									) : (
										<img
											src={defaultPaintingImageUrl}
											alt="Default painting"
											className={styles.paintingImage}
										/>
									)}
									<span>
										{painting.title_en || painting.title_uk}
									</span>
									<input
										type="checkbox"
										checked={
											!!modalData.selectedPaintings.find(
												(p) => p.id === painting.id,
											)
										}
										onChange={() =>
											handleTogglePaintingSelection(
												painting,
											)
										}
									/>
								</div>
							))}
						</div>
						<button type="button" onClick={handleSaveSelectedPaintings}>
							{t('Зберегти')}
						</button>
					</div>
				</div>
			)}
		</>
	)
}

SearchPainting.propTypes = {
	paintings: PropTypes.any,
	onChange: PropTypes.func,
};

export default SearchPainting
