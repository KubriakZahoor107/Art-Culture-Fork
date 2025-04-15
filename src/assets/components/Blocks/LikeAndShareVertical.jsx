import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'

import '@styles/components/Blocks/LikeAndShareVertical.scss'

function LikeAndShareVertical({ className }) {
	const { t } = useTranslation()

	return (
		<div className={`${className ? className : ""} VerticalSocialLikeAndShareWrapper`}>
			<button className='VerticalSocialLikeAndShareInner__VerticalLikeButton circleButton'>
				<img
					className='VerticalLikeButtonImg'
					src='/Img/likeHeart.svg'
					alt={t('Світлина вподобайки')}
					onError={e => {
						e.target.onerror = null
						e.target.src = '/Img/likeHeart.svg'
					}}
				/>
			</button>
			<button className='VerticalSocialLikeAndShareInner__VerticalShareButton circleButton'>
				<img
					className='VerticalShareButtonImg'
					src='/Img/shareArrow.svg'
					alt={t('Світлина вподобайки')}
					onError={e => {
						e.target.onerror = null
						e.target.src = '/Img/likeHeart.svg'
					}}
				/>
			</button>
		</div>
	)
}

LikeAndShareVertical.propTypes = {
	className: PropTypes.string
};

export default LikeAndShareVertical
