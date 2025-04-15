import { getFormattedDate } from '@/utils/helper'
import ImageEditor from '@components/Blocks/ImageEditor.jsx'
import MuseumAddressSearch from '@components/Blocks/MuseumAddressSearch.jsx'
import ProfilePageContainer from '@components/Blocks/ProfilePageContainer'
import TextAreaEditor from '@components/Blocks/TextAreaEditor.jsx'
import TextEditor from '@components/Blocks/TextEditor.jsx'
import TranslatedContent from '@components/Blocks/TranslatedContent'
import DOMPurify from 'dompurify' // Import DOMPurify if needed
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext'
import API from '../../../utils/api.js'
import { getUserRole } from '../../../utils/constants.jsx'
import styles from '/src/styles/components/UserProfile/userProfile.module.scss'
const UserProfile = () => {
	const { user, updateUser, loading, error } = useAuth() // Access user and logout from context
	const { isMuseum, isExhibition } = getUserRole()
	const [email, setEmail] = useState('')
	const [regDate, setRegDate] = useState('')
	const [serverMessage, setServerMessage] = useState('')
	const [title, setTitle] = useState('')
	const [bio, setBio] = useState('')
	const [profileImage, setProfileImage] = useState(null) // Can hold File object or URL
	const [museumLogo, setMuseumLogo] = useState(null)
	const [editMode, setEditMode] = useState(false)
	const { t } = useTranslation()
	const navigate = useNavigate()
	const hidden = false
	// Address fields
	const [country, setCountry] = useState('')
	const [city, setCity] = useState('')
	const [street, setStreet] = useState('')
	const [houseNumber, setHouseNumber] = useState('')
	const [postcode, setPostcode] = useState('')
	const [latitude, setLatitude] = useState('')
	const [longitude, setLongitude] = useState('')

	useEffect(() => {
		if (loading) return

		if (user) {
			console.log('User is logged in:', user)
			setEmail(user.email || '')
			setRegDate(getFormattedDate(user.createdAt))
			setTitle(user.title || '')
			setBio(user.bio || '')
			setProfileImage(user.images || null)

			if (user.role === 'MUSEUM') {
				setCountry(user.country || '')
				setCity(user.city || '')
				setStreet(user.street || '')
				setHouseNumber(user.house_number || '')
				setPostcode(user.postcode || '')
				setLatitude(user.lat ? user.lat.toString() : '')
				setLongitude(user.lon ? user.lon.toString() : '')
				setMuseumLogo(user.museum_logo_image?.imageUrl || null)
			}
		} else {
			if (error) {
				setServerMessage('No valid session found. Please login.')
			}
			navigate('/login') // Redirect to login page
		}
		console.log('UserProfile rendering for user:', user)
	}, [user, loading, error, navigate])

	const toggleEditMode = () => {
		setEditMode(!editMode)
		setServerMessage('')
	}

	const handleAddressSelect = useCallback(
		({ country, state, city, road, house_number, postcode, lat, lon }) => {
			updateUser((prev) => ({
				...prev,
				country,
				state,
				city,
				street: road,
				house_number,
				postcode,
				lat,
				lon,
			}))
		},
		[],
	)

	const handleUpdateProfile = async (e) => {
		e.preventDefault()
		setServerMessage('')

		// Extract plain text to validate length
		const plainTextBio = bio.replace(/<[^>]+>/g, '') // Strip HTML tags
		if (plainTextBio.length > 500) {
			setServerMessage(
				'Bio exceeds the maximum length of 500 characters.',
			)
			return
		}

		// Sanitize the bio content (already sanitized in TextAreaEditor, but double-check)
		const sanitizedBio = DOMPurify.sanitize(bio, {
			ALLOWED_TAGS: [
				'b',
				'i',
				'em',
				'strong',
				'a',
				'p',
				'br',
				'ul',
				'ol',
				'li',
				'span',
			],
			ALLOWED_ATTR: ['href', 'title', 'target', 'rel', 'style'],
			FORBID_EMPTY: true, // Ensure no empty tags remain
		})

		// Remove any remaining zero-width characters
		const cleanSanitizedBio = sanitizedBio.replace(
			/[\u200B-\u200D\uFEFF]/g,
			'',
		)

		console.log('Sanitized Bio content:', cleanSanitizedBio) // Log sanitized content
		const formData = new FormData()
		formData.append('title', title)
		formData.append('bio', cleanSanitizedBio)
		if (profileImage instanceof File) {
			formData.append('profileImage', profileImage)
		}

		// If the user is a Museum, append address fields
		if (user && user.role === 'MUSEUM') {
			formData.append('country', country)
			formData.append('city', city)
			formData.append('street', street)
			formData.append('house_number', houseNumber)
			formData.append('postcode', postcode)
			formData.append('lat', latitude)
			formData.append('lon', longitude)
			if (museumLogo instanceof File) {
				formData.append('museumLogo', museumLogo)
			}
		}

		// Log formData entries for debugging
		for (let [key, value] of formData.entries()) {
			console.log(`${key}:`, value)
		}

		try {
			const response = await API.put('/auth/me', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})
			if (response.status === 200) {
				const { user: updatedUserProfile, message } = response.data
				setServerMessage(t(message))
				setEditMode(false)
				updateUser(updatedUserProfile)
				closeModal() // Закрываем модальное окно после успешного обновления
			}
		} catch (error) {
			if (error.response && error.response.data) {
				setServerMessage(error.response.data.message || 'Update failed')
			} else {
				setServerMessage('An error occurred during profile update ')
			}
		}
	}

	useEffect(() => {
		return () => {
			if (profileImage instanceof File) {
				URL.revokeObjectURL(profileImage)
			}
			if (museumLogo instanceof File) {
				URL.revokeObjectURL(museumLogo)
			}
		}
	}, [profileImage, museumLogo])

	const [isOpen, setIsOpen] = useState(false)

	const openModal = () => setIsOpen(true)
	const closeModal = () => setIsOpen(false)

	return (
		<ProfilePageContainer>
			<h2>{t('Інформація профілю')}</h2>
			<div className={styles.profileDetails}>
				<div className={styles.profileInformationContainer}>
					{/* <div className={styles.profileAvatarWrapper}>
						<div className={styles.profileAvatar}>
						</div>
					</div> */}

					<div className={styles.profileTextWrapper}>
						{title && (
							<p>
								<strong>
									{isExhibition || isMuseum
										? t('Назва')
										: t('П.І.Б.')}
									:&#8194;
								</strong>
								{title}
							</p>
						)}

						{user && user.role === 'MUSEUM' && museumLogo && (
							<img
								src={
									museumLogo instanceof File
										? URL.createObjectURL(museumLogo)
										: museumLogo.startsWith('http') ||
											  museumLogo.startsWith(
													'/uploads/museumLogoImages',
											  )
											? `${museumLogo}`
											: museumLogo
								}
								alt="Museum Logo"
								className={styles.museumLogo}
							/>
						)}

						{profileImage && (
							<img
								src={
									profileImage instanceof File
										? URL.createObjectURL(profileImage)
										: profileImage.startsWith('http') ||
											  profileImage.startsWith(
													'/uploads/profileImages',
											  )
											? `${profileImage}`
											: profileImage
								}
								alt="Profile"
								className={styles.profileImage}
							/>
						)}

						{bio && (
							<p>
								<strong>
									{isExhibition || isMuseum
										? t('Опис')
										: t('Про себе')}
									:&#8194;
								</strong>
								<TranslatedContent en={bio} uk={bio} html />
							</p>
						)}

						<p>
							<strong>E-Mail:&#8194;</strong>
							{email}
						</p>
						<p>
							<strong>{t('Дата реєстрації')}:&#8194;</strong>
							{regDate}
						</p>

						{/* Conditionally render address information for Museum users */}
						{user && user.role === 'MUSEUM' && (
							<div
								className={styles.addressDetails}
								hidden={hidden}
							>
								<p>
									<strong>{t('Країна')}:&#8194;</strong>{' '}
									{country}
								</p>
								<p>
									<strong>{t('Місто')}:&#8194;</strong> {city}
								</p>
								<p>
									<strong>{t('Вулиця')}:&#8194;</strong>{' '}
									{street}
								</p>
								<p>
									<strong>
										{t('Номер будинку')}:&#8194;
									</strong>{' '}
									{houseNumber}
								</p>
								<p>
									<strong>
										{t('Поштовий індекс')}:&#8194;
									</strong>{' '}
									{postcode}
								</p>
							</div>
						)}

						{serverMessage && (
							<p className={styles.ErrorMessage}>
								{serverMessage}
							</p>
						)}

						<div className={styles.editButtonWrapper}>
							<button
								onClick={() => {
									toggleEditMode()
									openModal()
								}}
								className="button button-default"
							>
								{editMode ? t('Скасувати') : t('Редагувати')}
							</button>
						</div>
					</div>
				</div>

				<div className="App">
					{isOpen && (
						<div
							className="modal-overlay"
							style={{ overflow: 'hidden' }}
						>
							<div
								className="modal-content"
								style={{ overflowY: 'scroll' }}
							>
								{editMode && (
									<form
										className={styles.editProfileForm}
										onSubmit={handleUpdateProfile}
									>
										<div
											className={styles.modalTitleWrapper}
										>
											<h3 className={styles.modalTitle}>
												{t('Редагування профілю')}
											</h3>

											<div
												className={
													styles.closeButtonWrapper
												}
											>
												<button
													onClick={() => {
														toggleEditMode()
														closeModal()
													}}
													className="button"
												>
													<span
														className={styles.close}
													>
														&times;
													</span>
												</button>
											</div>
										</div>

										<div
											className={
												styles.profileModalNameWrapper
											}
										>
											<TextEditor
												name="title"
												value={title}
												label={t('П.І.Б.')}
												onChange={({ value }) =>
													setTitle(value)
												}
												maxLength={191}
											/>
										</div>

										<div
											className={
												styles.profileModalBioWrapper
											}
										>
											<TextAreaEditor
												label={t('Про себе')}
												placeholder="Bio"
												name="bio"
												value={bio}
												maxLength={1500}
												required
												onChange={({ value }) =>
													setBio(value)
												}
												html
											/>
										</div>

										{/* Conditionally render address fields if the user is a Museum */}
										{user && user.role === 'MUSEUM' && (
											<div
												className={
													styles.addressEditWrapper
												}
												style={{
													display: 'flex',
													flexDirection: 'column',
												}}
											>
												{/* Museum Address Search */}
												<div className="field-group">
													<label className="field-label">
														{t(
															'Пошук адреси для музею',
														)}
													</label>
													<MuseumAddressSearch
														onSelect={
															handleAddressSelect
														}
													/>
												</div>
												<TextEditor
													name="country"
													value={country}
													label={t('Країна')}
													onChange={({ value }) =>
														setCountry(value)
													}
													maxLength={100}
													//required
												/>
												<TextEditor
													name="city"
													value={city}
													label={t('Місто')}
													onChange={({ value }) =>
														setCity(value)
													}
													maxLength={100}
													//required
												/>
												<TextEditor
													name="street"
													value={street}
													label={t('Вулиця')}
													onChange={({ value }) =>
														setStreet(value)
													}
													maxLength={100}
													//required
												/>
												<TextEditor
													name="houseNumber"
													value={houseNumber}
													label={t('Номер будинку')}
													onChange={({ value }) =>
														setHouseNumber(value)
													}
													maxLength={50}
													//required
												/>
												<TextEditor
													name="postcode"
													value={postcode}
													label={t('Поштовий індекс')}
													onChange={({ value }) =>
														setPostcode(value)
													}
													maxLength={20}
													//required
												/>
											</div>
										)}

										<div
											className={
												styles.profileModalImageDownloadWrapper
											}
										>
											<ImageEditor
												label={t('Додати зображення')}
												//required
												name="images"
												value={profileImage}
												onChange={({ value }) =>
													setProfileImage(value[0])
												}
											/>
										</div>

										{user && user.role === 'MUSEUM' && (
											<div
												className={
													styles.profileModalLogoUploadWrapper
												}
											>
												<ImageEditor
													label={t(
														'Завантажити логотип музею',
													)}
													name="museumLogo"
													value={museumLogo}
													onChange={({ value }) =>
														setMuseumLogo(value[0])
													}
													// Optional: add validation or constraints
												/>
											</div>
										)}

										<button
											className={styles.submitButton}
											type="submit"
										>
											{t('Оновити профіль')}
										</button>
									</form>
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</ProfilePageContainer>
	)
}

export default UserProfile
