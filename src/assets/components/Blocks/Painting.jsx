import PropTypes from 'prop-types'
import TranslatedContent from '@components/Blocks/TranslatedContent'

function Painting({ painting, metadata }) {
	return (
		<figure className="article-media__figure">
			{painting.images.length > 0 ? (
				<picture>
					<img
						alt=""
						src={painting.images[0].imageUrl}
						loading="lazy"
						width="340"
					/>
				</picture>
			) : null}

			{metadata ? (
			<figcaption className="image__caption">
				<p className="image__caption__piece">
					{painting.author ? (<>{painting.author.title}<br /></>) : null}
					<em>
						<a href={`/paintings/${painting.id}`}>
							<TranslatedContent
								en={painting.title_en}
								uk={painting.title_uk}
							/>
						</a>
					</em>
					<span className='image__caption__year'>(1911)</span>
					<br />
					Tate
				</p>
			</figcaption>) : null}
		</figure>
	)
}

Painting.propTypes = {
	painting: PropTypes.object,
	metadata: PropTypes.bool,
}

export default Painting
