import styles from '@styles/components/Blocks/Sidebar.module.scss'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../Context/AuthContext.jsx'
import { getUserRole } from '../../../utils/constants'

function Sidebar() {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { logout } = useAuth()
	const { isAdmin, isAuthor, isCreator, isEditor, isExhibition, isMuseum } =
		getUserRole()

	const handleProfilePageClick = () => {
		navigate('/profile')
	}

	const handlePostsClick = () => {
		navigate('/profile/posts')
	}

	const handleAddPostClick = () => {
		navigate('/profile/posts/create')
	}

	const handleProductCartCreateClick = () => {
		navigate('/profile/products/create')
	}

	const handlePaintingCardListClick = () => {
		navigate('/profile/products')
	}

	const handleExhibitionCardCreateClick = () => {
		navigate('/exhibitions/create')
	}

	const handleExhibitionListClick = () => {
		navigate('/Exhibitions')
	}

	const handleLogout = () => {
		logout()
		navigate('/login')
	}

	return (
		<div className={styles.profileActions}>
			<button
				className={`${styles.profileAction} ${styles.profileActionActive}`}
				onClick={handleProfilePageClick}
			>
				{t('Профіль')}
			</button>
			{isAdmin && (
				<>
					<button
						className={`${styles.profileAction} ${styles.profileActionActive}`}
						onClick={() => navigate('/admin/dashboard')}
					>
						{t('Панель керування')}
					</button>
					<button
						onClick={() => navigate('/admin/users')}
						className={`${styles.profileAction}`}
					>
						{t('Керування користувачами')}
					</button>
					<button
						onClick={() => navigate('/admin/posts')}
						className={`${styles.profileAction}`}
					>
						{t('Керування постами')}
					</button>
					<button
						onClick={() => navigate('/admin/products')}
						className={`${styles.profileAction}`}
					>
						{t('Керування продуктами')}
					</button>
					<button
						onClick={() => navigate('/admin/art-terms')}
						className={`${styles.profileAction}`}
					>
						{t('Керування термінами')}
					</button>
				</>
			)}
			{(isAuthor || isCreator || isMuseum || isExhibition) && (
				<>
					<button
						className={styles.profileAction}
						onClick={handleAddPostClick}
					>
						{t('Додати публікацію')}
					</button>
					<button
						className={styles.profileAction}
						onClick={handlePostsClick}
					>
						{t('Публікації')}
					</button>
				</>
			)}
			{(isCreator || isEditor || isAdmin || isMuseum) && (
				<>
					<button
						className={styles.profileAction}
						onClick={handleProductCartCreateClick}
					>
						{isMuseum ? t('Додати експонат') : t('Додати картину')}
					</button>
					<button
						className={styles.profileAction}
						onClick={handlePaintingCardListClick}
					>
						{isMuseum
							? t('Переглянути експонати')
							: t('Переглянути вироби/картини')}
					</button>
				</>
			)}
			{(isExhibition || isCreator || isMuseum || isAdmin) && (
				<>
					<button
						className={styles.profileAction}
						onClick={handleExhibitionCardCreateClick}
					>
						{t('Додати виставку')}
					</button>
					<button
						className={styles.profileAction}
						onClick={handleExhibitionListClick}
					>
						{t('Переглянути виставки')}
					</button>
				</>
			)}
			<button className={styles.profileAction} onClick={handleLogout}>
				{t('Вийти')}
			</button>
		</div>
	)
}

export default Sidebar
