// src/components/UserProfile/UserProfileAddPost.jsx

import ImageEditor from '@components/Blocks/ImageEditor.jsx'
import ProfilePageContainer from '@components/Blocks/ProfilePageContainer'
import TextAreaEditor from '@components/Blocks/TextAreaEditor'
import TextEditor from '@components/Blocks/TextEditor'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext.jsx'
import API from '../../../utils/api.js'
import styles from '/src/styles/components/UserProfile/userProfileAddPost.module.scss'

function UserProfileAddPost() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { user } = useAuth()

	const [formData, setFormData] = useState({
		title_en: '',
		title_uk: '',
		content_en: '',
		content_uk: '',
		images: null,
	})
	const [message, setMessage] = useState('')
	const [errors, setErrors] = useState('')

	const handleSubmit = async (e) => {
		e.preventDefault()
		setMessage('')
		setErrors('')

		// Frontend Validation
		if (
			!formData.title_en ||
			!formData.content_en ||
			!formData.title_uk ||
			!formData.content_uk
		) {
			setErrors(t("Заголовок та опис обов'язкові"))
			return
		}

		if (!user) {
			setErrors(t('Користувач не авторізован'))
			navigate('/login')
			return
		}

		const token = localStorage.getItem('token')
		if (!token) {
			setErrors(t('Користувач не авторізован'))
			navigate('/login')
			return
		}

		try {
			const postData = new FormData()
			postData.append('title_en', formData.title_en)
			postData.append('content_en', formData.content_en)
			postData.append('title_uk', formData.title_uk)
			postData.append('content_uk', formData.content_uk)
			if (formData.images) {
				postData.append('images', formData.images[0])
			}

			const response = await API.post('/posts', postData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			if (response.status === 201) {
				setMessage(t('Публікація успішно створена'))
				navigate('/profile/posts')
			}
		} catch (error) {
			console.error('Error adding post:', error)
			setErrors(
				error.response?.data?.error
					? t(error.response?.data?.error)
					: t('Неможливо створити публікацію'),
			)
		}
	}

	const textEditorOnChange = ({ name, value }) => {
		console.log(name, value)
		const newFormData = { ...formData, [name]: value }
		setFormData(newFormData)
	}
	console.log(formData)
	return (
		<ProfilePageContainer>
			<h2>{t('Додати нову публікацію')}</h2>
			{message && <p className={styles.message}>{message}</p>}
			{errors && <p className={styles.error}>{errors}</p>}
			<form onSubmit={handleSubmit} className={styles.profileAddPostForm}>
				<div className="flex gap-8 form-wrapper">
					<div className="form-group">
						<div className="field-group">
							<TextEditor
								label={t('Назва публікації українською')}
								name="title_uk"
								value={formData.title_uk}
								maxLength="200"
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Опис публікації українською')}
								name="content_uk"
								value={formData.content_uk}
								maxLength="3000"
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="field-group">
							<TextEditor
								label={t('Назва публікації англійською')}
								name="title_en"
								value={formData.title_en}
								maxLength="200"
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Опис публікації англійською')}
								name="content_en"
								value={formData.content_en}
								maxLength="3000"
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
					</div>
				</div>
				<div className="field-group">
					<ImageEditor
						label={t('Додати зображення')}
						name="images"
						value={formData.images}
						onChange={textEditorOnChange}
					/>
				</div>

				<div className={styles.profileLinksWrapper}>
					<button
						className={styles.profileLink}
						onClick={() =>
							window.open(
								'https://www.deepl.com/en/translator',
								'_blank',
								'noopener',
							)
						}
					>
						{t('Онлайн перекладач')}&#8194;&#187;
					</button>
					<button
						className={styles.profileLink}
						onClick={() =>
							window.open(
								'https://cloudconvert.com/jpeg-to-webp',
								'_blank',
								'noopener',
							)
						}
					>
						{t('Онлайн WEBP-конвертер')}&#8194;&#187;
					</button>
				</div>
				<button type="submit" className={styles.profileAddPostButton}>
					{t('Зберегти')}
				</button>
			</form>
		</ProfilePageContainer>
	)
}

export default UserProfileAddPost
