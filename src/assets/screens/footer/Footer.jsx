import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import styles from '/src/styles/layout/Footer.module.scss'

const Footer = () => {
	const { t } = useTranslation()

	const navigate = useNavigate()

	const handleMainPageClick = () => {
		navigate('/main-page')
	}

	const handleNewsPageClick = () => {
		navigate('/news-page')
	}

	const handleArtistsPageClick = () => {
		navigate('/artists-page')
	}

	const handleExhibitionsPageClick = () => {
		navigate('/exhibitions-page')
	}

	const handleMuseumsPageClick = () => {
		navigate('/museums-page')
	}

	const goToMainPage = () => {
		navigate('/main-page')
	}

	return (
		<footer className={`${styles.footer}`}>
			<div className={`${styles.footerWrapper}`}>
				<div className={`${styles.footerLeftWrapper}`}>
					<div
						className={`${styles.footerLogoWrapper}`}
						onClick={goToMainPage}
					>
						<img
							className={`${styles.footerLogoImg}`}
							src="/Img/logo.svg"
							alt="Art & culture Ukraine"
						/>
						<div className={`${styles.footerLogoTitleWrapper}`}>
							<p className={`${styles.footerLogoFirstWord}`}>
								art
							</p>
							<p className={`${styles.footerLogoSecondWord}`}>
								&culture
							</p>
							<p className={`${styles.footerLogoThirdWord}`}>
								Ukraine
							</p>
						</div>
					</div>

					<nav className={`${styles.footerMenuWrapper}`}>
						<ul className={`${styles.footerMenuUl}`}>
							<li
								className={`${styles.footerMenuLi}`}
								onClick={handleMainPageClick}
							>
								<a
									className={`${styles.footerMenuLink}`}
									href="#"
								>
									{t('Головна')}
								</a>
							</li>
							{/* <li className={`${styles.footerMenuLi}`}>
								<a className={`${styles.footerMenuLink}`} href='#'>
									{t('Архітектура')}
								</a>
							</li> */}
							<li
								className={`${styles.footerMenuLi}`}
								onClick={handleNewsPageClick}
							>
								<a
									className={`${styles.footerMenuLink}`}
									href="#"
								>
									{t('Новини')}
								</a>
							</li>
							<li className={`${styles.footerMenuLi}`}>
								<a
									className={`${styles.footerMenuLink}`}
									href="#"
								>
									{t('Арт терміни')}
								</a>
							</li>
							<li
								className={`${styles.footerMenuLi}`}
								onClick={handleArtistsPageClick}
							>
								<a
									className={`${styles.footerMenuLink}`}
									href="#"
								>
									{t('Митці')}
								</a>
							</li>
							<li className={`${styles.footerMenuLi}`}>
								<a
									className={`${styles.footerMenuLink}`}
									href="#"
								>
									{t('Що поруч')}
								</a>
							</li>
							<li
								className={`${styles.footerMenuLi}`}
								onClick={handleExhibitionsPageClick}
							>
								<a
									className={`${styles.footerMenuLink}`}
									href="#"
								>
									{t('Виставки')}
								</a>
							</li>
							<li className={`${styles.footerMenuLi}`}>
								<a
									className={`${styles.footerMenuLink}`}
									href="#"
								>
									{t('Контакти')}
								</a>
							</li>
							<li
								className={`${styles.footerMenuLi}`}
								onClick={handleMuseumsPageClick}
							>
								<a
									className={`${styles.footerMenuLink}`}
									href="#"
								>
									{t('Музеї')}
								</a>
							</li>
						</ul>
					</nav>
				</div>

				<div className={`${styles.footerSeparatorWrapper}`}>
					<img
						className={`${styles.footerSeparatorImg}`}
						src="/Img/footerSeparator.svg"
						alt="separator"
					/>
				</div>

				<div className={`${styles.footerRightWrapper}`}>
					<div className={`${styles.footerTopInner}`}>
						<div className={`${styles.footerSocialWrapper}`}>
							<div className={`${styles.footerFollowUsWrapper}`}>
								<p className={`${styles.footerFollowUsTitle}`}>
									follow us
								</p>
							</div>
							<div
								className={`${styles.footerSociaButtonslWrapper}`}
							>
								<button
									className={`${styles.footerFacebookButton} ${styles.footerSocialButton}`}
								>
									<img
										className={`${styles.footerFacebookButtonImg}`}
										src="/Img/fasebook.svg"
										alt="facebook"
									/>
								</button>
								<button
									className={`${styles.footerInstagramButton} ${styles.footerSocialButton}`}
								>
									<img
										className={`${styles.footerInstagramButtonImg}`}
										src="/Img/instagram.svg"
										alt="instagram"
									/>
								</button>
								<button
									className={`${styles.footerTwitterButton} ${styles.footerSocialButton}`}
								>
									<img
										className={`${styles.footerTwitterButtonImg}`}
										src="/Img/twitter.svg"
										alt="twitter"
									/>
								</button>
							</div>
						</div>

						<div className={`${styles.footerContactsWrapper}`}>
							{/* <div className={`${styles.footerContactsTitleWrapper}`}>
								<p className={`${styles.footerContactsTitle}`}>{t('Контакти')}</p>
							</div> */}
							<div
								className={`${styles.footerContactsLinkWrapper}`}
							>
								<a
									className={`${styles.footerContactsLink}`}
									href="#"
								>
									<img
										className={`${styles.footerContactsLinkImg}`}
										src="/Img/footerPlayUkraine.png"
										alt="PlayUkraine"
									/>
								</a>
							</div>
						</div>
					</div>

					<div className={`${styles.footerBottomInner}`}>
						<div className={`${styles.footerLegalWrapper}`}>
							<a className={`${styles.footerLegalLink}`} href="#">
								<p className={`${styles.footerLegalLinkText}`}>
									{t('Юридична інформація')}
								</p>
							</a>
						</div>
						<div className={`${styles.footerPolicyWrapper}`}>
							<a
								className={`${styles.footerPolicyLink}`}
								href="#"
							>
								<p className={`${styles.footerPolicyLinkText}`}>
									{t('Політика конфіденційності')}
								</p>
							</a>
						</div>
						<div className={`${styles.footerCopyrightWrapper}`}>
							<a
								className={`${styles.footerCopyrightLink}`}
								href="#"
							>
								<p
									className={`${styles.footerCopyrightLinkText}`}
								>
									{t('Авторські права')}
								</p>
							</a>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
