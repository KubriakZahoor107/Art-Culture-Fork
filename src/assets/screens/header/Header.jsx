import LikeAndShare from '@components/Blocks/LikeAndShare'
import '@styles/layout/Header.module.scss'
import i18n from 'i18next'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
function Header() {
	const { t } = useTranslation()
	const [mainDropdownVisible, setMainDropdownVisible] = useState(false)
	const [burgerDropdownVisible, setBurgerDropdownVisible] = useState(false)
	const [selectedLanguage, setSelectedLanguage] = useState(
		(Cookies.get('lang') || i18n.language) === 'en'
			? 'English'
			: 'Ukrainian',
	)
	const [burgerMenuVisible, setBurgerMenuVisible] = useState(false)

	useEffect(() => {
		const handleScroll = () => {
			const mainHeader = document.querySelector('.mainHeader')
			const staticHeader = document.querySelector('.staticHeader')

			if (window.scrollY > 177) {
				mainHeader.style.transform = 'translateY(-100%)'
				staticHeader.classList.add('visible')
			} else {
				mainHeader.style.transform = 'translateY(0)'
				staticHeader.classList.remove('visible')
			}
		}

		window.addEventListener('scroll', handleScroll)

		return () => {
			window.removeEventListener('scroll', handleScroll)
		}
	}, [])

	useEffect(() => {
		const burgerButton = document.querySelector('.burgerButton')
		const staticHeaderBurgerButton = document.querySelector(
			'.staticHeaderBurgerButton',
		)
		const handleBurgerClick = () => {
			setBurgerMenuVisible(!burgerMenuVisible)
			setMainDropdownVisible(false)
			setBurgerDropdownVisible(false)
		}

		burgerButton.addEventListener('click', handleBurgerClick)
		staticHeaderBurgerButton.addEventListener('click', handleBurgerClick)

		return () => {
			burgerButton.removeEventListener('click', handleBurgerClick)
			staticHeaderBurgerButton.removeEventListener(
				'click',
				handleBurgerClick,
			)
		}
	}, [burgerMenuVisible])

	const toggleMainDropdown = () => {
		setMainDropdownVisible(!mainDropdownVisible)
		setBurgerDropdownVisible(false)
	}

	const toggleBurgerDropdown = () => {
		setBurgerDropdownVisible(!burgerDropdownVisible)
		setMainDropdownVisible(false)
	}

	const handleLanguageSelect = (language) => {
		setSelectedLanguage(language)
		if (language === 'Ukrainian') {
			i18n.changeLanguage('uk')
			Cookies.set('lang', 'uk')
		} else {
			i18n.changeLanguage('en')
			Cookies.set('lang', 'en')
		}

		setMainDropdownVisible(false)
		setBurgerDropdownVisible(false)
	}

	const closeBurgerMenu = () => {
		setBurgerMenuVisible(false)
		setBurgerDropdownVisible(false)
	}

	const navigate = useNavigate()

	const handleProfileClick = () => {
		closeBurgerMenu()
		navigate('/profile')
	}

	const handleMainPageClick = () => {
		closeBurgerMenu()
		navigate('/main-page')
	}

	const handleNewsPageClick = () => {
		closeBurgerMenu()
		navigate('/news-page')
	}

	const handleArtistsPageClick = () => {
		closeBurgerMenu()
		navigate('/artists-page')
	}

	const handleExhibitionsPageClick = () => {
		closeBurgerMenu()
		navigate('/exhibitions-page')
	}

	const handleMuseumsPageClick = () => {
		closeBurgerMenu()
		navigate('/museums-page')
	}

	const handleArtTermsPageClick = () => {
		closeBurgerMenu()
		navigate('/art-terms')
	}

	const goToMainPage = () => {
		navigate('/main-page')
	}

	const handleSearchFieldClick = () => {
		closeBurgerMenu()
		// Optional: Check if already on search page
		if (window.location.pathname !== '/search') {
			navigate('/search')
		}
	}

	const burgerMenu = (
		<div className="burgerMenu">
			<div className="burgerMenuWrapper">
				<div className="burgerMenuSearchWhithButtonsWrapper">
					<div className="burgerMenuCloseButtonWrapper">
						<img
							className="burgerMenuCloseButtonImg"
							src="/Img/burgerCloseCross.svg"
							alt="close button"
							onClick={closeBurgerMenu}
						/>
					</div>
					<div className="headerLanguageSwitchContainer">
						<button
							className="headerLanguageSwitchButton"
							onClick={toggleBurgerDropdown}
						>
							<p className="headerLanguageSwitchButton__title">
								{selectedLanguage} &#9660;
							</p>
						</button>
						{burgerDropdownVisible && (
							<div className="dropdownMenu">
								<ul>
									<li
										onClick={() =>
											handleLanguageSelect('Ukrainian')
										}
									>
										Ukrainian
									</li>
									<li
										onClick={() =>
											handleLanguageSelect('English')
										}
									>
										English
									</li>
								</ul>
							</div>
						)}
					</div>
					<div className="burgerMenuLoginButtonWrapper">
						<button
							className="socialDownWrapper__loginButton socialDownWrapperButton circleButton burgerMenuLoginButton"
							onClick={handleProfileClick}
						>
							<img src="/Img/login.svg" alt="Login" />
						</button>
					</div>
				</div>
				<div className="burgerMenuSearchWrapper">
					<input
						className="burgerMenuSearchInput"
						type="text"
						placeholder={t('Пошук')}
						onFocus={handleSearchFieldClick}
						// or onClick={handleSearchFieldClick}
					/>
				</div>
				{/* <Search
					className={searchStyle.burgerMenuSearchWrapper}
					styleInput={{ width: '100%', height: '100%' }}
					// searchInput={searchStyle.burgerMenuSearchInput}
				/> */}
				<div className="burgerMenuFooterWrapper">
					<nav className="footerMenuWrapper">
						<ul className="footerMenuUl">
							<li
								className="footerMenuLi"
								onClick={handleMainPageClick}
							>
								<a className="footerMenuLink" href="#">
									<p>{t('Головна')}</p>
									<p>&#8250;</p>
								</a>
							</li>
							<li
								className="footerMenuLi"
								onClick={handleNewsPageClick}
							>
								<a className="footerMenuLink" href="#">
									<p>{t('Новини')}</p>
									<p>&#8250;</p>
								</a>
							</li>
							<li
								className="footerMenuLi"
								onClick={handleArtistsPageClick}
							>
								<a className="footerMenuLink" href="#">
									<p>{t('Митці')}</p>
									<p>&#8250;</p>
								</a>
							</li>
							<li
								className="footerMenuLi"
								onClick={handleExhibitionsPageClick}
							>
								<a className="footerMenuLink" href="#">
									<p>{t('Виставки')}</p>
									<p>&#8250;</p>
								</a>
							</li>
							<li
								className="footerMenuLi"
								onClick={handleMuseumsPageClick}
							>
								<a className="footerMenuLink" href="#">
									<p>{t('Музеї')}</p>
									<p>&#8250;</p>
								</a>
							</li>
							{/* <li className='footerMenuLi'>
								<a className='footerMenuLink' href='#'>
									<p>{t('Архітектура')}</p>
									<p>&#8250;</p>
								</a>
							</li> */}
							<li className="footerMenuLi">
								<a className="footerMenuLink" href="#">
									<p>{t('Арт терміни')}</p>
									<p>&#8250;</p>
								</a>
							</li>
							<li className="footerMenuLi">
								<a className="footerMenuLink" href="#">
									<p>{t('Що поруч')}</p>
									<p>&#8250;</p>
								</a>
							</li>
							<li className="footerMenuLi">
								<a className="footerMenuLink" href="#">
									<p>{t('Контакти')}</p>
									<p>&#8250;</p>
								</a>
							</li>
						</ul>
					</nav>
				</div>

				<div className="burgerMenuBottomWrapper">
					<div className="burgerMenuSocialTopWrapper">
						<p className="socialDownWrapper__followUsTitle burgerMenuFollowUsTitle">
							follow us
						</p>
					</div>
					<div className="burgerMenuSocialMiddleWrapper">
						<button className="socialDownWrapper__facebookButton socialDownWrapperButton circleButton burgerMenuFacebookButton">
							<img src="/Img/fasebook.svg" alt="Facebook" />
						</button>
						<button className="socialDownWrapper__instagramButton socialDownWrapperButton circleButton burgerMenuInstagramButton">
							<img src="/Img/instagram.svg" alt="Instagram" />
						</button>
						<button className="socialDownWrapper__twitterButton socialDownWrapperButton circleButton burgerMenuTwitterButton">
							<img src="/Img/twitter.svg" alt="Twitter" />
						</button>
						<button className="socialDownWrapper__mailButton socialDownWrapperButton circleButton burgerMenuMailButton">
							<img src="/Img/mail.svg" alt="Mail" />
						</button>
					</div>
					<div className="burgerMenuSocialBottomWrapper">
						<div className="footerContactsLinkWrapper footerContactsLinkWrapperPlayUkraine footerContactsLinkWrapperPlayUkraine">
							<a
								className="footerContactsLink footerContactsLinkPlayUkraine"
								href="#"
							>
								<img
									className="footerContactsLinkImg footerContactsLinkImgPlayUkraine burgerMenuPlayUkraine"
									src="/Img/footerPlayUkraine.png"
									alt="PlayUkraine"
								/>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	)

	return (
		<>
			<header>
				<div className="mainHeader">
					<div className="mainHeaderWrapper">
						<div
							className="mainHeaderLogo logo"
							onClick={goToMainPage}
						>
							<img
								className="logo__img"
								src="/Img/logo.svg"
								alt="Art & culture Ukraine"
							/>
							<div className="logo__titleWrapper">
								<p className="logo__firstWord white">art</p>
								<p className="logo__secondWord white">
									&culture
								</p>
								<p className="logo__thirdWord white">Ukraine</p>
							</div>
						</div>
						<div className="titleContainer">
							<div className="titleWrapper">
								<div className="headerLanguageSwitchContainer">
									<button
										className="headerLanguageSwitchButton"
										onClick={toggleMainDropdown}
									>
										<p className="headerLanguageSwitchButton__title">
											{selectedLanguage} &#9660;
										</p>
									</button>
									{mainDropdownVisible && (
										<div className="dropdownMenu">
											<ul>
												<li
													onClick={() =>
														handleLanguageSelect(
															'Ukrainian',
														)
													}
												>
													Ukrainian
												</li>
												<li
													onClick={() =>
														handleLanguageSelect(
															'English',
														)
													}
												>
													English
												</li>
											</ul>
										</div>
									)}
								</div>
								<div className="headerTitle">
									Ukrainian art & culture online
								</div>
							</div>
							<nav className="mainMenuContainer">
								<ul className="mainMenu__ul">
									<li
										className="mainMenu__li"
										onClick={handleMainPageClick}
									>
										<a className="mainMenu__link" href="#">
											{t('Головна')}
										</a>
									</li>
									<li
										className="mainMenu__li"
										onClick={handleNewsPageClick}
									>
										<a className="mainMenu__link" href="#">
											{t('Новини')}
										</a>
									</li>
									<li
										className="mainMenu__li"
										onClick={handleArtistsPageClick}
									>
										<a className="mainMenu__link" href="#">
											{t('Митці')}
										</a>
									</li>
									<li
										className="mainMenu__li"
										onClick={handleExhibitionsPageClick}
									>
										<a className="mainMenu__link" href="#">
											{t('Виставки')}
										</a>
									</li>
									<li
										className="mainMenu__li"
										onClick={handleMuseumsPageClick}
									>
										<a className="mainMenu__link" href="#">
											{t('Музеї')}
										</a>
									</li>
									<li
										className="mainMenu__li"
										onClick={handleArtTermsPageClick}
									>
										<a className="mainMenu__link" href="#">
											{t('Арт терміни')}
										</a>
									</li>
								</ul>
							</nav>
						</div>
						<div className="socialContainer">
							<div className="socialUpperWrapper">
								<LikeAndShare className="dark large-hidden" />
								<div className="burgerButtonWrapper">
									<button className="burgerButton">
										<img
											className="burgerButton__img"
											src="/Img/burgerButtonIcon.svg"
											alt="Menu"
										/>
										<p className="burgerButton__title">
											{t('Меню')}
										</p>
									</button>
								</div>
							</div>
							<div className="socialDownWrapper">
								<p className="socialDownWrapper__followUsTitle">
									follow us
								</p>
								<button className="socialDownWrapper__facebookButton socialDownWrapperButton circleButton">
									<img
										src="/Img/fasebook.svg"
										alt="Facebook"
									/>
								</button>
								<button className="socialDownWrapper__instagramButton socialDownWrapperButton circleButton">
									<img
										src="/Img/instagram.svg"
										alt="Instagram"
									/>
								</button>
								<button className="socialDownWrapper__twitterButton socialDownWrapperButton circleButton">
									<img src="/Img/twitter.svg" alt="Twitter" />
								</button>
								<button className="socialDownWrapper__mailButton socialDownWrapperButton circleButton">
									<img src="/Img/mail.svg" alt="Mail" />
								</button>
								<div className="socialDownWrapper__separator"></div>
								<button
									className="socialDownWrapper__loginButton socialDownWrapperButton circleButton"
									onClick={handleProfileClick}
								>
									<img src="/Img/login.svg" alt="Login" />
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="staticHeader">
					<div className="staticHeaderWrapper">
						<div
							className="staticHeaderLogo"
							onClick={goToMainPage}
						>
							<p className="staticHeaderLogoTitle">art</p>
						</div>
						<div className="staticHeaderTitleContainer">
							<button className="staticHeaderTitleContainer__likeButton circleButton">
								<img src="/Img/likeHeart.svg" alt="Like" />
							</button>
							<h2 className="staticHeaderTitle">
								Ukrainian art & culture online
							</h2>
							<button className="staticHeaderTitleContainer__shareButton circleButton">
								<img src="/Img/shareArrow.svg" alt="Share" />
							</button>
						</div>
						<div className="staticHeaderLoginContainer">
							<button
								className="staticHeaderLoginContainer__loginButton circleButton"
								onClick={handleProfileClick}
							>
								<img src="/Img/loginBlack.svg" alt="Login" />
							</button>
							<div className="staticHeaderLoginContainer__separator">
								<img
									className="separatorImg"
									src="/Img/verticalSeparatorBlack.svg"
									alt="button separator"
								/>
							</div>
							<button className="burgerButton staticHeaderBurgerButton">
								<img
									className="burgerButton__img"
									src="/Img/burgerButtonIcon.svg"
									alt="Menu"
								/>
								<p className="burgerButton__title">
									{t('Меню')}
								</p>
							</button>
						</div>
					</div>
				</div>
			</header>
			{burgerMenuVisible && (
				<div
					className="burgerMenuBackdrop"
					onClick={closeBurgerMenu}
				></div>
			)}
			{burgerMenuVisible && burgerMenu}
		</>
	)
}

export default Header
