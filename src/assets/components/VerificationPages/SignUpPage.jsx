import ImageEditor from '@components/Blocks/ImageEditor.jsx'
import TextAreaEditor from '@components/Blocks/TextAreaEditor'
import TextEditor from '@components/Blocks/TextEditor'
import styles from '@styles/components/VerificationPage/LoginPage.module.scss'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext.jsx'
import API from '../../../utils/api.js'
import MuseumAddressSearch from '../Blocks/MuseumAddressSearch.jsx'

const SignUp = () => {
	const { t } = useTranslation()
	const [signUpDetails, setSignUpDetails] = useState({
		email: '',
		password: '',
		role: 'USER',
		title: '',
		bio: '',
		profileImage: null,
		// Address fields
		country: '',
		state: '',
		city: '',
		street: '',
		house_number: '',
		postcode: '',
		lat: '',
		lon: '',
	})
	const [serverMessage, setServerMessage] = useState('')
	const { login } = useAuth() // Utilize login from AuthContext
	const navigate = useNavigate()
	const [passwordVisible, setPasswordVisible] = useState(false)
	const isMuseum = signUpDetails.role === 'MUSEUM'
	const isExhibition = signUpDetails.role === 'EXHIBITION'
	const textEditorOnChange = ({ name, value }) => {
		setSignUpDetails((prev) => ({
			...prev,
			[name]: value,
		}))
	}

	const handleChange = (e) => {
		const { name, value, files } = e.target
		if (name === 'profileImage') {
			setSignUpDetails((prev) => ({
				...prev,
				profileImage: files[0] || null,
			}))
		} else {
			setSignUpDetails((prev) => ({
				...prev,
				[name]: value,
			}))
		}
	}

	const handleAddressSelect = useCallback(
		({ country, state, city, road, house_number, postcode, lat, lon }) => {
			setSignUpDetails((prev) => ({
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

	const handleSubmit = async (e) => {
		e.preventDefault()
		setServerMessage('')

		console.log('signUpDetails before submission:', signUpDetails)

		const formData = new FormData()
		formData.append('email', signUpDetails.email)
		formData.append('password', signUpDetails.password)
		formData.append('role', signUpDetails.role)
		formData.append('title', signUpDetails.title)
		formData.append('bio', signUpDetails.bio)
		if (signUpDetails.profileImage) {
			formData.append('profileImage', signUpDetails.profileImage[0])
		}

		// If role is MUSEUM, append address fields
		if (signUpDetails.role === 'MUSEUM') {
			formData.append('country', signUpDetails.country)
			formData.append('city', signUpDetails.city)
			formData.append('street', signUpDetails.street)
			formData.append('house_number', signUpDetails.house_number)
			formData.append('postcode', signUpDetails.postcode)
			formData.append('lat', signUpDetails.lat)
			formData.append('lon', signUpDetails.lon)
		}

		// Log formData entries for debugging
		for (let [key, value] of formData.entries()) {
			console.log(`${key}:`, value)
		}

		try {
			const response = await API.post(
				'/auth/register',
				formData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				},
				console.log('signUpDetails', signUpDetails),
			)

			if (response.status === 201) {
				const { token, user } = response.data // Assuming API returns user data
				login(user, token) // Update AuthContext
				navigate('/profile') // Redirect to profile
			}
		} catch (error) {
			if (error.response && error.response.data) {
				setServerMessage(
					error.response.data.error || 'Registration failed.',
				)
			} else {
				setServerMessage('An error occurred during registration.')
			}
		}
	}

	const togglePasswordVisibility = () => {
		setPasswordVisible((prevVisible) => !prevVisible)
	}

	return (
		<div className={styles.LoginContainer}>
			<header className={styles.LoginWrapper}>
				<h1>{t('Реєстрація')}</h1>
				{serverMessage && (
					<p className={styles.ErrorMessage}>{serverMessage}</p>
				)}
				<form className={styles.SignUpForm} onSubmit={handleSubmit}>
					<div className={styles.roleSelectorWrapper}>
						<h2>{t('Зарееструватися як')}</h2>
						<div className={styles.roleSelectorInput}>
							<input
								type="radio"
								className={styles.roleSelectorCheck}
								required
								name="role"
								value="USER"
								checked={signUpDetails.role == 'USER'}
								onChange={handleChange}
							/>{' '}
							{t('тип_реестрації_користувач')}
						</div>
						<div className={styles.roleSelectorInput}>
							<input
								type="radio"
								className={styles.roleSelectorCheck}
								required
								name="role"
								value="MUSEUM"
								checked={signUpDetails.role == 'MUSEUM'}
								onChange={handleChange}
							/>{' '}
							{t('тип_реестрації_музей')}
						</div>
						<div className={styles.roleSelectorInput}>
							<input
								type="radio"
								className={styles.roleSelectorCheck}
								required
								name="role"
								value="CREATOR"
								checked={signUpDetails.role == 'CREATOR'}
								onChange={handleChange}
							/>{' '}
							{t('тип_реестрації_митець')}
						</div>
						<div className={styles.roleSelectorInput}>
							<input
								type="radio"
								className={styles.roleSelectorCheck}
								required
								name="role"
								value="AUTHOR"
								checked={signUpDetails.role == 'AUTHOR'}
								onChange={handleChange}
							/>{' '}
							{t('тип_реестрації_автор')}
						</div>
						<div className={styles.roleSelectorInput}>
							<input
								type="radio"
								className={styles.roleSelectorCheck}
								required
								name="role"
								value="EXHIBITION"
								checked={signUpDetails.role == 'EXHIBITION'}
								onChange={handleChange}
							/>{' '}
							{t('тип_реестрації_організатор_виставки')}
						</div>
					</div>
					<TextEditor
						label="Email"
						type="email"
						name="email"
						value={signUpDetails.email}
						onChange={textEditorOnChange}
						maxLength="191"
						required
					/>
					<TextEditor
						label={t('Пароль')}
						type={passwordVisible ? 'text' : 'password'}
						name="password"
						value={signUpDetails.password}
						onChange={textEditorOnChange}
						maxLength="191"
						required
						togglePasswordVisibility={togglePasswordVisibility}
						passwordVisible={passwordVisible}
					/>
					<TextEditor
						label={
							isExhibition || isMuseum ? t('Назва') : t('П.І.Б.')
						}
						type="text"
						name="title"
						value={signUpDetails.title}
						onChange={textEditorOnChange}
						maxLength="191"
						required
					/>
					<TextAreaEditor
						label={
							isExhibition || isMuseum ? t('Опис') : t('Про себе')
						}
						placeholder="Bio"
						name="bio"
						value={signUpDetails.bio}
						onChange={textEditorOnChange}
						maxLength="191"
						required
						html
					/>
					<ImageEditor
						label={t('Додати зображення')}
						type="file"
						name="profileImage"
						accept="image/*"
						onChange={textEditorOnChange}
						maxLength="191"
						required
					/>

					{signUpDetails.role === 'MUSEUM' && (
						<>
							{/* Museum Address Search */}
							<div className="field-group">
								<label className="field-label">
									{t('Пошук адреси для музею')}
								</label>
								<MuseumAddressSearch
									onSelect={handleAddressSelect}
								/>
							</div>

							{/* Separate inputs for address components */}
							<div className="field-group">
								<label className="field-label">
									{t('Країна')}
								</label>
								<input
									type="text"
									name="country"
									value={signUpDetails.country}
									onChange={handleChange}
									placeholder="Країна"
									style={{ width: '100%', padding: '8px' }}
									required
								/>
							</div>

							<div className="field-group">
								<label className="field-label">
									{t('Місто')}
								</label>
								<input
									type="text"
									name="city"
									value={signUpDetails.city}
									onChange={handleChange}
									placeholder="Місто"
									style={{ width: '100%', padding: '8px' }}
									required
								/>
							</div>

							<div className="field-group">
								<label className="field-label">
									{t('Вулиця')}
								</label>
								<input
									type="text"
									name="street"
									value={signUpDetails.street}
									onChange={handleChange}
									placeholder="Вулиця"
									style={{ width: '100%', padding: '8px' }}
									required
								/>
							</div>

							<div className="field-group">
								<label className="field-label">
									{t('Номер будинку')}
								</label>
								<input
									type="text"
									name="house_number"
									value={signUpDetails.house_number}
									onChange={handleChange}
									placeholder="Номер будинку"
									style={{ width: '100%', padding: '8px' }}
									required
								/>
							</div>

							<div className="field-group">
								<label className="field-label">
									{t('Поштовий індекс')}
								</label>
								<input
									type="text"
									name="postcode"
									value={signUpDetails.postcode}
									onChange={handleChange}
									placeholder="Поштовий індекс"
									style={{ width: '100%', padding: '8px' }}
									required
								/>
							</div>

							{/* Hidden fields for latitude and longitude */}
							<input
								type="hidden"
								name="lat"
								value={signUpDetails.lat}
							/>
							<input
								type="hidden"
								name="lon"
								value={signUpDetails.lon}
							/>
						</>
					)}

					<button type="submit">{t('Реєстрація')}</button>
				</form>
			</header>
		</div>
	)
}
export default SignUp
