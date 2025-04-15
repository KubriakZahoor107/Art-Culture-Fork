import AddressSearch from '@components/Blocks/AddressSearchInput'
import ImageEditor from '@components/Blocks/ImageEditor'
import ProfilePageContainer from '@components/Blocks/ProfilePageContainer'
import TextAreaEditor from '@components/Blocks/TextAreaEditor'
import TextEditor from '@components/Blocks/TextEditor'
import styles from '@styles/components/ExhibitionCard/ExhibitionCardCreate.module.scss'
import axios from 'axios'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { IconContext } from 'react-icons/lib'
import { TiDelete } from 'react-icons/ti'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext'
import API from '../../../utils/api'
import { getImageUrl } from '../../../utils/helper.js'

function ExhibitionForm() {
	const [formData, setFormData] = useState({
		title_en: '',
		title_uk: '',
		description_en: '',
		description_uk: '',
		startDate: '',
		endDate: '',
		time: '',
		endTime: '',
		location_en: '',
		location_uk: '',
		latitude: '',
		longitude: '',
		address: '',
		artists: [],
		museumId: null,
		images: [],
	})
	const [artists, setArtists] = useState([]) // All available artists
	const [errors, setErrors] = useState([])
	const [serverMessage, setServerMessage] = useState('')
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const [searchResults, setSearchResults] = useState([])
	const [selectedAuthors, setSelectedAuthors] = useState([])
	const [selectedAuthorPaintings, setSelectedAuthorPaintings] = useState({})
	const [museums, setMuseums] = useState([])
	const [selectedMuseum, setSelectedMuseum] = useState(null)
	const [museumSearchResult, setMuseumSearchResult] = useState([])
	const [museumSearchQuery, setMuseumSearchQuery] = useState('')
	const [loading, setLoading] = useState(false)
	const [openDropdownAuthorId, setOpenDropdownAuthorId] = useState(null)

	const navigate = useNavigate()
	const { t } = useTranslation()
	const { user } = useAuth()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [modalData, setModalData] = useState({
		authorId: null,
		paintings: [],
		selectedPaintings: [],
	})

	console.log('CurrentUser:', user)

	useEffect(() => {
		// Fetch artists to populate the checkboxes
		const fetchArtistsAndMuseums = async () => {
			try {
				setLoading(true)
				const response = await axios.get('/api/users/creators', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				})
				console.log('Artists data:', response.data.creators)
				setArtists(response.data.creators)
				const museumsResponse = await axios.get('/api/users/museums', {
					headers: {
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				})
				console.log('Mus data', museumsResponse.data.museums)
				setMuseums(museumsResponse.data.museums)
			} catch (error) {
				console.error('Error fetching artists:', error)
				setErrors((prevErrors) => [
					...prevErrors,
					'Failed to load artists.',
				])
				setLoading(false)
			}
		}

		fetchArtistsAndMuseums()
	}, [setArtists, setMuseums])

	// JS approach to detect scrollbar width and add a margin-right on body.

	const handleMuseumSearchChange = async (e) => {
		const query = e.target.value
		setMuseumSearchQuery(query)

		if (query.length > 2) {
			try {
				const museumsResponse = await API.get(
					`/search/museums?q=${query}`,
				)
				setMuseumSearchResult(museumsResponse.data.museums)
			} catch (error) {
				console.error('Error fetching museums:', error)
			}
		} else {
			setMuseumSearchResult([])
		}
	}

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

	const handleArtistSelection = useCallback((e) => {
		const artistId = parseInt(e.target.value, 10)
		if (e.target.checked) {
			setFormData((prevState) => ({
				...prevState,
				artists: [...prevState.artists, artistId],
			}))
		} else {
			setFormData((prevState) => ({
				...prevState,
				artists: prevState.artists.filter((id) => id !== artistId),
			}))
		}
	}, [])

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

	const handleSubmit = async (e) => {
		e.preventDefault()
		setErrors([])
		setServerMessage('')
		setIsSubmitting(true)

		// Prepare artistIds and paintingIds
		const artistIds = selectedAuthors.map((author) => Number(author.id))
		const paintingIds = Object.values(selectedAuthorPaintings)
			.flat()
			.map((p) => Number(p.id))

		const uniqueArtistIds = [...new Set(artistIds)]
		const uniquePaintingIds = [...new Set(paintingIds)]

		// Update form validation
		if (uniqueArtistIds.length === 0) {
			setErrors(['Please select at least one artist.'])
			setIsSubmitting(false)
			return
		}

		if (!selectedMuseum) {
			setErrors(['Please select a museum.'])
			setIsSubmitting(false)
			return
		}

		// Destructure formData for easier access
		const {
			title_en,
			title_uk,
			description_en,
			description_uk,
			startDate,
			endDate,
			time,
			endTime,
			//location_uk,
			//location_en,
			longitude,
			latitude,
			address,
			images,
		} = formData

		// Form validation
		if (
			!title_en ||
			!title_uk ||
			!description_en ||
			!description_uk ||
			!startDate ||
			!endDate ||
			!time ||
			!endTime ||
			//!location_en ||
			//!location_uk
			!longitude ||
			!latitude ||
			!address
		) {
			setErrors(['All fields are required.'])
			setIsSubmitting(false)
			return
		}

		// Prepare form data
		const submissionData = new FormData()

		// Append multilingual title
		submissionData.append('title_en', title_en)
		submissionData.append('title_uk', title_uk)

		// Append multilingual description
		submissionData.append('description_en', description_en)
		submissionData.append('description_uk', description_uk)

		// Append multilingual location
		//submissionData.append('location_en', location_en)
		//submissionData.append('location_uk', location_uk)

		// Append dates and time
		submissionData.append('startDate', startDate)
		submissionData.append('endDate', endDate)
		submissionData.append('time', time)
		submissionData.append('endTime', endTime)
		// Append lat, lon, address for search
		submissionData.append('latitude', formData.latitude)
		submissionData.append('longitude', formData.longitude)
		submissionData.append('address', formData.address)
		submissionData.append('museumId', selectedMuseum.id)

		// Append images
		Array.from(images).forEach((image) => {
			submissionData.append('exhibitionImages', image)
		})

		// Use uniqueArtistIds and uniquePaintingIds in the submission
		uniqueArtistIds.forEach((artistId) => {
			submissionData.append('artistIds', artistId)
		})

		uniquePaintingIds.forEach((paintingId) => {
			submissionData.append('paintingIds', paintingId)
		})

		// Debug: Log FormData entries
		for (let pair of submissionData.entries()) {
			console.log(`${pair[0]}: ${pair[1]}`)
		}

		try {
			const response = await API.post('/exhibitions', submissionData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})
			console.log('Exhibition created:', response.data)
			setServerMessage('Exhibition created successfully!')
			// Redirect to the exhibition details page
			navigate(`/Exhibitions/${response.data.exhibition.id}`)
		} catch (error) {
			console.error('Error creating exhibition:', error.response)
			if (
				error.response &&
				error.response.data &&
				error.response.data.errors
			) {
				setErrors(error.response.data.errors.map((err) => err.msg))
			} else if (
				error.response &&
				error.response.data &&
				error.response.data.message
			) {
				setErrors([error.response.data.message])
			} else {
				setErrors(['An error occurred while creating the exhibition.'])
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	const textEditorOnChange = ({ name, value }) => {
		const newFormData = { ...formData, [name]: value }
		setFormData(newFormData)
	}

	const handleAddressSelect = ({ lat, lon, address }) => {
		setFormData((prevState) => ({
			...prevState,
			latitude: lat,
			longitude: lon,
			address: address,
		}))
	}
	const defaultMuseumImageUrl = '/Img/museumPhoto_2.jpg'
	const defaultAuthorImageUrl = '/Img/ArtistPhoto.jpg'
	const defaultPaintingImageUrl = '/Img/ArtistPhoto.jpg'
	const toggleDropdown = (authorId) => {
		setOpenDropdownAuthorId((prev) => (prev === authorId ? null : authorId))
	}

	return (
		<ProfilePageContainer>
			<h2>{t('Створити виставку')}</h2>
			{errors.length > 0 && (
				<div className={styles.errorMessages}>
					<ul className={styles.errorList}>
						{errors.map((err, index) => (
							<li key={index} className={styles.errorItem}>
								{err}
							</li>
						))}
					</ul>
				</div>
			)}
			{serverMessage && (
				<div className={styles.successMessage}>{serverMessage}</div>
			)}
			<form
				onSubmit={handleSubmit}
				encType="multipart/form-data"
				className="form-wrapper"
			>
				<div className="flex gap-8 form-wrapper">
					<div className="form-group">
						{/* Title in Ukrainian */}
						<div className="field-group">
							<TextEditor
								label={t('Назва виставки українською')}
								name="title_uk"
								value={formData.title_uk}
								maxLength={50}
								required
								onChange={textEditorOnChange}
							/>
						</div>

						{/* Description in Ukrainian */}
						<div className="field-group">
							<TextAreaEditor
								label={t('Опис виставки українською')}
								name="description_uk"
								value={formData.description_uk}
								maxLength={500}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>

						{/* Start Date */}
						<div className="field-group">
							<TextEditor
								label={t('Дата початку')}
								type="date"
								name="startDate"
								value={formData.startDate}
								required
								onChange={textEditorOnChange}
							/>
						</div>

						{/* Start time */}
						<div className="field-group">
							<TextEditor
								label={t('Час початку')}
								type="text"
								name="time"
								value={formData.time}
								required
								onChange={textEditorOnChange}
							/>
						</div>
					</div>

					<div className="form-group">
						{/* Title in English */}
						<div className="field-group">
							<TextEditor
								label={t('Назва виставки англійською')}
								name="title_en"
								value={formData.title_en}
								maxLength={50}
								required
								onChange={textEditorOnChange}
							/>
						</div>

						{/* Description in English */}
						<div className="field-group">
							<TextAreaEditor
								label={t('Опис виставки англійською')}
								name="description_en"
								value={formData.description_en}
								maxLength={500}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>

						{/* End Date */}
						<div className="field-group">
							<TextEditor
								label={t('Дата завершення')}
								type="date"
								name="endDate"
								value={formData.endDate}
								required
								onChange={textEditorOnChange}
							/>
						</div>

						{/* End time */}
						<div className="field-group">
							<TextEditor
								label={t('Час завершення')}
								type="text"
								name="endTime"
								value={formData.endTime}
								required
								onChange={textEditorOnChange}
							/>
						</div>
					</div>
				</div>

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
														<>
															{console.log(
																'Author or painting result:',
																result,
																'result.images is:',
																result.images,
															)}
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
														</>
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
														<>
															{console.log(
																'Author or painting result:',
																result,
																'result.images is:',
																result.images,
															)}
															<img
																src={getImageUrl(
																	result
																		.images[0]
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
														</>
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
								console.log(
									'Author or painting result:',
									result,
								)
								console.log('result.images is:', result.images)
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
							<>
								{author.images ? (
									<>
										{console.log(
											'Author or painting result:',
											author.images,
										)}
										<img
											src={getImageUrl(author.images)}
											alt={author.title || author.email}
											className={styles.chipImage}
										/>
									</>
								) : (
									<img
										src={defaultAuthorImageUrl}
										alt="Default author"
										className={styles.chipImage}
									/>
								)}
								<div className={styles.chipContent}>
									{/* <p>{author.title || author.email}</p> */}
									<button
										onClick={() =>
											handleSelectAuthorPaintings(
												author.id,
											)
										}
										type="button"
									>
										{t('Обрати картини')}
									</button>
									<button
										onClick={() =>
											handleRemoveAuthor(author.id)
										}
									>
										<IconContext.Provider
											value={{
												fill: 'red',
												size: '2rem',
												style: { padding: '4px' },
												color: 'red',
												cursor: 'pointer',
											}}
										>
											<TiDelete />
										</IconContext.Provider>
									</button>
								</div>
							</>
							{/* Render selected paintings for this author */}

							{selectedAuthorPaintings[author.id] &&
								selectedAuthorPaintings[author.id].length >
									0 && (
									<div
										className={
											styles.authorPaintingsDropdown
										}
									>
										<button
											onClick={() =>
												toggleDropdown(author.id)
											}
											className={styles.dropdownToggle}
											type="button"
										>
											{t('Обрані картини')}
											{/* You can use any icon for the arrow */}
											{openDropdownAuthorId === author.id
												? '▲'
												: '▼'}
										</button>
										{openDropdownAuthorId === author.id && (
											<div
												className={
													styles.dropdownContent
												}
											>
												{selectedAuthorPaintings[
													author.id
												].map((painting) => (
													<div
														key={`painting-${painting.id}`}
														className={styles.chip}
													>
														{painting.images &&
														painting.images.length >
															0 ? (
															<img
																src={getImageUrl(
																	painting
																		.images[0]
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
														<button
															onClick={() =>
																handleRemovePainting(
																	author.id,
																	painting.id,
																)
															}
															className={
																styles.chipRemoveButton
															}
														>
															<IconContext.Provider
																value={{
																	fill: 'red',
																	size: '2rem',
																	style: {
																		padding:
																			'4px',
																	},
																	cursor: 'pointer',
																	color: 'red',
																}}
															>
																<TiDelete />
															</IconContext.Provider>
														</button>
													</div>
												))}
											</div>
										)}
									</div>
								)}
						</div>
					))}
				</div>

				<div className="field-group">
					<label className="field-label">{t('Пошук музею')}</label>
					<input
						type="text"
						name="museumSearch"
						value={museumSearchQuery}
						onChange={handleMuseumSearchChange}
						placeholder={t('Введіть назву музею')}
						className={styles.formInput}
					/>
					{museumSearchResult.length > 0 && (
						<div className={styles.searchResults}>
							{museumSearchResult.map((museum) => (
								<div
									key={`museum-${museum.id}`}
									className={styles.searchResultItem}
									onClick={() => {
										setSelectedMuseum(museum)
										setMuseumSearchQuery('')
										setMuseumSearchResult([])
									}}
								>
									<p>{museum.title || museum.email}</p>
								</div>
							))}
						</div>
					)}
					{selectedMuseum && (
						<div className={styles.selectedChip}>
							<img
								src={
									getImageUrl(selectedMuseum.images) ||
									defaultMuseumImageUrl
								} // a helper similar to getImageUrl (or adjust as needed)
								alt={
									selectedMuseum.title || selectedMuseum.email
								}
								className={styles.chipImage}
							/>
							<p>
								{selectedMuseum.title || selectedMuseum.email}
							</p>
							<button onClick={() => setSelectedMuseum(null)}>
								Видалити
							</button>
						</div>
					)}
				</div>

				{/* Address Search block */}
				<div className="field-group">
					<label className="field-label">{t('Пошук адреси')}</label>
					<AddressSearch onSelect={handleAddressSelect} />
					{formData.address && (
						<p>
							{t('Обрана адреса')}: {formData.address} (Lat:{' '}
							{formData.latitude}, Lng: {formData.longitude})
						</p>
					)}
				</div>

				{/* Images */}
				<div className="field-group">
					<ImageEditor
						label={t('Додати зображення')}
						required
						name="images"
						value={formData.images}
						multiple
						onChange={textEditorOnChange}
					/>
				</div>

				{/* Submit Button */}
				<button
					type="submit"
					className={styles.submitButton}
					disabled={isSubmitting}
				>
					{isSubmitting
						? t('Створюється...')
						: t('Створити виставку')}
				</button>
			</form>

			{isModalOpen && (
				<div
					className="modal-overlay"
					onClick={() => setIsModalOpen(false)}
				>
					<div
						className="modal-content"
						onClick={(e) => e.stopPropagation()}
					>
						<div className={styles.modalHeader}>
							<h2>{t('Обрати картини митця')}</h2>
							<button
								className={styles.modalCloseButton}
								onClick={() => setIsModalOpen(false)}
							>
								<IconContext.Provider
									value={{
										fill: 'red',
										size: '3rem',
										style: { padding: '4px' },
										cursor: 'pointer',
										color: 'red',
									}}
								>
									<TiDelete />
								</IconContext.Provider>
							</button>
						</div>
						<div className={styles.paintingsList}>
							{modalData.paintings.map((painting) => (
								<div
									key={painting.id}
									className={styles.paintingItem}
									onClick={() =>
										handleTogglePaintingSelection(painting)
									}
								>
									<div
										className={
											styles.paintingImageContainer
										}
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
										{/* Tooltip appears on hover */}
										<div className={styles.tooltip}>
											{t('Натисніть щоб обрати')}
										</div>
										{/* If selected, show overlay */}
										{modalData.selectedPaintings.find(
											(p) => p.id === painting.id,
										) && (
											<div
												className={
													styles.selectedOverlay
												}
											/>
										)}
									</div>
									<span>
										{painting.title_en || painting.title_uk}
									</span>
								</div>
							))}
						</div>
						<div className={styles.modalFooter}>
							<button
								className={styles.modalSaveButton}
								onClick={handleSaveSelectedPaintings}
							>
								{t('Зберегти')}
							</button>
						</div>
					</div>
				</div>
			)}
		</ProfilePageContainer>
	)
}

export default ExhibitionForm
