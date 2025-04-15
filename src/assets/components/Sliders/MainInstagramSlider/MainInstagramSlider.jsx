import axios from 'axios'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

// Import Swiper modules
import { Navigation, Pagination } from 'swiper/modules'

import '/src/styles/components/Sliders/MainInstagramSlider/MainInstagramSlider.scss'

const Slide = ({ post }) => {
	const { t } = useTranslation()
	return (
		<div className='mainInstagramSliderCardWrapper'>
			<div className='mainInstagramSliderCardTopInnerWrapper'>
				<div className='mainInstagramSliderCardUserPhotoWrapper'>
					<img
						className='mainInstagramSliderCardUserPhoto'
						src={'/Img/mainInstagramSliderUserPhoto.png'}
						alt={t('Фотографія автора')}
						onError={e => {
							e.target.onerror = null
							e.target.src = '/Img/mainInstagramSliderUserPhoto.png'
						}}
					/>
				</div>
				<div className='mainInstagramSliderCardUserNameWrapper'>
					<p className='mainInstagramSliderCardUserName'>ukr_art&culture</p>
				</div>
				<div className='mainInstagramSliderCardDateWrapper'>
					<p className='mainInstagramSliderCardDate'>3 days ago</p>
				</div>
			</div>
			<div className='mainInstagramSliderCardMiddleInnerWrapper'>
				<img
					className='mainInstagramSliderCardImg'
					src={'/Img/mainInstagramSliderIMG.jpg'}
					alt={t('Світлина автора')}
					onError={e => {
						e.target.onerror = null
						e.target.src = '/Img/mainInstagramSliderIMG.jpg'
					}}
				/>
			</div>
			<div className='mainInstagramSliderCardBottomInnerWrapper'>
				<div className='mainInstagramSliderCardDescriptionWrapper'>
					<p className='mainInstagramSliderCardDescription'>
						{t(
							'Lorem Ipsum є, фактично, стандартною "рибою" аж з XVI сторіччя, коли невідомий друкар взяв шрифтову гранку та склав на ній підбірку зразків шрифтів.'
						)}
					</p>
				</div>
			</div>
		</div>
	)
}

const MainInstagramSlider = () => {
	const { t } = useTranslation()
	const [posts, setPosts] = useState([])
	const [error, setError] = useState(null)

	useEffect(() => {
		const fetchInstagramPosts = async () => {
			try {
				const response = await axios.get(``)
				setPosts(response.data.data)
			} catch (error) {
				console.error('Error fetching Instagram post data', error)
				setError(error)
			}
		}

		fetchInstagramPosts()
	}, [])

	return (
		<div className='mainInstagramSliderContainer'>
			<div className='mainInstagramSliderWrapper'>
				<div className='mainInstagramSliderTopInnerWrapper'>
					<div className='mainInstagramSliderTitleWrapper'>
						<h2 className='mainInstagramSliderTitle'>{t('on instagram')}</h2>
					</div>
					<div className='mainInstagramSliderFollowUsWrapper'>
						<div className='mainInstagramSliderFollowUsButtonWrapper'>
							<button className='mainInstagramSliderFollowUsButton'>
								<p className='mainInstagramSliderFollowUsButtonText'>
									{t('Follow us')}
								</p>
							</button>
						</div>
					</div>
				</div>
				<div className='mainInstagramSliderMiddleInnerWrapper'>
					<Swiper
						modules={[Navigation, Pagination]}
						spaceBetween={0}
						slidesPerView={'auto'}
						navigation
						pagination={{ clickable: false, type: 'fraction' }}
						onSlideChange={() => console.log('slide change')}
						onSwiper={swiper => console.log(swiper)}
					>
						<SwiperSlide>
							<Slide />
						</SwiperSlide>
						<SwiperSlide>
							<Slide />
						</SwiperSlide>
						<SwiperSlide>
							<Slide />
						</SwiperSlide>
						<SwiperSlide>
							<Slide />
						</SwiperSlide>
						<SwiperSlide>
							<Slide />
						</SwiperSlide>
						<SwiperSlide>
							<Slide />
						</SwiperSlide>
						<SwiperSlide>
							<Slide />
						</SwiperSlide>
					</Swiper>
					<div className={'${swiper-button-prev}'}></div>
					<div className={'${swiper-pagination}'}></div>
					<div className={'${swiper-button-next}'}></div>
				</div>
			</div>
		</div>
	)
}

export default MainInstagramSlider
