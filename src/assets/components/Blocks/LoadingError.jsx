import styles from '@styles/components/Blocks/LoadingError.module.scss'
import { useTranslation } from 'react-i18next'

function LoadingError({ message }) {
	const { t } = useTranslation()

	const defaultText = t('Неможливо завантажити дані')

	return <div className={styles.error}>{message || defaultText}</div>
}

export default LoadingError
