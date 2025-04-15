import { useState } from 'react'
import { debounce } from 'lodash'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'
import styles from '@styles/layout/MainPage.module.scss'
import MainArtists from '@components/Blocks/MainArtists.jsx'
import MainExhibitions from '@components/Blocks/MainExhibitions.jsx'
import MainMuseums from '@components/Blocks/MainMuseums.jsx'
import MainNews from '@components/Blocks/MainNews.jsx'
import MainPageBannerSlider from '@components/Sliders/MainPageBannerSlider/MainPageBannerSlider.jsx'
import MainInstagramSlider from '@components/Sliders/MainInstagramSlider/MainInstagramSlider.jsx'
import MainPopularArtsSlider from '@components/Sliders/MainPopularArtsSlider/MainPopularArtsSlider.jsx'
function MainPage() {
	const { t } = useTranslation()
	const [isExpanded, setIsExpanded] = useState(false)

	const toggleText = () => {
		setIsExpanded(prevState => !prevState)
	}
	const handleScroll = useCallback(
		debounce(() => {
			console.log('Scrolling...')
		}, 100),

		[]
	)

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)
		return () => window.removeEventListener('scroll', handleScroll)
	}, [handleScroll])
	return (
		<div className={`${styles.mainPage}`}>
			<MainPageBannerSlider />
			<div className={`${styles.mainPageWelcomeTitleWrapper}`}>
				<h1 className={`${styles.welcomeTitle}`}>
					{t('Вітаємо на ukrainian art&culture')}
				</h1>
				<div
					className={`${styles.mainPageDescriptionWrapper} ${isExpanded ? styles.expanded : ''}`}
				>
					<p className={`${styles.welcomeParagraph}`}>
						Lorem Ipsum є, фактично, стандартною &#8220;рибою&#8221; аж з XVI сторіччя, коли&#8194;
						<a className={`${styles.mainPageWelcomeTitleParagraphLink}`}>
							невідомий друкар
						</a>{' '}
						взяв шрифтову гранку та склав на ній підбірку зразків шрифтів. &#8220;Риба&#8221;
						не тільки успішно пережила п'ять століть, але й прижилася в
						електронному верстуванні, залишаючись по суті незмінною... Lorem Ipsum
						є, фактично, стандартною &#8220;рибою&#8221; аж з XVI сторіччя, коли невідомий
						друкар взяв шрифтову гранку Lorem Ipsum є, фактично, стандартною
						&#8220;рибою&#8221; аж з&#8194;
						<a className={`${styles.mainPageWelcomeTitleParagraphLink}`}>
							XVI сторіччя
						</a>
						, коли&#8194;
						<a className={`${styles.mainPageWelcomeTitleParagraphLink}`}>
							невідомий друкар
						</a>&#8194;
						взяв шрифтову гранку та склав на ній підбірку зразків шрифтів. &#8220;Риба&#8221;
						не тільки успішно пережила п'ять століть, але й прижилася в
						електронному верстуванні, залишаючись по суті незмінною... <br />
						Lorem Ipsum є, фактично, стандартною &#8220;рибою&#8221; аж з&#8194;
						<a className={`${styles.mainPageWelcomeTitleParagraphLink}`}>
							XVI сторіччя
						</a>
						, коли невідомий друкар взяв шрифтову гранку Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta porro accusamus sapiente? Dolor earum ipsa nobis pariatur labore, enim, repellat rerum saepe veniam impedit voluptas, ducimus voluptates exercitationem doloremque assumenda. {' '}
					</p>
				</div>
				<button
					className={`${styles.mainPageWelcomeTitleParagraphReadMoreButton}`}
					onClick={toggleText}
				>
					{isExpanded ? t('Згорнути текст') : t('Читати далі')}
				</button>
			</div>
			<MainNews />
			<MainArtists />
			<MainInstagramSlider />
			<MainExhibitions />
			<MainMuseums />
			<MainPopularArtsSlider />
		</div>
	)
}

export default MainPage
