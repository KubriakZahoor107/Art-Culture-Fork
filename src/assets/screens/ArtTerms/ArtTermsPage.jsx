import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import PopularArtsSlider from '@components/Sliders/ArtistsPageSliders/PopularArtsSlider.jsx'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import AllArtistsPageSearchSlider from '@components/Sliders/AllArtistsPageLettersSortSlider/AllArtistsPageSearchSlider'
import { englishLetters, ukrainianLetters } from '../../../utils/constants'
import Loading from '@components/Blocks/Loading'
import Painting from '@components/Blocks/Painting'
import ArtTermSlider from './ArtTermSlider'
import LoadingError from '@components/Blocks/LoadingError'
import layoutStyles from '@styles/layout/Layout.module.scss'
import styles from '@styles/layout/ArtTermsPage.module.scss'

function ArtTermsPage() {
	const { t, i18n } = useTranslation()

	const navigate = useNavigate()
	const [error, setError] = useState(null)
	const [language, setLanguage] = useState(i18n.language)
	const [loading, setLoading] = useState(true)
	const [artTerms, setArtTerms] = useState([])
	useEffect(() => {
		i18n.on("languageChanged", () => setLanguage(i18n.language))
		return () => i18n.off("languageChanged", () => setLanguage(i18n.language))
	}, [i18n])
	useEffect(() => {
		const fetchCreator = async () => {
			try {
				setLoading(true)
				const response = await axios.get('/api/art-terms/letters/' + language)
				setArtTerms(response.data.artTerms)
				setLoading(false)
				setError(false)
			} catch (error) {
				console.error('Error fetching art terms letters data', error)
				setLoading(false)
				setError(true)
			}
		}

		fetchCreator()
	}, [language])

	return (
		<div className={`${layoutStyles.PageContainer}`}>
			<div className={`${layoutStyles.PageTitleWrapper}`}>
				<h2 className={`${layoutStyles.PageTitle}`}>{t('Арт-терміни')}</h2>
			</div>

			<div className={`${layoutStyles.PageSeparatorWrapper}`}>
				<div className={`${layoutStyles.PageSeparator}`}></div>
			</div>

			<div className={`${layoutStyles.DescriptionWrapper}`}>
				<p className={`${layoutStyles.Description}`}>
					{t('Арт-терміни-інформація')}
				</p>
			</div>

			<ArtTermSlider />

			<div className={`${layoutStyles.DescriptionWrapper}`}>
				<AllArtistsPageSearchSlider letters={i18n.language === 'uk' ? ukrainianLetters : englishLetters}
					onLetterSelected={(letter) => navigate(`/art-terms/letters/${letter.toLowerCase()}`)} />
			</div>

			<div className={`${layoutStyles.DescriptionWrapper}`}>
				{loading ? <Loading /> : error ? <LoadingError />
						: artTerms.length === 0 ? (
						<div>
							{t('Немає арт-термінів для відображення.')}
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
										<a href={"/art-terms/letters/" + artTerm.letter.toLowerCase()}>{artTerm.letter}</a>

										<a href={"/art-terms/" + artTerm.id}>{artTerm.title}</a>
									</h2>
									<div className={styles.cardDescription}>
										<a href={"/art-terms/" + artTerm.id}>{artTerm.description}</a>
									</div>
									<div className={styles.cardCommands}>
										<a href={"/art-terms/letters/" + artTerm.letter.toLowerCase()} className="button button-default">{t('Подивитися усі терміни')}</a>
									</div>
								</div>
							</div>
						)
					})}
			</div>

			<PopularArtsSlider />

		</div>
	)
}

export default ArtTermsPage
