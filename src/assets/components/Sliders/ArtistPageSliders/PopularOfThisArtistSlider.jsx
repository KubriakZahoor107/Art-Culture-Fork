import React from 'react'
import { useTranslation } from 'react-i18next'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { getBaseUrl } from '../../../../utils/helper'
// Import Swiper modules
// import LikeAndShare from '@components/Blocks/LikeAndShare'
import sliderStyles from '@styles/components/Blocks/Slider.module.scss'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'
import { Navigation, Pagination } from 'swiper/modules'
import '/src/styles/components/Sliders/ArtistPageSliders/PopularOfThisArtistSlider.scss'

const Slide = ({ product }) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const baseUrl = getBaseUrl()

	// Determine the featured media URL
	const featuredMediaUrl =
		Array.isArray(product.images) && product.images.length > 0
			? `${baseUrl}${product.images[0].imageUrl.replace('../../', '/')}`
			: '/Img/halfNewsCard.jpg'

	const handleProductPreviewClick = () => {
		navigate(`/products/${product.id}`)
		// If no products are available, display a message
	}
	return (
		<div className="popularOfThisArtistSliderCardContainer">
			<div className="popularOfThisArtistSliderCardImgWrapper">
				<img
					className="popularOfThisArtistSliderCardImg"
					src={featuredMediaUrl}
					alt={t('Світлина мистецтва')}
					onError={(e) => {
						e.target.onerror = null
						e.target.src = '/public/Img/newsCardERROR.jpg'
					}}
				/>
			</div>

			<div className="popularOfThisArtistSliderSoldSellIconWrapper">
				{/* <div className="popularOfThisArtistSliderSoldIcon">
                    <p className="popularOfThisArtistSliderSoldIconText">
                        Sold
                    </p>
                </div> */}

				{/* <div className="popularOfThisArtistSliderSellIcon">
                    <p className="popularOfThisArtistSliderSellIconText">
                        Sell
                    </p>
                </div> */}
			</div>
		</div>
	)
}

Slide.propTypes = {
	product: PropTypes.shape({
		id: PropTypes.number.isRequired,
		images: PropTypes.arrayOf(
			PropTypes.shape({
				imageUrl: PropTypes.string.isRequired,
			}),
		),
	}).isRequired,
	baseUrl: PropTypes.string.isRequired,
}

const PopularOfThisArtistSlider = ({ products, baseUrl }) => {
	const { t, i18n } = useTranslation()
	const currentLanguage = i18n.language

	return (
		<div className="popularOfThisArtistSliderContainer">
			<div className="popularOfThisArtistSliderWrapper">
				<div className="popularOfThisArtistSliderTopInnerWrapper">
					<div className="popularOfThisArtistSliderTitleWrapper">
						<p className="popularOfThisArtistSliderTitle">
							{t('Популярне цього митця')}
						</p>
					</div>
					{/* <LikeAndShare className={sliderStyles.LikeAndShareFixed} /> */}
				</div>
				<div className="popularOfThisArtistSliderBottomInnerWrapper">
					<Swiper
						modules={[Navigation, Pagination]}
						spaceBetween={0}
						slidesPerView={'auto'}
						navigation
						pagination={{ clickable: false, type: 'fraction' }}
						onSlideChange={() => console.log('slide change')}
						onSwiper={(swiper) => console.log(swiper)}
					>
						{products.map((product) => {
							const title =
								currentLanguage === 'en'
									? product.title_en || product.title
									: product.title_uk || product.title
							const description =
								currentLanguage === 'en'
									? product.description_en ||
									product.description
									: product.description_uk ||
									product.description

							return (
								<SwiperSlide
									key={product.id}
									style={{ width: 'auto' }}
								>
									<Slide
										product={product}
										baseUrl={baseUrl}
									/>
								</SwiperSlide>
							)
						})}
					</Swiper>

					<div className={'${swiper-button-prev}'}></div>
					<div className={'${swiper-pagination}'}></div>
					<div className={'${swiper-button-next}'}></div>
				</div>
			</div>
		</div>
	)
}

PopularOfThisArtistSlider.propTypes = {
	products: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired,
			title_en: PropTypes.string,
			title_uk: PropTypes.string,
			description_en: PropTypes.string,
			description_uk: PropTypes.string,
			images: PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.number.isRequired,
					imageUrl: PropTypes.string.isRequired,
				}),
			),
		}),
	).isRequired,
	baseUrl: PropTypes.string.isRequired,
}

export default PopularOfThisArtistSlider
