// import Swiper core and required modules
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import '@styles/components/Sliders/AllArtistsPageSearchSlider/AllArtistsPageSearchSlider.scss'
import 'swiper/css'
import 'swiper/css/navigation'

function AllArtistsPageSearchSlider({
	letters,
	onLetterSelected,
	selectedLetter,
}) {
	return (
		<div className="SliderContainer">
			<Swiper
				modules={[Navigation]}
				spaceBetween={10}
				slidesPerView={'auto'}
				navigation
			>
				{letters.map((letter) => (
					<SwiperSlide key={letter}>
						<div
							className="LetterContainer"
							onClick={() => onLetterSelected(letter)}
						>
							<h3
								className={
									'Letter' +
									(selectedLetter === letter
										? ' selected'
										: '')
								}
							>
								{letter}
							</h3>
						</div>
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	)
}

export default AllArtistsPageSearchSlider
