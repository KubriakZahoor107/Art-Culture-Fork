import { getFormattedDate } from '@/utils/helper.js'
import ImageEditor from '@components/Blocks/ImageEditor.jsx'
import Loading from '@components/Blocks/Loading.jsx'
import LoadingError from '@components/Blocks/LoadingError.jsx'
import ProfilePageContainer from '@components/Blocks/ProfilePageContainer'
import TextAreaEditor from '@components/Blocks/TextAreaEditor'
import TextEditor from '@components/Blocks/TextEditor'
import TranslatedContent from '@components/Blocks/TranslatedContent.jsx'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext.jsx'
import API from '../../../utils/api.js'
import styles from '/src/styles/components/UserProfile/userProfilePosts.module.scss'

function UserProfilePosts() {
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()
	const { user } = useAuth()
	const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

	const [posts, setPosts] = useState([]) // User's posts
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('') // Error state

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [editingPost, setEditingPost] = useState(null)
	const [formData, setFormData] = useState({
		title_en: '',
		content_en: '',
		title_uk: '',
		content_uk: '',
		images: null,
	})
	const [message, setMessage] = useState('')
	const [formErrors, setFormErrors] = useState([])

	useEffect(() => {
		const fetchUserPosts = async () => {
			try {
				if (!user) {
					setError(t('Користувач не авторізован'))
					navigate('/login')
					return
				}

				// Fetch posts by this user
				const response = await API.get('/posts', {
					params: { authorId: user.id }, // Assuming your API can filter by authorId
				})

				setPosts(Array.isArray(response.data) ? response.data : [])
			} catch (err) {
				console.error('Error fetching user posts:', err)
				setError('Failed to fetch posts')
			} finally {
				setLoading(false)
			}
		}

		fetchUserPosts()
	}, [user, navigate])

	useEffect(() => {
		const handleLanguageChange = (lng) => {
			setCurrentLanguage(lng)
		}

		i18n.on('languageChanged', handleLanguageChange)

		return () => {
			i18n.off('languageChanged', handleLanguageChange)
		}
	}, [i18n])

	// Modal Handlers
	const openEditModal = (post) => {
		setEditingPost(post)
		const initialFormData = {
			title_en: post.title_en || '',
			content_en: post.content_en || '',
			title_uk: post.title_uk || '',
			content_uk: post.content_uk || '',
			images: null,
		}
		setFormData(initialFormData)

		setIsModalOpen(true)
	}

	const closeEditModal = () => {
		setIsModalOpen(false)
		setEditingPost(null)
		setFormErrors({})
		setMessage('')
	}

	const handleEditSubmit = async (e) => {
		e.preventDefault()
		setMessage('')
		setFormErrors({})

		if (
			!formData.title_en ||
			!formData.content_en ||
			!formData.title_uk ||
			!formData.content_uk
		) {
			setFormErrors({ form: 'Заголовок та опис необхідні' })
			return
		}

		try {
			const postData = new FormData()
			postData.append('title_en', formData.title_en)
			postData.append('content_en', formData.content_en)
			postData.append('title_uk', formData.title_uk)
			postData.append('content_uk', formData.content_uk)
			if (formData.images && formData.images[0] instanceof File) {
				postData.append('images', formData.images[0])
			}

			const response = await API.put(
				`/posts/${editingPost.id}`,
				postData,
				{
					headers: {
						'Content-Type': 'multipart/form-data',
						Authorization: `Bearer ${localStorage.getItem('token')}`,
					},
				},
			)

			if (response.status === 200) {
				setMessage('Post update successfully')

				setPosts((prevPosts) =>
					prevPosts.map((post) =>
						post.id === editingPost.id ? response.data : post,
					),
				)
				closeEditModal()
			}
		} catch (error) {
			console.error('Error updating post', error)
			setMessage(
				error.response?.data?.error ||
					'Failed to update post. Please try again.',
			)
		}
	}

	const handleDeletePost = async (postId) => {
		if (
			window.confirm(t('Ви впевнені, що хочете видалити цю публікацію?'))
		) {
			try {
				const response = await API.delete(`/posts/${postId}`)
				if (response.status === 200) {
					setPosts(posts.filter((post) => post.id !== postId))
				}
			} catch (err) {
				console.error('Error deleting post', err)
				setError('Failed to delete post')
			}
		}
	}

	const textEditorOnChange = ({ name, value }) => {
		const newFormData = { ...formData, [name]: value }
		setFormData(newFormData)
	}
	console.log(formData)

	return (
		<ProfilePageContainer>
			<h2>{t('Публікації')}</h2>
			{loading ? (
				<Loading />
			) : error ? (
				<LoadingError />
			) : posts.length === 0 ? (
				<p>{t('Публікацій немає')}</p>
			) : (
				posts.map((post) => (
					<div
						key={post.id}
						className={styles.userProfilePostsWrapper}
					>
						<div
							className={styles.userProfilePostsPicAndTextWrapper}
						>
							<div className={styles.userProfilePostsPicWrapper}>
								{post.images ? (
									<img
										className={styles.userProfilePostsPic}
										src={post.images}
										alt={t('Світлина публікації')}
										onError={(e) => {
											e.target.onerror = null
											e.target.src =
												'/Img/newsCardERROR.jpg' // Default image path
										}}
									/>
								) : (
									<img
										className={styles.userProfilePostsPic}
										src="/Img/newsCardERROR.jpg"
										alt={t('Світлина публікації')}
									/>
								)}
							</div>
							<div className={styles.userProfilePostsTextWrapper}>
								<h3 className={styles.userProfilePostsTitle}>
									<TranslatedContent
										en={post.title_en}
										uk={post.title_uk}
									/>
								</h3>
								<div
									className={
										styles.userProfilePostsDescriptionWrapper
									}
								>
									<p
										className={
											styles.userProfilePostsDescription
										}
									>
										<TranslatedContent
											en={post.content_en}
											uk={post.content_uk}
											maxLength={700}
											html
										/>
									</p>
								</div>
								<div
									className={
										styles.userProfilePostsClockAndDateWrapper
									}
								>
									<img
										className={styles.userProfilePostsClock}
										src="/Img/clock.svg"
										alt={t('Дата')}
									/>
									<p className={styles.userProfilePostsDate}>
										{getFormattedDate(post.createdAt)}
									</p>
									<button
										className={
											styles.userProfilePostsButton
										}
										onClick={() =>
											navigate(`/posts/${post.id}`)
										} // Navigate to post detail page
									>
										{t('До публікації')}&#8194;&#187;
									</button>
								</div>
								<div
									className={styles.userProfileDelEditWrapper}
								>
									<button
										className="button button-default"
										onClick={() => openEditModal(post)}
									>
										{t('Редагувати')}
									</button>
									<button
										className={
											styles.userProfileDeleteButton
										}
										onClick={() =>
											handleDeletePost(post.id)
										}
									>
										{t('Видалити')}
									</button>
								</div>
							</div>
						</div>
					</div>
				))
			)}
			{/* Modal Window */}
			{isModalOpen && (
				<div className="modal-overlay">
					<div className="modal-content">
						<button type="button" onClick={closeEditModal}>
							<span className="modal-close-button">&times;</span>
						</button>
						<h2>{t('Редагування публікації')}</h2>
						{message && <p className={styles.message}>{message}</p>}
						{formErrors.form && (
							<p className={styles.error}>{formErrors.form}</p>
						)}
						<form
							onSubmit={handleEditSubmit}
							className={styles.modalForm}
						>
							<div className="flex gap-8 form-wrapper">
								<div className="form-group">
									<div className="field-group">
										<TextEditor
											label={t(
												'Назва публікації українською',
											)}
											name="title_uk"
											value={formData.title_uk}
											maxLength={200}
											required
											onChange={textEditorOnChange}
										/>
									</div>
									<div className="field-group">
										<TextAreaEditor
											label={t(
												'Опис публікації українською',
											)}
											name="content_uk"
											value={formData.content_uk}
											maxLength={3000}
											required
											onChange={textEditorOnChange}
											html
										/>
									</div>
								</div>

								<div className="form-group">
									<div className="field-group">
										<TextEditor
											label={t(
												'Назва публікації англійською',
											)}
											name="title_en"
											value={formData.title_en}
											maxLength={200}
											required
											onChange={textEditorOnChange}
										/>
									</div>
									<div className="field-group">
										<TextAreaEditor
											label={t(
												'Опис публікації англійською',
											)}
											name="content_en"
											value={formData.content_en}
											maxLength={3000}
											required
											onChange={textEditorOnChange}
											html
										/>
									</div>
								</div>
							</div>
							<div
								className={styles.modalFieldImageUploadWrapper}
							>
								<div className={styles.modalFieldImage}>
									<ImageEditor
										label={t('Додати зображення')}
										name="images"
										value={formData.images}
										onChange={textEditorOnChange}
									/>
									{editingPost.images &&
										!(
											formData.images &&
											formData.images[0] instanceof File
										) && (
											<img
												src={editingPost.images}
												alt={t('Поточне зображення')}
												className={styles.currentImage}
											/>
										)}
								</div>
							</div>
							<div className={styles.modalButtons}>
								<button
									type="submit"
									className={styles.modalSaveButton}
								>
									{t('Зберегти')}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</ProfilePageContainer>
	)
}

export default UserProfilePosts
