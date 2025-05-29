import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import Loading from '@components/Blocks/Loading'
import LoadingError from '@components/Blocks/LoadingError'
import Painting from '@components/Blocks/Painting'
import TranslatedContent from '@components/Blocks/TranslatedContent'
import PopularArtsSlider from '@components/Sliders/ArtistsPageSliders/PopularArtsSlider.jsx'
import layoutStyles from '@styles/layout/Layout.module.scss'

function ArtTermPage() {
	const { id } = useParams()

	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(true)
	const [artTerm, setArtTerm] = useState({})
	useEffect(() => {
		const fetchCreator = async () => {
			try {
				setLoading(true)
				const response = await axios.get('/api/art-terms/' + id)
				setArtTerm(response.data.artTerm)
				setLoading(false)
				setError(false)
			} catch (error) {
				console.error('Error fetching art term data', error)
				setLoading(false)
				setError(true)
			}
		}

		fetchCreator()
	}, [id])

	return (
		loading ? <Loading /> : error ? <LoadingError />
			: <div className={`${layoutStyles.PageContainer}`}>
			<div className={`${layoutStyles.PageTitleWrapper}`}>
				<h1 className={`${layoutStyles.PageTitle}`}>
					<TranslatedContent en={artTerm.title_en} uk={artTerm.title_uk} />
				</h1>
			</div>

			<div className={`${layoutStyles.PageSeparatorWrapper}`}>
				<div className={`${layoutStyles.PageSeparator}`}></div>
			</div>

			<div className={`${layoutStyles.DescriptionWrapper}`}>
				<p className={`${layoutStyles.Description}`}>
					<TranslatedContent en={artTerm.description_en} uk={artTerm.description_uk} />
				</p>
			</div>

			<div className={`${layoutStyles.DescriptionWrapper}`}>
				<Painting painting={artTerm.highlightedProduct} metadata />
			</div>


			<div className={`${layoutStyles.DescriptionWrapper}`}>
				<TranslatedContent html en={artTerm.content_en} uk={artTerm.content_uk} />
			</div>

			<PopularArtsSlider />
		</div>
	)
}

export default ArtTermPage
