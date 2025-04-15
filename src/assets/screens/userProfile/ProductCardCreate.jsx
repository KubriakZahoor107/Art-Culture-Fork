import ImageEditor from '@components/Blocks/ImageEditor.jsx'
import ProfilePageContainer from '@components/Blocks/ProfilePageContainer'
import TextAreaEditor from '@components/Blocks/TextAreaEditor'
import TextEditor from '@components/Blocks/TextEditor'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import API from '../../../utils/api.js'
import { getUserRole } from '../../../utils/constants.jsx'
import styles from '/src/styles/components/ProductCard/ProductCardCreate.module.scss'

const ProductCardCreate = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const [formData, setFormData] = useState({
		title_en: '',
		title_uk: '',
		description_en: '',
		description_uk: '',
		specs_en: '',
		specs_uk: '',
		size: '',
		dateofcreation: '',
		style_en: '',
		style_uk: '',
		technique_en: '',
		technique_uk: '',
		images: [],
	})

	const [serverMessage, setServerMessage] = useState('')
	const { isMuseum } = getUserRole()

	const handleSubmit = async (e) => {
		e.preventDefault()
		setServerMessage('')

		const formDataToSend = new FormData()
		formDataToSend.append('title_en', formData.title_en)
		formDataToSend.append('title_uk', formData.title_uk)
		formDataToSend.append('description_en', formData.description_en)
		formDataToSend.append('description_uk', formData.description_uk)
		formDataToSend.append('specs_en', formData.specs_en)
		formDataToSend.append('specs_uk', formData.specs_uk)
		formDataToSend.append('size', formData.size)
		formDataToSend.append('dateofcreation', formData.dateofcreation)
		formDataToSend.append('style_en', formData.style_en)
		formDataToSend.append('style_uk', formData.style_uk)
		formDataToSend.append('technique_en', formData.technique_en)
		formDataToSend.append('technique_uk', formData.technique_uk)
		if (formData.images && formData.images.length > 0) {
			Array.from(formData.images).forEach((file) => {
				formDataToSend.append('productImages', file)
			})
		}
		try {
			const response = await API.post('/products', formDataToSend, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${localStorage.getItem('token')}`,
				},
			})

			if (response.status === 201) {
				setServerMessage('Product created successfully')
				console.log('Navigating to /profile/products')
				navigate('/profile/products')
			}
		} catch (error) {
			console.error('product create error', error)
			if (error.response && error.response.data) {
				setServerMessage(
					error.response.data.error || 'Product could not be created',
				)
			} else {
				setServerMessage('Product could not be created during action')
			}
		}
	}

	const textEditorOnChange = ({ name, value }) => {
		const newFormData = { ...formData, [name]: value }
		setFormData(newFormData)
	}

	return (
		<ProfilePageContainer>
			<h2>{isMuseum ? t('Додати експонат') : t('Додати картину')}</h2>
			{serverMessage && (
				<p className={styles.serverMessage}>{serverMessage}</p>
			)}
			<form onSubmit={handleSubmit} className="form-wrapper">
				<div className="flex gap-8 form-wrapper">
					<div className="form-group">
						<div className="field-group">
							<TextEditor
								label={t('Назва українською')}
								name="title_uk"
								value={formData.title_uk}
								maxLength={150}
								required
								onChange={textEditorOnChange}
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Опис українською')}
								name="description_uk"
								value={formData.description_uk}
								maxLength={1000}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Специфікація українською')}
								name="specs_uk"
								value={formData.specs_uk}
								maxLength={500}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Стиль українською')}
								name="style_uk"
								value={formData.style_uk}
								maxLength={500}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Техніка українською')}
								name="technique_uk"
								value={formData.technique_uk}
								maxLength={500}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
					</div>
					<div className="form-group">
						<div className="field-group">
							<TextEditor
								label={t('Назва англійською')}
								name="title_en"
								value={formData.title_en}
								maxLength={150}
								required
								onChange={textEditorOnChange}
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Опис англійською')}
								name="description_en"
								value={formData.description_en}
								maxLength={500}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Специфікація англійською')}
								name="specs_en"
								value={formData.specs_en}
								maxLength={500}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Стиль англійською')}
								name="style_en"
								value={formData.style_en}
								maxLength={500}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
						<div className="field-group">
							<TextAreaEditor
								label={t('Техніка англійською')}
								name="technique_en"
								value={formData.technique_en}
								maxLength={500}
								required
								onChange={textEditorOnChange}
								html
							/>
						</div>
					</div>
					<div className="field-group">
						<TextAreaEditor
							label={t('Розмір')}
							name="size"
							value={formData.size}
							maxLength={100}
							required
							onChange={textEditorOnChange}
							html
						/>
					</div>
					<div className="field-group">
						<TextAreaEditor
							label={t('Дата створення')}
							name="dateofcreation"
							value={formData.dateofcreation}
							maxLength={100}
							required
							onChange={textEditorOnChange}
							html
						/>
					</div>
				</div>
				<ImageEditor
					label={t('Додати зображення')}
					required
					name="images"
					value={formData.images}
					multiple
					onChange={textEditorOnChange}
				/>
				<button type="submit">{t('Створити')}</button>
			</form>
		</ProfilePageContainer>
	)
}

export default ProductCardCreate
