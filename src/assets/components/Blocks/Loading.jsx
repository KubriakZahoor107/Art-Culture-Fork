import { useTranslation } from 'react-i18next'
import styles from "@styles/components/Blocks/Loading.module.scss"

function Loading() {
	const { t } = useTranslation()

	return (
		<div className={styles.loading}>{t('Завантаження...')}</div>
	)
}

export default Loading
