import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Letters from '@components/Blocks/Letters'
import Loading from '@components/Blocks/Loading'
import LoadingError from '@components/Blocks/LoadingError'
import Painting from '@components/Blocks/Painting'
import layoutStyles from '@styles/layout/Layout.module.scss'
import styles from '@styles/layout/ArtTermsPage.module.scss'

function ArtTermsFilteredPage() {
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()
	const { letter } = useParams()
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)
	const [artTerms, setArtTerms] = useState([])

	useEffect(() => {
		const fetchCreator = async () => {
			try {
				setLoading(true)
				const response = await axios.get('/api/art-terms/by-letter/' + letter)
				setArtTerms(response.data.artTerms.map(term => {
					return {
						id: term.id,
						highlightedProduct: term.highlightedProduct,
						title: i18n.language != "uk" ? term.title_en : term.title_uk,
						description: i18n.language != "uk" ? term.description_en : term.description_uk
					}
				}))
				setLoading(false)
				setError(false)
			} catch (error) {
				console.error('Error fetching art terms by letter data', error)
				setLoading(false)
				setError(true)
			}
		}

		fetchCreator()
	}, [letter, i18n])
	return (
		<div className={`${layoutStyles.PageContainer}`}>
			<div className={`${layoutStyles.PageTitleWrapper}`}>
				<h2 className={`${layoutStyles.PageTitle}`}>{t('Арт-терміни')}</h2>
			</div>

			<div className={`${layoutStyles.PageSeparatorWrapper}`}>
				<div className={`${layoutStyles.PageSeparator}`}></div>
			</div>

			<div className={`${layoutStyles.DescriptionWrapper}`}>
				<Letters selected={letter} onLetterSelected={(letter) => navigate(`/art-terms/letters/${letter.toLowerCase()}`)} />
			</div>

			<div className={`${layoutStyles.DescriptionWrapper}`}>
				{loading ? <Loading /> : error ? <LoadingError />
						: artTerms.length === 0 ? (
						<div>
							{t('Немає митців для відображення.')}
						</div>
					) : artTerms.map(artTerm => {
						return (
							<div key={artTerm.letter} className={styles.card}>
								<div  className={styles.cardMedia}>
									<a href={"/art-terms/" + artTerm.id}>
										<Painting painting={artTerm.highlightedProduct} />
									</a>
								</div>
								<div className={styles.cardContent}>
									<h2 className={styles.cardTitle}>
										<a href={"/art-terms/" + artTerm.id}>{artTerm.title}</a>
									</h2>
									<div className={styles.cardDescription}>
										<a href={"/art-terms/" + artTerm.id}>{artTerm.description}</a>
									</div>
									<div className={styles.cardCommands}>
										<a href={"/art-terms/letters/" + artTerm.title[0].toLowerCase()}
											className="button button-default">{t('Читати далі')}</a>
									</div>
								</div>
							</div>
						)
					})}
			</div>
		</div>
	)
}

export default ArtTermsFilteredPage
